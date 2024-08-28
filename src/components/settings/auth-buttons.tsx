"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/Button";

export function AuthButtons(props: { provider: 'discord' | 'google' }) {
    const handleSignIn = () => {
        signIn(props.provider);
    };

    return <Button onClick={handleSignIn}>Connect</Button>
}