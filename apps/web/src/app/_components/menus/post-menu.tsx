"use client";

import { useParamsModal } from '@/hooks/params-modal.hook';
import { api } from '@/trpc/react';
import { handleErrors } from '@/utils/handle-errors.util';
import { Menu } from '@headlessui/react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { PiDotsThree } from 'react-icons/pi';
import { ReportModal } from '../modals/report-post-modal';
import { Button } from '../ui/Button';
import { BaseMenu } from './base-menu';

interface PostMenuProps {
    userIsProfileOwner: boolean;
    button?: JSX.Element;
    postId?: string;
}

export const PostMenu = ({ userIsProfileOwner, button, postId, ...props }: PostMenuProps) => {
    const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
    const [confirmDeleteUserModalOpen, setConfirmDeleteUserModalOpen] = useState(false);

    const params = useSearchParams();

    const { data: session } = useSession();
    const { close } = useParamsModal('postId');
    const { open } = useParamsModal('reportPost', postId);

    const user = session?.user;

    const ctx = api.useUtils();

    const { mutate } = api.admin.deletePost.useMutation({
        onSuccess: () => {
            toast.success('Post deleted successfully!');
            void ctx.post.getLatestPosts.refetch();
            void ctx.post.getPostsAllTypes.refetch();
            close();
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
            void ctx.post.getLatestPosts.refetch();
            void ctx.post.getPostsAllTypes.refetch();
            close();
        },
        onError: (e) => handleErrors({ e, message: 'An error occurred while deleting this post.' })
    });

    const handleDeletePost = () => {
        if (!postId) {
            toast.error('An error occurred while deleting this post.');
            return;
        }

        setConfirmDeleteModalOpen(true);
    }

    const handleDeleteUserPost = () => {
        if (!postId) {
            toast.error('An error occurred while deleting this post.');
            return;
        }

        setConfirmDeleteUserModalOpen(true);
    }

    return <BaseMenu {...props} button={button ?? <PiDotsThree className='w-5 h-5 text-white mt-1.5' />} className='right-0 bottom-0 w-44 origin-top-right'>
        {/* {confirmDeleteModalOpen && <DeleteModal isOpen={confirmDeleteModalOpen} setIsOpen={setConfirmDeleteModalOpen} post admin deleteFn={() => {
            mutate({ id: query.postId?.toString() ?? '' });
            push('/discover');
        }} />}
        {confirmDeleteUserModalOpen && <DeleteModal isOpen={confirmDeleteUserModalOpen} setIsOpen={setConfirmDeleteUserModalOpen} post deleteFn={() => {
            deletePost({ id: query.postId?.toString() ?? '' });
        }} />} */}

        <div className="space-y-1">
            {user && <Menu.Item>
                <ReportModal type={'POST'} id={postId} />
            </Menu.Item>}
            {(userIsProfileOwner && !user?.admin) && <Menu.Item>
                <Button variant={'ghost'} onClick={handleDeleteUserPost}>
                    <p>Delete</p>
                </Button>
            </Menu.Item>}
            {user?.admin && <Menu.Item>
                <Button variant={'ghost'} onClick={handleDeletePost}>
                    <p>Delete</p>
                </Button>
            </Menu.Item>}
        </div>
    </BaseMenu>
}