"use client";

import { signIn } from "next-auth/react";
import { PiDiscordLogo, PiGoogleLogo } from "react-icons/pi";
import { Button } from "@/components/ui/Button";

export function LoginButtons() {
  const handleGoogle = async () =>
    signIn("google", { callbackUrl: `/profile`, redirect: true });

  const handleDiscord = async () =>
    signIn("discord", { callbackUrl: `/profile`, redirect: true });

  return (
    <div className="w-72 gap-4 flex flex-col mb-20">
      <Button onClick={handleDiscord} iconRight={<PiDiscordLogo />}>
        Continue with Discord
      </Button>
      <Button onClick={handleGoogle} iconRight={<PiGoogleLogo />}>
        Continue with Google
      </Button>
    </div>
  );
}
