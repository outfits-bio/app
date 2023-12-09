"use client";

import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import { NextThemeProvider } from "./ThemeProvider";
import { SessionProvider } from "next-auth/react";

interface ProviderWrapperProps {
    children: React.ReactNode;
}

export const ProviderWrapper = ({ children }: ProviderWrapperProps) => {
    return <SessionProvider>
        <NextThemeProvider>
            <Toaster />
            <Analytics />
            {children}
        </NextThemeProvider>
    </SessionProvider>
}