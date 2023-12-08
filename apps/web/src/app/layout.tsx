import '~/styles/globals.css';

import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { meta } from 'next-seo.config';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { api } from '~/utils/api.util';

export const metadata = {
  title: meta.title,
  description: meta.description,
  image: meta.image,
  url: meta.url,
  og: {
    locale: meta.og.locale,
    type: meta.og.type,
    title: meta.og.title,
    description: meta.og.description,
    image: meta.og.image,
    embedColor: meta.og.embedColor,
    imageWidth: meta.og.imageWidth,
    imageHeight: meta.og.imageHeight,
    siteName: meta.og.siteName,
  },
  twitter: {
    card: meta.twitter.card,
    domain: meta.twitter.domain,
    url: meta.twitter.url,
    title: meta.twitter.title,
    description: meta.twitter.description,
    image: meta.twitter.image,
    imageWidth: meta.twitter.imageWidth,
    imageHeight: meta.twitter.imageHeight,
  },
}

export default api.withTRPC(function RootLayout({ Component, pageProps }: AppProps & { session: Session | null }) {
  const { session, ...restPageProps } = pageProps;
  return (
    <SessionProvider session={session}>
      <ThemeProvider enableSystem attribute="class" defaultTheme='light' themes={['light', 'dark', 'light-brown', 'light-hot-pink', 'light-orange', 'light-light-pink']}>
        <Toaster />
        <Analytics />
        <Component {...restPageProps} />
      </ThemeProvider>
    </SessionProvider>
  )
});