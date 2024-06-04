"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { api } from "@/trpc/react";
import { Button } from "../../ui/Button"
import toast from "react-hot-toast";
import { handleErrors } from '@/utils/handle-errors.util';

export function DeleteAccountCard() {
    const { update } = useSession();
    const { handleSubmit } = useForm();
    const [loading, setLoading] = useState<boolean>(false);

    const { mutate } = api.user.deleteProfile.useMutation({
        onSuccess: async (data) => {
            await update();
            toast.success("Your profile has been deleted.")
        },
        onError: (e) => handleErrors({ e, message: "Failed to delete profile!", fn: () => setLoading(false) })
    });

    const handleFormSubmit = () => {
        setLoading(true);
        mutate();
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-start rounded-lg border border-stroke bg-white dark:bg-black">
            <form className="self-stretch" onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="flex items-start flex gap-24 p-10 self-stretch">
                    <div className="flex flex-col items-start gap-3 flex-1">
                        <h1 className="font-clash font-bold text-3xl">Delete account</h1>
                        <p>If you don't want to have an account on outfits.bio anymore, then you can request an account deletion.</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 p-4 px-10 self-stretch justify-between border-t dark:border-stroke bg-red-100 dark:bg-red-900">
                    <p>This action is irreversible, and cannot be undone after.</p>
                    <div className="flex items-center gap-3">
                        <Button type="submit" className="bg-red-500 border-none dark:text-white">Delete Account</Button>
                    </div>
                </div>
            </form>
        </div>
    )
}

