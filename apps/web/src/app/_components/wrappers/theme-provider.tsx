"use client";

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="light"
            themes={['light', 'dark', 'light-brown', 'light-hot-pink', 'light-orange', 'light-light-pink']}>
            {children}
        </NextThemesProvider>
    );
}

export default ThemeProvider;