import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Dispatch, Fragment, SetStateAction, useState } from 'react';
import { toast } from 'react-hot-toast';
import { api, RouterOutputs } from '~/utils/api.util';
import { handleErrors } from '~/utils/handle-errors.util';
import { formatAvatar, formatImage } from '~/utils/image-src-format.util';
import localFont from 'next/font/local';

import { Dialog, Transition } from '@headlessui/react';
import { PiHammer, PiSealCheck, PiX } from 'react-icons/pi';

import { DeleteModal } from './DeleteModal';
import { PostMenu } from './Menus/PostMenu';
import { getPostTypeIconSmall, getPostTypeName } from './PostSection/post-section.util';
import { ReportModal } from './ReportModal';

export type ExplorePost = RouterOutputs['post']['getLatestPosts']['posts'][0];

interface ExplorePostModalProps {
    post: ExplorePost | null;
    setPostModalOpen: Dispatch<SetStateAction<boolean>>;
}

const clash = localFont({
    src: '../../public/fonts/ClashDisplay-Variable.woff2',
    display: 'swap',
    variable: '--font-clash',
});

const satoshi = localFont({
    src: '../../public/fonts/Satoshi-Variable.woff2',
    display: 'swap',
    variable: '--font-satoshi',
});

export const ExplorePostModal = ({ post, setPostModalOpen }: ExplorePostModalProps) => {
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
    const [confirmDeleteUserModalOpen, setConfirmDeleteUserModalOpen] = useState(false);

    const { data } = useSession();
    const { asPath, push, query } = useRouter();
    const ctx = api.useContext();

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

    const userIsProfileOwner = data?.user.id === post?.user.id;

    const handleDeletePost = () => {
        if (!post?.id) {
            toast.error('An error occurred while deleting this post.');
            return;
        }

        setConfirmDeleteModalOpen(true);
    }

    const handleDeleteUserPost = () => {
        if (!post?.id) {
            toast.error('An error occurred while deleting this post.');
            return;
        }

        setConfirmDeleteUserModalOpen(true);
    }

    const closeModal = () => {
        push(asPath.split('?')[0] ?? '/');
    }

    const handleShare = () => {
        const origin =
            typeof window !== 'undefined' && window.location.origin
                ? window.location.origin
                : '';

        const url = `${origin}${asPath}`;

        navigator.clipboard.writeText(url);

        toast.success('Copied post link to clipboard!');
    }

    if (!post) return null;

    return <Transition appear show={true} as={Fragment}>
        <Dialog as="div" className={`relative z-10 ${clash.variable} ${satoshi.variable} font-clash`} onClose={closeModal}>
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-100"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            {reportModalOpen && <ReportModal isOpen={reportModalOpen} setIsOpen={setReportModalOpen} type='POST' id={query.postId?.toString()} />}
            {confirmDeleteModalOpen && <DeleteModal isOpen={confirmDeleteModalOpen} setIsOpen={setConfirmDeleteModalOpen} post admin deleteFn={() => {
                mutate({ id: query.postId?.toString() ?? '' });
                push('/discover');
            }} />}
            {confirmDeleteUserModalOpen && <DeleteModal isOpen={confirmDeleteUserModalOpen} setIsOpen={setConfirmDeleteUserModalOpen} post deleteFn={() => {
                deletePost({ id: query.postId?.toString() ?? '' });
            }} />}

            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center text-center gap-12">

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-100"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-100"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className={`relative transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all w-[400px] h-[654px]`}>
                            <Image src={formatImage(post.image, post.user.id)} alt={post.type ?? ''} fill className='rounded-xl border-black border object-cover' />
                            <button className='absolute left-4 top-4 text-white' onClick={closeModal}>
                                <PiX className='w-5 h-4' />
                            </button>

                            <div className='flex flex-col justify-end items-center p-4 absolute bottom-0 bg-gradient-to-b from-transparent to-black w-full h-1/4 bg-fixed'>
                                <div className='text-white flex w-full gap-2 mb-2 pl-0.5'>
                                    {getPostTypeIconSmall(post.type)}
                                    <h1 className='font-clash'>{getPostTypeName(post.type)}</h1>
                                </div>

                                <div className='flex justify-between items-center w-full'>
                                    <Link href={`/${post.user.username}`} className='flex gap-2'>
                                        <Image className='rounded-full object-cover' src={formatAvatar(post.user.image, post.user.id)} alt={post.user.username ?? ""} width={30} height={30} />

                                        <h1 className='text-white flex gap-1 items-center text-sm w-full'>
                                            <span className='truncate'>{post.user.username}</span>
                                            {post.user.admin ? <PiHammer className='w-4 h-4' /> : post.user.verified && <PiSealCheck className='w-4 h-4' />}
                                        </h1>
                                    </Link>

                                    {data?.user && <PostMenu
                                        handleDeleteUserPost={handleDeleteUserPost}
                                        handleDeletePost={handleDeletePost}
                                        setReportModalOpen={setReportModalOpen}
                                        user={data.user}
                                        userIsProfileOwner={userIsProfileOwner}
                                    />}
                                </div>
                            </div>
                        </Dialog.Panel>

                    </Transition.Child>
                </div>
            </div>
        </Dialog>
    </Transition>
}