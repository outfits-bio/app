import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { EditUserInput, editUserSchema } from '~/schemas/admin.schema';
import { CreateBugReportInput, createBugReportSchema } from '~/schemas/user.schema';
import { AppRouter } from '~/server/api/root';
import { api, RouterOutputs } from '~/utils/api.util';
import { handleErrors } from '~/utils/handle-errors.util';

import { zodResolver } from '@hookform/resolvers/zod';
import { inferRouterOutputs } from '@trpc/server';

import { Button } from '../Button';
import { BaseModal } from './BaseModal';

import type { BaseModalProps } from './BaseModal';
type RouterOutput = inferRouterOutputs<AppRouter>;

interface AdminEditUserModalProps extends BaseModalProps {
    targetUser: RouterOutput['user']['getProfile'];
}

export const AdminEditUserModal = (props: AdminEditUserModalProps) => {

    const ctx = api.useContext();

    const { mutate, isLoading } = api.admin.editUser.useMutation({
        onSuccess: () => {
            ctx.user.getProfile.invalidate({ username: props.targetUser.username! });
            props.setIsOpen(false);
            toast.success('User edited successfully!');
        },
        onError: (e) => handleErrors({ e, message: 'Failed to edit user' })
    });

    const { mutate: removeImage, isLoading: removeImageLoading } = api.admin.removeUserAvatar.useMutation({
        onSuccess: () => {
            ctx.user.getProfile.invalidate({ username: props.targetUser.username! });
            toast.success('Avatar removed successfully!');
        },
        onError: (e) => handleErrors({ e, message: 'Failed to remove avatar' })
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
        <div className='flex flex-col gap-2'>
            <h1 className='text-2xl font-black'>Edit User</h1>

            <form onSubmit={handleSubmit(handleFormSubmit)} className='flex flex-col gap-2 w-full sm:w-96'>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='username' className='text-sm font-semibold'>Username</label>
                    <input {...register('username')} className='w-full p-2 rounded-md border border-stroke bg-white dark:bg-black text-black dark:text-white' />

                    <label htmlFor='tagline' className='text-sm font-semibold'>Tagline</label>
                    <textarea {...register('tagline')} className='w-full h-24 p-2 rounded-md border border-stroke bg-white dark:bg-black text-black dark:text-white' />

                    <Button variant='outline-ghost' type="button" centerItems isLoading={removeImageLoading} onClick={() => removeImage({ id: props.targetUser.id })}>Remove Avatar</Button>
                </div>

                <div className='flex w-full gap-2'>
                    <Button variant='outline' type="button" centerItems onClick={() => props.setIsOpen(false)}>No, Abort</Button>
                    <Button variant='primary' centerItems isLoading={isLoading} type='submit'>Submit</Button>
                </div>
            </form>

        </div>
    </BaseModal>
}