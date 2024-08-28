import { zodResolver } from '@hookform/resolvers/zod';
import type { inferRouterOutputs } from '@trpc/server';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { PiSpinnerGap, PiTrashSimple } from 'react-icons/pi';
import type { BaseModalProps } from '../modals/base-modal';
import { BaseModal, BaseModalClose, BaseModalContent, BaseModalDescription, BaseModalTitle, BaseModalTrigger } from '../modals/base-modal';
import { Button } from '../ui/Button';

import { type EditUserInput, editUserSchema } from '@/schemas/admin.schema';
import type { AppRouter } from '@/server/api/root';
import { api } from "@/trpc/react";
import { handleErrors } from '@/utils/handle-errors.util';
import { useRef } from 'react';



type RouterOutput = inferRouterOutputs<AppRouter>;

interface AdminEditUserModalProps extends BaseModalProps {
    targetUser: RouterOutput['user']['getProfile'];
}

export const AdminEditUserModal = (props: AdminEditUserModalProps) => {
    const ctx = api.useUtils();
    const ref = useRef<HTMLDivElement>(null);

    const { mutate, isPending } = api.admin.editUser.useMutation({
        onSuccess: async () => {
            await ctx.user.getProfile.refetch({ username: props.targetUser.username ?? '' });
            ref.current?.click();
            toast.success('User edited successfully!');
        },
        onError: (e) => handleErrors({ e, message: 'Failed to edit user' })
    });

    const { mutate: removeImage, isPending: removeImagePending } = api.admin.removeUserAvatar.useMutation({
        onSuccess: async () => {
            await ctx.user.getProfile.refetch({ username: props.targetUser.username ?? '' });
            toast.success('Avatar removed successfully!');
        },
        onError: (e) => handleErrors({ e, message: 'Failed to remove avatar' })
    });

    const { mutate: removeLink, isPending: removeLinkPending, variables } = api.admin.removeUserLink.useMutation({
        onSuccess: async () => {
            await ctx.user.getProfile.refetch({ username: props.targetUser.username ?? '' });
            toast.success('Link removed successfully!');
        },
        onError: (e) => handleErrors({ e, message: 'Failed to remove link' })
    });

    const { mutate: giveVerified, isPending: giveVerifiedPending } = api.admin.toggleUserVerified.useMutation({
        onSuccess: async () => {
            await ctx.user.getProfile.refetch({ username: props.targetUser.username ?? '' });
            toast.success('Verified changed successfully!');
        },
        onError: (e) => handleErrors({ e, message: 'Failed to change verified' })
    });

    const { handleSubmit, register } = useForm({
        defaultValues: {
            id: props.targetUser.id,
            username: props.targetUser.username ?? '',
            tagline: props.targetUser.tagline ?? '',
        },
        resolver: zodResolver(editUserSchema),
    });

    const handleFormSubmit = (data: EditUserInput) => mutate(data);
    return <BaseModal {...props}>
        <BaseModalTrigger>
            <div ref={ref}>
                <Button variant={'ghost'}>
                    <p>Edit Profile</p>
                </Button>
            </div>
        </BaseModalTrigger>
        <BaseModalContent>
            <BaseModalTitle>Edit User</BaseModalTitle>
            <BaseModalDescription>Edit user information</BaseModalDescription>

            <div className='flex flex-col gap-2'>
                <form onSubmit={handleSubmit(handleFormSubmit)} className='flex flex-col gap-2'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='username' className='text-sm font-semibold'>Username</label>
                        <input {...register('username')} className='w-full p-2 rounded-xl border border-stroke bg-white dark:bg-black text-black dark:text-white' />

                        <label htmlFor='tagline' className='text-sm font-semibold'>Tagline</label>
                        <textarea {...register('tagline')} className='w-full h-24 p-2 rounded-xl border border-stroke bg-white dark:bg-black text-black dark:text-white' />

                        <Button variant='outline-ghost' type="button" centerItems isLoading={removeImagePending} onClick={() => removeImage({ id: props.targetUser.id })}>Remove Avatar</Button>
                        {<Button variant={'outline-ghost'} type="button" isLoading={giveVerifiedPending} centerItems onClick={() => giveVerified({ id: props.targetUser.id })}>{props.targetUser.verified ? 'Revoke Verified' : 'Give Verified'}</Button>}

                        <ul className='text-left w-full flex flex-col items-start gap-2'>
                            {props.targetUser.links?.map((link) =>
                                <button type='button' key={link.id} className='text-sm flex items-center font-semibold py-2 border-stroke rounded-xl border w-full text-left px-4 hover:bg-hover' onClick={() => removeLink({ id: link.userId, linkId: link.id })}>
                                    {link.url}
                                    {(removeLinkPending && variables?.linkId === link.id) ? <PiSpinnerGap className='animate-spin ml-auto' /> : <PiTrashSimple className='ml-auto' />}
                                </button>
                            )}
                        </ul>
                    </div>

                    <div className='flex w-full gap-2'>
                        <BaseModalClose>
                            <Button className='text-nowrap' variant='outline' type="button" centerItems>No, Abort</Button>
                        </BaseModalClose>
                        <Button variant='primary' centerItems isLoading={isPending} type='submit'>Submit</Button>
                    </div>
                </form>

            </div>
        </BaseModalContent>
    </BaseModal>
}