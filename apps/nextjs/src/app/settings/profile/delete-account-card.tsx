"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { Button } from "../../../components/ui/Button"
import toast from "react-hot-toast";
import { handleErrors } from '@acme/utils/handle-errors.util';
import { DeleteModal } from "~/components/modals/delete-modal";
import { useRouter } from "next/navigation";

export function DeleteAccountCard() {
    const router = useRouter();

    const { update } = useSession();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loading, setLoading] = useState<boolean>(false);

    const { mutate } = api.user.deleteProfile.useMutation({
        onSuccess: async () => {
            await update();
            toast.success("Your profile has been deleted.")
            router.push("/");
        },
        onError: (e) => handleErrors({ e, message: "Failed to delete profile!", fn: () => setLoading(false) })
    });

    return (
        <div className="flex flex-col items-start rounded-lg border border-stroke bg-white dark:bg-black">
            <div className="flex items-start gap-24 p-10 self-stretch">
                <div className="flex flex-col items-start gap-3 flex-1">
                    <h1 className="font-clash font-bold text-3xl">Delete account</h1>
                    <p>If you don't want to have an account on outfits.bio anymore, then you can request an account deletion.</p>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 p-4 px-10 self-stretch rounded-b-lg justify-between border-t dark:border-stroke bg-red-100 dark:bg-red-900">
                <p>This action is irreversible, and cannot be undone after.</p>
                <div className="flex items-center gap-3">
                    <DeleteModal
                        deleteFn={() => {
                            setLoading(true);
                            mutate();
                        }}
                    >
                        <Button className="bg-red-500 border-none dark:text-white">Delete Account</Button>
                    </DeleteModal>
                </div>
            </div>
        </div>
    )
}

