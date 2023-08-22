import type { NextPage } from "next";
import { useTheme } from 'next-themes';
import { SettingsLayout } from '~/components/SettingsLayout';
import { ThemeCard } from '~/components/ThemeCard';

export const AppearanceSettingsPage: NextPage = () => {
    const { theme, setTheme } = useTheme();

    return <SettingsLayout>
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
        </div>
    </SettingsLayout>
}

export default AppearanceSettingsPage;