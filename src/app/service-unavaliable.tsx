import { Logo } from "@/components/ui/Logo";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default async function ServiceUnavailablePage() {
    return (
        <>
            <div className="flex flex-col items-center min-h-screen py-5 md:py-10 px-4 md:px-10 gap-8 md:gap-16 justify-center">
                <div className="flex flex-col items-center justify-center bg-orange-accent text-[#FFECC8] w-full py-8 md:py-16 px-6 md:px-24 rounded-3xl gap-4 md:gap-6">
                    <Logo size="lg" variant="onOrange" className="md:hidden" />
                    <Logo size="xl" variant="onOrange" className="hidden md:block" />
                    <h1 className="text-3xl md:text-5xl font-bold font-clash text-center">cheers, keep<br /> rocking your fits</h1>
                    <p className="text-center text-base md:text-lg"><b>outfits.bio discontinued services on September 21st, 2024.</b> Posts, profiles, and the web app are no longer usable. On behalf of everyone who took part in outfits.bio, we thank and appreciate you for posting and engaging with styles across the globe. Keep rocking your fits, cheers.</p>
                </div>
                <h2 className="text-3xl md:text-5xl font-clash text-center">
                    Frequently Asked Questions
                </h2>
                <Accordion type="single" collapsible className="w-full max-w-96 font-satoshi">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Why is outfits.bio unavaliable?</AccordionTrigger>
                        <AccordionContent>
                            To be completely transparant, me, Jeremy I can't really find time to balance this side-project, my startup and school. Someday I may pick this back up, rewrite some stuff, create a mobile app and re-release. Reach out at @outfits.bio on X about further questions or concerns.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>What will happen to my data?</AccordionTrigger>
                        <AccordionContent>
                            All data will remain stored with us, as we are planning to re-release someday without you losing anything, if you would like your data removed please reach out at @outfits.bio on X .
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <p className="text-sm md:text-base text-center">We'll meet again - Jeremy</p>
                <p className="text-sm md:text-base text-center">Also I want to thank everyone who took part in outfits.bio, I appreciate you for posting and engaging with styles across the globe and specifically thanks to Brice Duke, funnydusto and Jess Daniel for their collaborations to make this platform possible.</p>
            </div>
        </>
    );
}
