import { signIn, useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Button } from '~/components/Button';
import { SettingsLayout } from '~/components/SettingsLayout';
import { api } from '~/utils/api.util';
import { handleErrors } from '~/utils/handle-errors.util';

import { Switch } from '@headlessui/react';
import { DiscordLogo, GoogleLogo, SpinnerGap, Trash } from '@phosphor-icons/react';

import type { NextPage } from "next";
export const ConnectionsSettingsPage: NextPage = () => {
    const ctx = api.useContext();

    const { data: lanyardEnabledData } = api.user.getLanyardEnabled.useQuery(undefined, {
        retry: 1,
    });

    const { data: accountsData, isLoading } = api.user.getAccounts.useQuery(undefined, {
        retry: 1,
    });

    const { mutate: unlinkAccount, isLoading: unlinkLoading, variables } = api.user.unlinkAccount.useMutation({
        onSuccess: () => {
            ctx.user.getAccounts.invalidate();
            toast.success('Account unlinked successfully!');
        },
        onError: (e) => handleErrors({ e, message: 'Failed to unlink account' })
    });

    const { mutate: setLanyardEnabled, isLoading: setLanyardEnabledLoading } = api.user.toggleEnableLanyard.useMutation({
        onSuccess: () => {
            ctx.user.getLanyardEnabled.invalidate();
            toast.success('Lanyard enabled successfully!');
        },
        onError: (e) => handleErrors({ e, message: 'Failed to enable lanyard' })
    });

    const discordAccount = accountsData?.find(a => a.provider === 'discord');
    const googleAccount = accountsData?.find(a => a.provider === 'google');

    return <SettingsLayout>
        <div className="p-4 font-urbanist w-full md:w-[400px]">
            <h2 className="text-4xl font-black">Connections</h2><br></br>

            <div className={`w-full md:w-[400px] h-24 flex flex-col gap-2 justify-between ${isLoading ? 'skeleton' : ''}`}>
                {discordAccount ?
                    <div className='flex items-center gap-2'>
                        <div className='py-2 h-12 grow w-full cursor-default flex justify-center items-center select-none rounded-md border border-black dark:border-white'>
                            <DiscordLogo className='w-6 h-6 mr-2' />
                            <span>Discord Connected</span>
                        </div>

                        <div><Button variant='outline' iconLeft={<Trash />} centerItems
                            isLoading={unlinkLoading && variables?.id === discordAccount?.id}
                            onClick={() => unlinkAccount({ id: discordAccount?.id ?? '' })}
                        />
                        </div>
                    </div>
                    :
                    <Button onClick={() => signIn('discord')} iconLeft={<DiscordLogo />} centerItems>
                        Connect Discord
                    </Button>
                }

                {googleAccount ?
                    <div className='flex items-center gap-2'>
                        <div className='py-2 h-12 grow w-full cursor-default flex justify-center items-center select-none rounded-md border border-black dark:border-white'>
                            <GoogleLogo className='w-6 h-6 mr-2' />
                            <span>Google Connected</span>
                        </div>

                        <div><Button variant='outline' iconLeft={<Trash />} centerItems
                            isLoading={unlinkLoading && variables?.id === googleAccount?.id}
                            onClick={() => unlinkAccount({ id: googleAccount?.id ?? '' })}
                        />
                        </div>
                    </div>
                    :
                    <Button onClick={() => signIn('google')} iconLeft={<GoogleLogo />} centerItems>
                        Connect Google
                    </Button>
                }

                {discordAccount && <div className='flex items-center py-2 font-bold text-xl justify-between'>
                    <p>Toggle Discord Status</p>
                    <Switch
                        checked={lanyardEnabledData ?? false}
                        onChange={() => setLanyardEnabled()}
                        className={`${lanyardEnabledData ?? false ? 'bg-black' : 'bg-hover'}
          relative inline-flex h-8 w-[72px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                        <span className="sr-only">Toggle Lanyard</span>
                        <span
                            aria-hidden="true"
                            className={`${lanyardEnabledData ?? false ? 'translate-x-10' : 'translate-x-0'}
            pointer-events-none h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center`}
                        >
                            {setLanyardEnabledLoading && <SpinnerGap className='w-4 h-4 text-secondary-text animate-spin' />}

                        </span>
                    </Switch>
                </div>}
            </div>
        </div>
    </SettingsLayout>;
}

export default ConnectionsSettingsPage;