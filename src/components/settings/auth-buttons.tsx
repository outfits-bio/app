"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/Button";

export function AuthButtons(props: { provider: "discord" | "google" }) {
  const handleSignIn = async () => {
    try {
      await signIn(props.provider);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return <Button onClick={handleSignIn}>Connect</Button>;
}
