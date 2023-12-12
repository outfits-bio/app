import '~/styles/globals.css';

import { meta } from 'next-seo.config';
import Head from 'next/head';
import { cookies } from "next/headers";
import { ProviderWrapper } from '~/components/ProviderWrapper';
import { TRPCReactProvider } from '~/components/TRPCWrapper';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        <ProviderWrapper>
          {children}
        </ProviderWrapper>
      </TRPCReactProvider>
    </>
  )
}