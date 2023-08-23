import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { HideAllPresencesModal } from '~/components/Modals/HideAllPresencesModal';
import { SettingsLayout } from '~/components/SettingsLayout';
import { ThemeCard } from '~/components/ThemeCard';
import { api } from '~/utils/api.util';
import { handleErrors } from '~/utils/handle-errors.util';

import { Switch } from '@headlessui/react';
import { Question, SpinnerGap } from '@phosphor-icons/react';

import type { NextPage } from "next";
export const AppearanceSettingsPage: NextPage = () => {
    const { data, update } = useSession();
    const { theme, setTheme } = useTheme();

    const [hideAllPresencesModalOpen, setHideAllPresencesModalOpen] = useState(false);

    const { mutate: setToggleHideLanyard, isLoading: setToggleHideLanyardLoading } = api.user.toggleHideLanyard.useMutation({
        onSuccess: () => {
            update();
        },
        onError: (e) => handleErrors({ e, message: 'Failed to toggle presences' })
    });

    const handleToggleHideLanyard = () => {
        setToggleHideLanyard();
    }

    return <SettingsLayout>
        {hideAllPresencesModalOpen && <HideAllPresencesModal isOpen={hideAllPresencesModalOpen} setIsOpen={setHideAllPresencesModalOpen} />}

        <div className="w-full h-full p-4 font-urbanist gap-6 flex flex-col">
            <h1 className="text-4xl font-black">Appearance</h1>

            <div className="flex flex-col gap-4">
                <h2 className="font-black text-2xl">Themes</h2>
                <div className="flex gap-4 overflow-x-scroll pb-1">
                    <ThemeCard variant='light' active={theme === 'light'} onClick={() => setTheme('light')} />
                    <ThemeCard variant='dark' active={theme === 'dark'} onClick={() => setTheme('dark')} />
                    <ThemeCard variant='system' active={theme === 'system'} onClick={() => setTheme('system')} />
                </div>
            </div>

            <div className="flex flex-col gap-4 w-full md:w-[450px]">
                <div className='flex items-center py-2 font-bold text-xl justify-between'>
                    <span className='flex items-center gap-2'>
                        <p>Hide All Presences</p>
                        <Question onClick={() => setHideAllPresencesModalOpen(true)} className='w-4 h-4 cursor-pointer' />
                    </span>
                    <Switch
                        checked={data?.user.hideLanyard ?? false}
                        onChange={handleToggleHideLanyard}
                        className={`${data?.user.hideLanyard ?? false ? 'bg-black' : 'bg-hover'}
          relative inline-flex h-8 w-[72px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                        <span className="sr-only">Toggle Lanyard</span>
                        <span
                            aria-hidden="true"
                            className={`${data?.user.hideLanyard ?? false ? 'translate-x-10' : 'translate-x-0'}
            pointer-events-none h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center`}
                        >
                            {setToggleHideLanyardLoading && <SpinnerGap className='w-4 h-4 text-secondary-text animate-spin' />}

                        </span>
                    </Switch>
                </div>
            </div>
        </div>
    </SettingsLayout>
}

export default AppearanceSettingsPage;