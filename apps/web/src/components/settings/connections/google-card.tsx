"use client";

import { Button } from "../../ui/Button"
import { api } from "@/trpc/react";
import { toast } from 'react-hot-toast';
import { handleErrors } from "@/utils/handle-errors.util";
import { signIn } from 'next-auth/react';
import { PiLinkBreak } from 'react-icons/pi';


export function GoogleCard() {
    const ctx = api.useUtils();

    const { data: accountsData } = api.user.getAccounts.useQuery(undefined, {
        retry: 1,
    });

    const { mutate: unlinkAccount, isLoading: unlinkLoading, variables } = api.user.unlinkAccount.useMutation({
        onSuccess: async () => {
            await ctx.user.getAccounts.refetch();
            await ctx.user.getLanyardEnabled.refetch();
            toast.success('Account unlinked successfully!');
        },
        onError: (e) => handleErrors({ e, message: 'Failed to unlink account' })
    });

    const googleAccount = accountsData?.find(a => a.provider === 'google');

    return (
        <div className="flex flex-col items-start rounded-lg border border-stroke bg-white dark:bg-black">
            <div className="flex items-start gap-24 p-10 self-stretch">
                <div className="flex flex-col items-start gap-3 flex-1">
                    <h1 className="font-clash font-bold text-3xl">Google</h1>
                    <p>Sign in with google, a classic.</p>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 p-4 px-10 self-stretch justify-end border-t rounded-b-lg dark:border-stroke bg-gray-100 dark:bg-neutral-900">
                <div className="flex items-center gap-3">
                    {googleAccount ? (
                        <>
                            <Button variant='outline' iconLeft={<PiLinkBreak />} centerItems shape={'square'} className="px-4"
                                isLoading={unlinkLoading && variables?.id === googleAccount?.id}
                                onClick={() => unlinkAccount({ id: googleAccount?.id ?? '' })}
                            />
                            <Button disabled>Connected</Button>
                        </>
                    ) : (
                        <Button onClick={() => signIn('google')}>Connect</Button>
                    )}
                </div>
            </div>
        </div>
    )
}