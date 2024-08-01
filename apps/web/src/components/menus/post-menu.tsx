/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useParamsModal } from '@/hooks/params-modal.hook';
import { api } from '@/trpc/react';
import { handleErrors } from '@/utils/handle-errors.util';
import { Menu } from '@headlessui/react';
import { useRouter } from "next/navigation";
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { PiDotsThree } from 'react-icons/pi';
import { ReportModal } from '../modals/report-modal';
import { Button } from '../ui/Button';
import { BaseMenu } from './base-menu';
import { DeleteModal } from '../modals/delete-modal';
import { useRef } from 'react';

interface PostMenuProps {
    userIsProfileOwner: boolean;
    button?: JSX.Element;
    postId?: string;
}

export const PostMenu = ({ userIsProfileOwner, button, postId, ...props }: PostMenuProps) => {
    const ref = useRef<HTMLButtonElement>(null);
    const ref2 = useRef<HTMLButtonElement>(null);
    const router = useRouter();

    const { data: session } = useSession();
    const { close } = useParamsModal('postId');

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

    const handleDeleteUserPost = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (!postId) {
            toast.error('An error occurred while deleting this post.');
            return;
        }

        ref2.current?.click();
    }

    return (
        <BaseMenu {...props} button={button ?? <PiDotsThree className='w-5 h-5 text-white mt-1.5' />} className='right-0 bottom-0 w-44 origin-top-right'>
            <div className="space-y-1">
                {user && (
                    <Menu.Item as="div">
                        <ReportModal type='POST' id={postId} />
                    </Menu.Item>
                )}
                {userIsProfileOwner && !user?.admin && (
                    <Menu.Item as="div">
                        <DeleteModal
                            ref={ref}
                            post
                            deleteFn={() => {
                                deletePost({ id: postId?.toString() ?? '' });
                            }}
                        >
                            <Button variant={'ghost'} onClick={handleDeleteUserPost}>
                                <p>Delete</p>
                            </Button>
                        </DeleteModal>
                    </Menu.Item>
                )}
                {user?.admin && (
                    <Menu.Item as="div">
                        <DeleteModal
                            ref2={ref2}
                            post
                            admin
                            deleteFn={() => {
                                mutate({ id: postId?.toString() ?? '' });
                                router.push('/');
                            }}
                        >
                            <Button variant={'ghost'}>
                                Delete
                            </Button>
                        </DeleteModal>
                    </Menu.Item>
                )}
            </div>
        </BaseMenu >
    );
}