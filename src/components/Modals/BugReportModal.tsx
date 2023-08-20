import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { CreateBugReportInput, createBugReportSchema } from '~/schemas/user.schema';
import { api } from '~/utils/api.util';
import { handleErrors } from '~/utils/handle-errors.util';

import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '../Button';
import { BaseModal } from './BaseModal';

import type { BaseModalProps } from './BaseModal';
export const BugReportModal = (props: BaseModalProps) => {

    const { mutate, isLoading } = api.report.reportBug.useMutation({
        onSuccess: () => {
            props.setIsOpen(false);
            toast.success('Bug reported successfully!');
        },
        onError: (e) => handleErrors({ e, message: 'Failed to report bug' })
    });

    const { handleSubmit, register } = useForm({
        defaultValues: {
            description: '',
        },
        resolver: zodResolver(createBugReportSchema),
    });

    const handleFormSubmit = (data: CreateBugReportInput) => mutate(data);

    return <BaseModal {...props}>
        <div className='flex flex-col gap-2'>
            <h1 className='text-2xl font-black'>Report a bug</h1>

            <p className='text-sm text-gray-500 dark:text-gray-400 font-inter'>If you found a bug, please report it here. We will try to fix it as soon as possible.</p>

            <form onSubmit={handleSubmit(handleFormSubmit)} className='flex flex-col gap-2'>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='description' className='text-sm font-semibold'>What happened?</label>
                    <textarea {...register('description')} className='w-full h-32 p-2 rounded-md border border-stroke dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white' />
                </div>

                <div className='flex w-full gap-2'>
                    <Button variant='outline' type="button" centerItems onClick={() => props.setIsOpen(false)}>No, Abort</Button>
                    <Button variant='primary' centerItems isLoading={isLoading} type='submit'>Report</Button>
                </div>
            </form>

        </div>
    </BaseModal>
}