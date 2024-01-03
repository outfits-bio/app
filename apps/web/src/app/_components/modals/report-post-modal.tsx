"use client";

import { useParamsModal } from "@/hooks/params-modal.hook";
import { createReportSchema, type CreateReportInput } from "@/schemas/user.schema";
import { api } from "@/trpc/react";
import { handleErrors } from "@/utils/handle-errors.util";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ReportType } from "database";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import { BaseModal } from "./base-modal";
import { useSearchParams } from "next/navigation";

interface ReportModalProps {
    type: ReportType;
    id?: string;
}

export const ReportModal = ({ type, id }: ReportModalProps) => {
    const params = useSearchParams();

    const { close } = useParamsModal('reportPost', id);

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
        close();
    }

    return (
        <BaseModal isOpen={params.get('reportPost')?.toString() === id} close={close}>
            <h1 className='text-2xl font-semibold'>Report {type === "USER" ? 'User' : 'Post'}</h1>

            <form onSubmit={handleSubmit(handleReportSubmit)}>
                <div className="mb-4">
                    <label htmlFor="reason" className="block font-medium mb-1">
                        Reason
                    </label>
                    <textarea
                        id="reason"
                        className="w-full px-4 py-2 border-stroke rounded-md border dark:border-white dark:text-white dark:bg-black"
                        placeholder='Please describe the reason for your report.'
                        {...register('reason')}
                    />
                </div>

                <div className='flex w-full gap-2'>
                    <Button variant='outline' centerItems onClick={close}>No, Abort</Button>
                    <Button centerItems type='submit'>Report</Button>
                </div>
            </form>
        </BaseModal>
    )
}