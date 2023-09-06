import { useTheme } from "next-themes";
import { ThemeCard } from "./ThemeCard"
import { Button } from "./Button";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useRouter } from "next/router";

interface OnboardingStartSectionProps {
    setOnboardingStarted: React.Dispatch<React.SetStateAction<number>>;
    onboardingStarted: number;
    username?: string;
}

export const OnboardingAppearance = ({ setOnboardingStarted, onboardingStarted, username }: OnboardingStartSectionProps) => {
    const { push } = useRouter();
    const { theme, setTheme } = useTheme();

    if (onboardingStarted === 2) return <div className="w-screen md:w-auto p-4">
        <div className="flex flex-col gap-4">
            <h2 className="font-black md:text-5xl text-3xl font-clash">Customize your personal experience</h2>
            <p className="text-secondary-text">Choose a desired theme to suit your preferences.</p>
            <div className="flex gap-4 overflow-x-scroll pb-1 ">
                <ThemeCard variant='light' active={theme === 'light'} onClick={() => setTheme('light')} />
                <ThemeCard variant='dark' active={theme === 'dark'} onClick={() => setTheme('dark')} />
                <ThemeCard variant='system' active={theme === 'system'} onClick={() => setTheme('system')} />
            </div>
        </div>

        <div className='flex gap-2 mt-4'>
            <Button variant='outline' iconLeft={<ArrowLeft />} onClick={() => setOnboardingStarted(1)} centerItems>Back</Button>
            <Button type='submit' iconRight={<ArrowRight />} centerItems onClick={() => push(`/${username}`)}>Continue</Button>
        </div>
    </div>
}