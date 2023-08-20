import { signIn, useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Button } from '~/components/Button';
import { SettingsLayout } from '~/components/SettingsLayout';
import { api } from '~/utils/api.util';
import { handleErrors } from '~/utils/handle-errors.util';

import { DiscordLogo, GoogleLogo, Trash } from '@phosphor-icons/react';

import type { NextPage } from "next";
export const ConnectionsSettingsPage: NextPage = () => {
    const ctx = api.useContext();

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
            </div>
        </div>
    </SettingsLayout>;
}

export default ConnectionsSettingsPage;