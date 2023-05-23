import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";

import Head from 'next/head';
import { metadata } from 'next-seo.config';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
<>
<Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content={metadata.url} />
        <meta property="og:type" content={metadata.og.type} />
        <meta property="og:title" content={metadata.og.title} />
        <meta property="og:description" content={metadata.og.description} />
        <meta property="og:image" content={metadata.og.image} />
        <meta property="og:site_name" content={metadata.og.siteName} />
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:domain" content={metadata.twitter.domain} />
        <meta name="twitter:url" content={metadata.twitter.url} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta name="twitter:description" content={metadata.twitter.description} />
        <meta name="twitter:image" content={metadata.twitter.image} />
      </Head>

    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>

    </>
  );
};

export default api.withTRPC(MyApp);
