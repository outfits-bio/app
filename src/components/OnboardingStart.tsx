import { signOut } from 'next-auth/react';

import { ArrowRight } from '@phosphor-icons/react';

import { Button } from './Button';

interface OnboardingStartSectionProps {
    setOnboardingStarted: React.Dispatch<React.SetStateAction<boolean>>;
    username?: string;
}

export const OnboardingStartSection = ({ setOnboardingStarted, username }: OnboardingStartSectionProps) => {
    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
    };

    return <>
        <h1 className='w-96 text-center text-3xl sm:text-5xl font-black font-urbanist sm:w-[500px]'>Welcome to outfits.bio{username && `, ${username}`}</h1>
        <div className='px-8 sm:px-0 sm:w-[500px] gap-4 flex flex-col'><p>You&apos;ll be ready to share your fashion with the world in just a couple of steps.</p>
            <p>
                By clicking Get Started, you agree to our Terms of Service and Privacy Policy.
            </p></div>

        <div className='w-full px-8 sm:px-0 sm:w-[500px] gap-4 flex flex-col mb-20'>
            <Button iconRight={<ArrowRight />} centerItems onClick={() => setOnboardingStarted(true)}>Get Started</Button>
            <Button variant='ghost' centerItems onClick={handleLogout}><p className='text-sm text-gray-500 font-inter'>Nevermind, log me out</p></Button>
        </div>
    </>
}