/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useParamsModal } from '~/hooks/params-modal.hook';
import { api } from '~/trpc/react';
import { handleErrors } from '@acme/utils/handle-errors.util';
import { useRouter } from "next/navigation";
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { PiDotsThree } from 'react-icons/pi';
import { ReportModal } from '../modals/report-modal';
import { Button } from '../ui/Button';
import { DeleteModal } from '../modals/delete-modal';
import { useRef } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

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

    return (
        <Popover {...props}>
            <PopoverTrigger>
                {button ?? <PiDotsThree className='w-5 h-5 text-white mt-1.5' />}
            </PopoverTrigger>
            <PopoverContent className="space-y-1 w-fit mr-2 md:mr-0">
                {user && (
                    <div>
                        <ReportModal type='POST' id={postId} />
                    </div>
                )}
                {userIsProfileOwner && !user?.admin && (
                    <div>
                        <DeleteModal
                            ref={ref}
                            post
                            deleteFn={() => {
                                deletePost({ id: postId?.toString() ?? '' });
                            }}
                        >
                            <Button variant={'ghost'}>
                                <p>Delete</p>
                            </Button>
                        </DeleteModal>
                    </div>
                )}
                {user?.admin && (
                    <div>
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
                    </div>
                )}
            </PopoverContent>
        </Popover >
    );
}