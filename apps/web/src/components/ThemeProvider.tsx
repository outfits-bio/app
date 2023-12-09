import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function NextThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider attribute="class" defaultTheme="light" themes={['light', 'dark', 'light-brown', 'light-hot-pink', 'light-orange', 'light-light-pink']}>
            {children}
        </NextThemesProvider>
    );
}