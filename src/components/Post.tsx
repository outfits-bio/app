import { inferRouterOutputs } from "@trpc/server"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { User } from "next-auth"
import { useState } from "react"
import toast from "react-hot-toast"
import { PiDotsThreeBold, PiHammer, PiSealCheck, PiShareFatBold } from "react-icons/pi"
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

    const handleShare = (postId: string) => {
        const origin =
            typeof window !== 'undefined' && window.location.origin
                ? window.location.origin
                : '';

        const url = `${origin}${asPath}?postId=${postId}`;

        navigator.clipboard.writeText(url);

        toast.success('Copied post link to clipboard!');
    }

    const truncatedTagline = post.user.tagline && (post.user.tagline.length > 20 ? `${post.user.tagline.slice(0, 20)}...` : post.user.tagline);

    return <div className="snap-start border-2 border-stroke rounded-lg w-[350px] py-4 flex flex-col items-center gap-2 md:gap-4 md:mt-3">
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
                <p className="text-sm font-medium text-secondary-text">{truncatedTagline && `${truncatedTagline} - `}{getPostTypeName(post.type).toLowerCase()}</p>
            </div>
        </Link>

        <Link href={`/discover?postId=${post.id}`} className="relative w-[305px] h-[500px] md:w-[320px] md:h-[524px] rounded-md overflow-hidden border border-stroke">
            <Image
                src={formatImage(post.image, post.user.id)}
                className="object-cover"
                fill
                alt={post.type}
                priority
            />
        </Link>

        <div className="flex px-4 justify-between items-center w-full">
            <div className="flex gap-2">
                <Button variant="outline-ghost" centerItems shape={'circle'} iconLeft={<PiShareFatBold />} onClick={() => handleShare(post.id)} />
            </div>


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
}