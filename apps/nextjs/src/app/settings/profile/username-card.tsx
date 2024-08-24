"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { Button } from "../../../components/ui/Button"
import { api } from "~/trpc/react";
import {
    type EditProfileInput, editProfileSchema
} from '@acme/validators/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from "react-hot-toast";
import { handleErrors } from '@acme/utils/handle-errors.util';

export function UsernameCard() {
    const { data: session, update } = useSession();
    const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm<EditProfileInput>({
        resolver: zodResolver(editProfileSchema),
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loading, setLoading] = useState<boolean>(false);

    const { mutate } = api.user.editProfile.useMutation({
        onSuccess: async () => {
            await update();
            toast.success("Username updated!")
        },
        onError: (e) => handleErrors({ e, message: "Failed to edit profile!", fn: () => setLoading(false) })
    });

    const handleFormSubmit = ({ username }: EditProfileInput) => {
        setLoading(true);

        if (username === session?.user?.username) {
            setError("username", {
                type: "manual",
                message: "Your new username must be different from your current username."
            })
            setLoading(false);
            return;
        } else {
            clearErrors("username")
        }

        // If the user didn't change their username, do nothing
        if (username?.length) mutate({
            username
        });
        else {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-start rounded-lg border border-stroke bg-white dark:bg-black">
            <form className="self-stretch" onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="flex flex-col items-start gap-5 p-10 self-stretch">
                    <div className="flex flex-col items-start gap-3 flex-1">
                        <h1 className="font-clash font-bold text-3xl">Username</h1>
                        <p>This is how you will appear everywhere on the platform. Put whatever you are comfortable with.</p>
                    </div>
                    <div className="flex justify-between items-center self-stretch border dark:border-stroke rounded-lg">
                        <div className="flex p-3 items-center gap-10 rounded-l-lg self-stretch bg-gray-100 dark:bg-neutral-900">outfits.bio/</div>
                        <input {...register("username", { maxLength: 24 })} className="flex items-center gap-4 p-3 py-4 flex-1 rounded-r-lg self-stretch" placeholder={session?.user?.username ?? "username"} defaultValue={session?.user?.username} />
                    </div>
                    <div>{errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}</div>
                </div>
                <div className="flex flex-wrap items-center gap-3 p-4 px-10 self-stretch justify-between border-t rounded-b-lg dark:border-stroke bg-gray-100 dark:bg-neutral-900">
                    <p>Your username can only have up to 24 characters.</p>
                    <div className="flex items-center gap-3">
                        <Button type="submit" >Save</Button>
                    </div>
                </div>
            </form>
        </div>
    )
}