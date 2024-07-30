"use client";

import { api } from "@/trpc/react";
import { toast } from 'react-hot-toast';
import { handleErrors } from "@/utils/handle-errors.util";
import Link from "next/link";

export function SpotifyStatusCard() {
    const ctx = api.useUtils();

    const { data: lanyardEnabledData } = api.user.getLanyardEnabled.useQuery(undefined, {
        retry: 1,
    });

    const { data: accountsData, isLoading } = api.user.getAccounts.useQuery(undefined, {
        retry: 1,
    });

    const { mutate: setLanyardEnabled, isLoading: setLanyardEnabledLoading } = api.user.toggleEnableLanyard.useMutation({
        onSuccess: async () => {
            await ctx.user.getLanyardEnabled.refetch();
        },
        onError: (e) => handleErrors({ e, message: 'Failed to toggle lanyard' })
    });

    const discordAccount = accountsData?.find(a => a.provider === 'discord');

    const handleLanyard = () => {
        if (!discordAccount) {
            toast.error('You need to connect discord to enable this feature');
            return;
        }
        setLanyardEnabled();
    }

    return (
        <div className="flex flex-col items-start rounded-lg border border-stroke bg-white dark:bg-black">
            <div className="flex flex-wrap items-start flex gap-24 p-10 self-stretch">
                <div className="flex flex-col items-start gap-3 flex-1">
                    <h1 className="font-clash font-bold text-3xl">Show Spotify Status</h1>
                    <p>Very nice free addition to your profile, display your spotify status as long as you are only on Discord.</p>
                </div>
                <div className={`flex w-[96px] h-[48px] p-2 items-center gap-3 rounded-full border dark:border-stroke ${lanyardEnabledData && "justify-end"}`} onClick={handleLanyard}>
                    <div className="w-[32px] h-[32px] flex-shrink-0 bg-black rounded-full dark:bg-white" />
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 p-6 px-10 self-stretch justify-between border-t dark:border-stroke bg-gray-100 dark:bg-neutral-900">
                <p>We use <Link className='underline' href='https://github.com/Phineas/lanyard'>Lanyard</Link> to power our Spotify Status feature.
                    To use Lanyard, you must join their Discord Server using the Discord account that&apos;s connected to outfits.bio.
                </p>
            </div>
        </div>
    )
}