"use client";

import { createReportSchema, type CreateReportInput } from "@acme/validators/user.schema";
import { api } from "~/trpc/react";
import { handleErrors } from "@acme/utils/handle-errors.util";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ReportType } from "@acme/db";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import { BaseModal, BaseModalClose, BaseModalContent, BaseModalDescription, BaseModalTitle, BaseModalTrigger } from "./base-modal";

interface ReportModalProps {
    type: ReportType;
    id?: string;
}

export const ReportModal = ({ type, id }: ReportModalProps) => {
    const ref = useRef<HTMLButtonElement>(null);

    const { mutate } = api.report.report.useMutation({
        onError: (e) => handleErrors({ e, message: 'An error occurred while reporting this.' }),
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
        ref.current?.click()
    }

    return (
        <BaseModal>
            <BaseModalTrigger>
                <div>
                    <Button variant={'ghost'} ref={ref}>Report</Button>
                </div>
            </BaseModalTrigger>
            <BaseModalContent>
                <BaseModalTitle>Report {type === "USER" ? 'User' : 'Post'}</BaseModalTitle>
                <BaseModalDescription>
                    Report {type === "USER" ? 'this user' : 'this post'} for potentially violating our guidelines.
                </BaseModalDescription>

                <form onSubmit={handleSubmit(handleReportSubmit)}>
                    <div className="mb-4">
                        <label htmlFor="reason" className="block font-medium mb-1">
                            Reason
                        </label>
                        <textarea
                            id="reason"
                            className="w-full min-h-28 px-4 py-2 border-stroke rounded-xl border dark:border-stroke dark:text-white dark:bg-black"
                            placeholder='Please describe the reason for your report.'
                            {...register('reason')}
                        />
                    </div>

                    <div className='flex w-full gap-2'>
                        <BaseModalClose>
                            <Button variant='outline' centerItems>Cancel</Button>
                        </BaseModalClose>
                        <Button centerItems type='submit'>Report</Button>
                    </div>
                </form>
            </BaseModalContent>
        </BaseModal>
    )
}