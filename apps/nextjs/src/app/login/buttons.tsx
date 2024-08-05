"use server";

import { signIn } from "@acme/auth";
import { PiDiscordLogo, PiGoogleLogo } from "react-icons/pi";
import { Button } from "~/components/ui/Button";

export async function LoginButtons() {

    return <form className='w-72 gap-4 flex flex-col mb-20'>
        <Button formAction={async () => {
            "use server";
            await signIn('discord', { callbackUrl: `/profile`, redirect: true });
        }}
            iconRight={<PiDiscordLogo />}
        >
            Continue with Discord
        </Button>

        <Button formAction={async () => {
            "use server";
            await signIn('google', { callbackUrl: `/profile`, redirect: true });
        }}
            iconRight={<PiGoogleLogo />}
        >
            Continue with Google
        </Button>
    </form>
}