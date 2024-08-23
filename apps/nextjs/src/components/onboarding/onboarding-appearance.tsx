"use client";

import { useTheme } from "next-themes";
import { PiArrowLeft, PiArrowRight } from "react-icons/pi";
import { Button } from "../ui/Button";
import { ThemeCard } from "../../app/settings/appearance/theme-card";
import { AccentCard } from "../../app/settings/appearance/accent-card";
import Link from "next/link";

interface OnboardingStartSectionProps {
    setOnboardingStarted: React.Dispatch<React.SetStateAction<number>>;
    onboardingStarted: number;
    username?: string;
}

export const OnboardingAppearance = ({ setOnboardingStarted, onboardingStarted }: OnboardingStartSectionProps) => {
    // const [createFirstPostModalOpen, setCreateFirstPostModalOpen] = useState(false);

    const { theme } = useTheme();

    if (onboardingStarted === 2) return <div className="w-screen md:w-auto p-4">
        {/* {createFirstPostModalOpen && <CropPostModal isOpen={createFirstPostModalOpen} setIsOpen={setCreateFirstPostModalOpen} />} */}
        <div className="flex flex-col gap-4">
            <ThemeCard />
        </div>

        {theme !== 'dark' && <div className="flex flex-col gap-4">
            <AccentCard />
        </div>}


        <div className='flex gap-2 mt-4'>
            <Button variant='outline' iconLeft={<PiArrowLeft />} onClick={() => setOnboardingStarted(1)} centerItems>Back</Button>
            <Link href='/'><Button type='submit' iconRight={<PiArrowRight />} centerItems>Continue</Button></Link>

            {/* <Button type='submit' iconRight={<PiArrowRight />} centerItems onClick={() => setCreateFirstPostModalOpen(true)}>Continue</Button> */}
        </div>
    </div>
}