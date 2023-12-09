import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function NextThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider attribute="class" defaultTheme="light" themes={['light', 'dark']}>
            {children}
        </NextThemesProvider>
    );
}