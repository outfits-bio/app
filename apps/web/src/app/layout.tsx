import '~/styles/globals.css';

import { Analytics } from '@vercel/analytics/react';
import type { AppType } from 'next/app';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { meta } from 'next-seo.config';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { api } from '~/utils/api.util';

export const metadata = {
  title: meta.title,
  description: meta.description,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider enableSystem attribute="class" defaultTheme='light' themes={['light', 'dark', 'light-brown', 'light-hot-pink', 'light-orange', 'light-light-pink']}>
        <Toaster />
        <Analytics />
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  )
}
