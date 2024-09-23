import "@/styles/globals.css";

import { meta, icons } from "@/next-seo.config";
import localFont from "next/font/local";
import { cookies } from "next/headers";

import { getServerAuthSession } from "@/server/auth";
import { TRPCReactProvider } from "@/trpc/react";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { Navbar } from "@/components/navigation/navbar";
import SessionProvider from "@/components/wrappers/session-provider";
import ThemeProvider from "@/components/wrappers/theme-provider";

const clash = localFont({
  src: "../../public/fonts/ClashDisplay-Variable.woff2",
  display: "swap",
  variable: "--font-clash",
});

const satoshi = localFont({
  src: "../../public/fonts/Satoshi-Variable.woff2",
  display: "swap",
  variable: "--font-satoshi",
});

export const metadata: Metadata = {
  title: {
    template: "outfits.bio - %s",
    default: meta.title,
  },
  description: meta.description,
  openGraph: {
    locale: meta.og.locale,
    type: "website",
    title: meta.og.title,
    description: meta.og.description,
    images: meta.og.image,
    url: meta.url,
    siteName: meta.og.siteName,
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: meta.twitter.image,
        width: meta.twitter.imageWidth,
        height: meta.twitter.imageHeight,
      },
    ],
    site: meta.twitter.domain,
    title: meta.twitter.title,
    description: meta.twitter.description,
  },
  icons: icons,
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  initialScale: 1,
  viewportFit: "cover",
  width: "device-width",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDev = process.env.NODE_ENV === "development";
  const session = await getServerAuthSession();

  return (
    <html lang="en" suppressHydrationWarning={isDev}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="theme-color"
          content="#000000"
          media="(prefers-color-scheme: dark)"
        />
      </head>
      <body
        suppressHydrationWarning={isDev}
        className={`font-satoshi ${clash.variable} ${satoshi.variable} flex flex-col min-h-screen antialiased transition-colors duration-300`}
      >
        <SessionProvider session={session}>
          <TRPCReactProvider cookies={cookies().toString()}>
            <ThemeProvider>
              <Navbar />
              <main className="h-screen pt-12 md:pt-20 overflow-x-hidden scroll-smooth">
                {isDev ? children : "Service has been discontinued"}
              </main>
              <MobileNav />
              <Toaster
                toastOptions={{
                  className: "border font-clash font-bold",
                }}
              />
            </ThemeProvider>
          </TRPCReactProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
