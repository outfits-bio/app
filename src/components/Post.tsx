import { Popover, Transition } from "@headlessui/react"
import { inferRouterOutputs } from "@trpc/server"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { User } from "next-auth"
import { Fragment, useState } from "react"
import toast from "react-hot-toast"
import { PiBookmarkSimpleBold, PiBookmarkSimpleFill, PiChatCircleBold, PiDotsThreeBold, PiHammer, PiHeartBold, PiHeartFill, PiSealCheck, PiShareFatBold } from "react-icons/pi"
import { AddReactionInput } from "~/schemas/post.schema"
import { AppRouter } from "~/server/api/root"
import { api } from "~/utils/api.util"
import { handleErrors } from "~/utils/handle-errors.util"
import { formatImage } from "~/utils/image-src-format.util"
import { Avatar } from "./Avatar"
import { Button } from "./Button"
import { DeleteModal } from "./DeleteModal"
import { PostMenu } from "./Menus/PostMenu"
import { getPostTypeName } from "./PostSection/post-section.util"
import { ReportModal } from "./ReportModal"

type RouterOutput = inferRouterOutputs<AppRouter>['post'];

interface PostProps {
    post: RouterOutput['getLatestPosts']['posts'][number];
    user?: User;
}

export const Post = ({ post, user }: PostProps) => {
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
    const [confirmDeleteUserModalOpen, setConfirmDeleteUserModalOpen] = useState(false);
    const [likeAnimation, setLikeAnimation] = useState(false);

    const ctx = api.useContext();

    const closeModal = () => {
        push('/discover');
    }

    const { mutate } = api.admin.deletePost.useMutation({
        onSuccess: () => {
            toast.success('Post deleted successfully!');
            ctx.post.getLatestPosts.refetch();
            ctx.post.getPostsAllTypes.refetch();
            closeModal();
        },
        onError: (e) => handleErrors({ e, message: 'An error occurred while deleting this post.' })
    });

    /**
     * This deletes the post
     * The image gets removed from the s3 bucket in the backend
     * onMutate, onError, and onSettled are custom functions in ./post-section.util.ts that handle optimistic updates
     */
    const { mutate: deletePost } = api.post.deletePost.useMutation({
        onSuccess: () => {
            toast.success('Post deleted successfully!');
            ctx.post.getLatestPosts.refetch();
            ctx.post.getPostsAllTypes.refetch();
            closeModal();
        },
        onError: (e) => handleErrors({ e, message: 'An error occurred while deleting this post.' })
    });

    const { asPath, push } = useRouter();

    const handleDeletePost = () => {
        setConfirmDeleteModalOpen(true);
    }

    const handleDeleteUserPost = () => {
        setConfirmDeleteUserModalOpen(true);
    }

    const { mutate: toggleLikePost, isLoading: toggleLikePostLoading } = api.post.toggleLikePost.useMutation({
        onSuccess: () => {
            ctx.post.getLatestPosts.refetch();
            ctx.post.getPostsAllTypes.refetch({ id: post.user.id });
        },
        onError: (e) => handleErrors({ e, message: 'An error occurred while liking this post.' })
    });

    const { mutate: addReaction, isLoading: addReactionloading, variables } = api.post.addReaction.useMutation({
        onSuccess: () => {
            ctx.post.getLatestPosts.refetch();
            ctx.post.getPostsAllTypes.refetch({ id: post.user.id });
        },
        onError: (e) => handleErrors({ e, message: 'An error occurred while reacting to this post.' })
    });

    const { mutate: removeReaction } = api.post.removeReaction.useMutation({
        onSuccess: () => {
            ctx.post.getLatestPosts.refetch();
            ctx.post.getPostsAllTypes.refetch({ id: post.user.id });
        },
        onError: (e) => handleErrors({ e, message: 'An error occurred while removing your reaction to this post.' })
    });

    const { mutate: addToWishlist, isLoading: addToWishlistloading } = api.post.addToWishlist.useMutation({
        onSuccess: () => {
            ctx.post.getLatestPosts.refetch();
            ctx.post.getPostsAllTypes.refetch({ id: post.user.id });
            ctx.post.getWishlist.refetch();
        },
        onError: (e) => handleErrors({ e, message: 'An error occurred while adding this post to your wishlist.' })
    });

    const { mutate: removeFromWishlist, isLoading: removeFromWishlistLoading } = api.post.removeFromWishlist.useMutation({
        onSuccess: () => {
            ctx.post.getLatestPosts.refetch();
            ctx.post.getPostsAllTypes.refetch({ id: post.user.id });
            ctx.post.getWishlist.refetch();
        },
        onError: (e) => handleErrors({ e, message: 'An error occurred while removing this post from your wishlist.' })
    });

    const handleShare = (postId: string) => {
        const origin =
            typeof window !== 'undefined' && window.location.origin
                ? window.location.origin
                : '';

        const url = `${origin}${asPath}?postId=${postId}`;

        navigator.clipboard.writeText(url);

        toast.success('Copied post link to clipboard!');
    }

    const handleToggleReact = (content: AddReactionInput['emoji']) => {
        const reaction = post.reactions.find(r => r.content === content);

        if (reaction) {
            removeReaction({ id: reaction.id });
        } else {
            addReaction({ id: post.id, emoji: content });
        }
    }

    const handleToggleWishlist = () => {
        const wishlist = post.wishlists.find(w => w.id === user?.id);

        if (wishlist) {
            removeFromWishlist({ id: wishlist.id });
        } else {
            addToWishlist({ id: post.id });
        }
    }

    const reactionLoading = (content: AddReactionInput['emoji']) => {
        if (addReactionloading && variables?.emoji === content) {
            return true;
        }

        return false;
    }

    const truncatedTagline = post.user.tagline && (post.user.tagline.length > 20 ? `${post.user.tagline.slice(0, 20)}...` : post.user.tagline);

    return <div className="snap-start border-2 border-stroke rounded-lg 2xs-h:w-[250px] xs-h:w-[300px] sm-h:w-[320px] w-[350px] max-h-full py-4 flex flex-col items-center gap-2 md:gap-4 md:mt-3">
        {reportModalOpen && <ReportModal isOpen={reportModalOpen} setIsOpen={setReportModalOpen} type='POST' id={post.id} />}
        {confirmDeleteModalOpen && <DeleteModal isOpen={confirmDeleteModalOpen} setIsOpen={setConfirmDeleteModalOpen} post admin deleteFn={() => {
            mutate({ id: post.id });
            push('/discover');
        }} />}
        {confirmDeleteUserModalOpen && <DeleteModal isOpen={confirmDeleteUserModalOpen} setIsOpen={setConfirmDeleteUserModalOpen} post deleteFn={() => {
            deletePost({ id: post.id });
        }} />}

        <Link href={`/${post.user.username}`} className="flex gap-2 items-center w-full px-4 font-clash">
            <Avatar
                image={post.user.image}
                id={post.user.id}
                username={post.user.username}
                size={'sm'}
            />

            <div className="flex flex-col justify-center">
                <p className="font-medium flex items-center gap-1">{post.user.username} {post.user.admin ? <PiHammer className='w-4 h-4' /> : post.user.verified && <PiSealCheck className='w-4 h-4' />}</p>
                <p className="text-sm font-medium text-secondary-text 2xs-h:hidden inline">{truncatedTagline && `${truncatedTagline} - `}{getPostTypeName(post.type).toLowerCase()}</p>
                <p className="text-sm font-medium text-secondary-text 2xs-h:inline hidden">{getPostTypeName(post.type).toLowerCase()}</p>
            </div>
        </Link>

        <Link href={`/discover?postId=${post.id}`} className="relative w-[305px] 3xs-h:w-[199px] 3xs-h:h-[325px] 2xs-h:w-[214px] 2xs-h:h-[350px] xs-h:w-[244px] xs-h:h-[400px] sm-h:w-[275px] sm-h:h-[450px] h-[500px] md:w-[320px] md:h-[524px] rounded-md overflow-hidden border border-stroke">
            <Image
                src={formatImage(post.image, post.user.id)}
                className="object-cover"
                fill
                alt={post.type}
                priority
            />
        </Link>

        <p className="text-sm font-clash text-secondary-text font-medium self-start pl-4 flex gap-1">
            {post._count.likes > 0 && <span className="flex gap-1"><span className="font-bold">{post._count.likes}</span> {post._count.likes === 1 ? ' like' : ' likes'}
                {post._count.reactions || post._count.wishlists ? ', ' : ''}
            </span>}
            {post._count.reactions > 0 && <span className="flex gap-1"><span className="font-bold">{post._count.reactions}</span> {post._count.reactions === 1 ? ' reaction' : ' reactions'}
                {post._count.wishlists ? ', ' : ''}
            </span>}
            {post._count.wishlists > 0 && <span className="flex gap-1"><span className="font-bold">{post._count.wishlists}</span> {post._count.wishlists === 1 ? ' wishlist' : ' wishlists'}</span>}
        </p>

        <div className="flex px-4 justify-between items-center w-full">
            <div className="flex gap-2">
                <Button
                    variant="outline-ghost"
                    centerItems
                    shape={'circle'}
                    onClick={() => {
                        setLikeAnimation(true);
                        toggleLikePost({ id: post.id });
                    }}
                    iconLeft={

                        (post.authUserHasLiked) ? (
                            <PiHeartFill
                                onAnimationEnd={() => setLikeAnimation(false)}
                                className={likeAnimation ? 'animate-ping fill-black dark:fill-white' : ''}
                            />
                        ) : (
                            <PiHeartBold
                                onAnimationEnd={() => setLikeAnimation(false)}
                                className={likeAnimation ? 'animate-ping fill-black dark:fill-white' : ''}
                            />
                        )}

                    disabled={toggleLikePostLoading}
                />

                <Popover className="relative">
                    <Popover.Button>
                        <Button variant={'outline-ghost'} centerItems shape={'circle'} iconLeft={<PiChatCircleBold />} />
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute left-1/2 z-10 bottom-14 w-[120px] -translate-x-1/2 transform px-4 sm:px-0">
                            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                <div className="relative flex justify-between items-center gap-1 bg-white p-2 text-2xl">
                                    <Button variant={post.reactions.find(p => p.content === '🔥') ? 'primary' : 'outline-ghost'} isLoading={reactionLoading('🔥')} centerItems shape={'circle'} onClick={() => handleToggleReact('🔥')}>
                                        {reactionLoading('🔥') ? '' : '🔥'}
                                    </Button>
                                    <Button variant={post.reactions.find(p => p.content === '❤️') ? 'primary' : 'outline-ghost'} isLoading={reactionLoading('❤️')} centerItems shape={'circle'} onClick={() => handleToggleReact('❤️')}>
                                        {reactionLoading('❤️') ? '' : '❤️'}
                                    </Button>
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </Popover>
                <Button
                    variant={'outline-ghost'}
                    centerItems
                    shape={'circle'}
                    iconLeft={(!addToWishlistloading && !removeFromWishlistLoading) && (post.wishlists.find(w => w.id === user?.id) ? <PiBookmarkSimpleBold /> : <PiBookmarkSimpleFill />)}
                    onClick={handleToggleWishlist}
                    isLoading={addToWishlistloading || removeFromWishlistLoading}
                />
                <Button variant="outline-ghost" centerItems shape={'circle'} iconLeft={<PiShareFatBold />} onClick={() => handleShare(post.id)} />
            </div>


            <div className="block sm-h:hidden">
                {user && <PostMenu
                    handleDeleteUserPost={handleDeleteUserPost}
                    handleDeletePost={handleDeletePost}
                    setReportModalOpen={setReportModalOpen}
                    user={user}
                    userIsProfileOwner={user.id === post?.user.id}
                    button={<Button variant="ghost" centerItems shape={'circle'} iconLeft={<PiDotsThreeBold />} />}
                />}
            </div>
        </div>
    </div>
}