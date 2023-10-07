import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { PiArrowLeft, PiArrowRight } from "react-icons/pi";
import { AccentCard } from '~/components/AccentCard';
import { Button } from "./Button";
import { ThemeCard } from "./ThemeCard"

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

        {theme !== 'dark' && <div className="flex flex-col gap-4">
            <h2 className="font-black text-2xl">Accent Colors</h2>
            <p className="text-secondary-text">To add a little more personalized spice to your experience. </p>
            <div className="flex gap-4 overflow-x-scroll pb-1">
                <AccentCard variant='default' active={theme === 'light'} onClick={() => setTheme('light')} />
                <AccentCard variant='brown' active={theme === 'light-brown'} onClick={() => setTheme('light-brown')} />
                <AccentCard variant='hot-pink' active={theme === 'light-hot-pink'} onClick={() => setTheme('light-hot-pink')} />
                <AccentCard variant='orange' active={theme === 'light-orange'} onClick={() => setTheme('light-orange')} />
                <AccentCard variant='light-pink' active={theme === 'light-light-pink'} onClick={() => setTheme('light-light-pink')} />
            </div>
        </div>}


        <div className='flex gap-2 mt-4'>
            <Button variant='outline' iconLeft={<PiArrowLeft />} onClick={() => setOnboardingStarted(1)} centerItems>Back</Button>
            <Button type='submit' iconRight={<PiArrowRight />} centerItems onClick={() => push(`/${username}`)}>Continue</Button>
        </div>
    </div>
}