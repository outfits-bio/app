import "@/styles/globals.css";

import localFont from 'next/font/local';
import { cookies } from "next/headers";
import { meta } from 'next-seo.config';

import { TRPCReactProvider } from "@/trpc/react";
import type { Metadata } from "next";
import { getServerAuthSession } from "@/server/auth";
import SessionProvider from "./_components/wrappers/session-provider";
import { Navbar } from "./_components/navigation/navbar";

const clash = localFont({
  src: '../../public/fonts/ClashDisplay-Variable.woff2',
  display: 'swap',
  variable: '--font-clash',
});

const satoshi = localFont({
  src: '../../public/fonts/Satoshi-Variable.woff2',
  display: 'swap',
  variable: '--font-satoshi',
});

export const metadata: Metadata = {
  title: {
    template: 'outfits.bio - %s',
    default: meta.title, // a default is required when creating a template
  },
  description: meta.description,
  openGraph: {
    locale: meta.og.locale,
    type: 'website',
    title: meta.og.title,
    description: meta.og.description,
    images: meta.og.image,
    url: meta.url,
    siteName: meta.og.siteName,
  },
  twitter: {
    card: 'summary_large_image',
    images: [{
      url: meta.twitter.image,
      width: meta.twitter.imageWidth,
      height: meta.twitter.imageHeight,
    }],
    site: meta.twitter.domain,
    title: meta.twitter.title,
    description: meta.twitter.description,
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }, { rel: "apple-touch-icon", url: "/icon.png" }],
  manifest: '/manifest.json',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  return (
    <html lang="en">
      <body className={`font-satoshi ${clash.variable} ${satoshi.variable} flex flex-col min-h-screen antialiased transition-colors duration-300`}>
        <SessionProvider session={session}>
          <TRPCReactProvider cookies={cookies().toString()}>
            <Navbar />
            <main className="h-screen pt-20 overflow-x-hidden pb-24 md:pb-0 scroll-smooth">
              {children}
            </main>
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
