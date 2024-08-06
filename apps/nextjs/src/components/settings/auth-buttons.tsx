"use server";

import { signIn } from "@acme/auth";
import { Button } from "../ui/button";

export async function AuthButtons(props: { provider: 'discord' | 'google' }) {
    return <form>
        <Button formAction={
            async () => {
                "use server";
                await signIn(props.provider);
            }
        }>Connect</Button>
    </form>
}