import '~/styles/globals.css';

import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { meta } from 'next-seo.config';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { TRPCReactProvider } from '~/components/TRPCWrapper';
import { cookies } from "next/headers";
import { NextThemeProvider } from '~/components/ThemeProvider';

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
};

export default function RootLayout({ Component, pageProps }: AppProps & { session: Session | null }) {
  const { session, ...restPageProps } = pageProps;
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="favicon.ico" sizes="32px" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
      </Head>
      <TRPCReactProvider cookies={cookies().toString()}>
      <SessionProvider session={session}>
        <NextThemeProvider>
          <Toaster />
          <Analytics />
          <Component {...restPageProps} />
        </NextThemeProvider>
      </SessionProvider>
      </TRPCReactProvider>
    </>
  )
};