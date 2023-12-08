import '~/styles/globals.css';

import { Analytics } from '@vercel/analytics/react';
import type { AppType } from 'next/app';
import Head from 'next/head';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { meta } from 'next-seo.config';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { api } from '~/utils/api.util';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <title>{meta.title}</title>
        <meta name="theme-color" content={meta.og.embedColor} />
        <link rel="icon" href="favicon.ico" sizes="32px" />
        <meta name="description" content={meta.description} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content={meta.url} />
        <meta property="og:type" content={meta.og.type} />
        <meta property="og:title" content={meta.og.title} />
        <meta property="og:description" content={meta.og.description} />
        <meta property="og:image" content={meta.og.image} />
        <meta property="og:site_name" content={meta.og.siteName} />
        <meta name="twitter:card" content={meta.twitter.card} />
        <meta name="twitter:domain" content={meta.twitter.domain} />
        <meta name="twitter:url" content={meta.twitter.url} />
        <meta name="twitter:title" content={meta.twitter.title} />
        <meta name="twitter:description" content={meta.twitter.description} />
        <meta name="twitter:image" content={meta.twitter.image} />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
      </Head>

      <SessionProvider session={session}>
        <ThemeProvider enableSystem attribute="class" defaultTheme='light' themes={['light', 'dark', 'light-brown', 'light-hot-pink', 'light-orange', 'light-light-pink']}>
          <Toaster />
          <Analytics />
          <Component {...pageProps} />
        </ThemeProvider>
      </SessionProvider>

    </>
  );
};

export default api.withTRPC(MyApp);