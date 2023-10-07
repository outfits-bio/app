import { Dialog, Transition } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReportType } from '@prisma/client';
import { Dispatch, Fragment, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { CreateReportInput, createReportSchema } from '~/schemas/user.schema';
import { api } from '~/utils/api.util';
import { handleErrors } from '~/utils/handle-errors.util';


import { Button } from './Button';

interface ReportModalProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    type: ReportType;
    id?: string;
}

export const ReportModal = ({ isOpen, setIsOpen, type, id }: ReportModalProps) => {
    const { mutate } = api.report.report.useMutation({
        onError: (e) => handleErrors({ e, message: 'An error occurred while reporting this user.' }),
        onSuccess: () => toast.success('Report created successfully!')
    });

    const { register, handleSubmit } = useForm<CreateReportInput>({
        defaultValues: {
            type,
            id,
            reason: ''
        },
        resolver: zodResolver(createReportSchema)
    });

    const handleReportSubmit = (data: CreateReportInput) => {
        mutate(data);
        setIsOpen(false);
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" open={isOpen} onClose={() => setIsOpen(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-96 gap-2 flex flex-col overflow-hidden rounded-md dark:text-white bg-white dark:bg-black border border-black dark:border-white p-4 text-left align-middle shadow-xl transition-all">
                                <h1 className='text-2xl font-semibold'>Report {type === "USER" ? 'User' : 'Post'}</h1>

                                <form onSubmit={handleSubmit(handleReportSubmit)}>
                                    <div className="mb-4">
                                        <label htmlFor="reason" className="block font-medium mb-1">
                                            Reason
                                        </label>
                                        <textarea
                                            id="reason"
                                            className="w-full px-4 py-2 border rounded-md border-black dark:border-white dark:text-white dark:bg-black"
                                            placeholder='Please describe the reason for your report.'
                                            {...register('reason')}
                                        />
                                    </div>

                                    <div className='flex w-full gap-2'>
                                        <Button variant='outline' centerItems onClick={() => setIsOpen(false)}>No, Abort</Button>
                                        <Button centerItems type='submit'>Report</Button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition >
    )
}