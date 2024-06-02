import "@/styles/globals.css";

import { meta } from 'next-seo.config';
import localFont from 'next/font/local';
import { cookies } from "next/headers";

import { getServerAuthSession } from "@/server/auth";
import { TRPCReactProvider } from "@/trpc/react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast';
import { MobileNav } from "./_components/navigation/mobile-nav";
import { Navbar } from "./_components/navigation/navbar";
import SessionProvider from "./_components/wrappers/session-provider";

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
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/icon.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)", url: "/splash_screens/iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_landscape.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)", url: "/splash_screens/iPhone_15_Pro__iPhone_15__iPhone_14_Pro_landscape.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)", url: "/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_landscape.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)", url: "/splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_landscape.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)", url: "/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_landscape.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)", url: "/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_landscape.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)", url: "/splash_screens/iPhone_11__iPhone_XR_landscape.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)", url: "/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_landscape.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)", url: "/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_landscape.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)", url: "/splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_landscape.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)", url: "/splash_screens/12.9__iPad_Pro_landscape.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)", url: "/splash_screens/11__iPad_Pro__10.5__iPad_Pro_landscape.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)", url: "/splash_screens/10.9__iPad_Air_landscape.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)", url: "/splash_screens/10.5__iPad_Air_landscape.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)", url: "/splash_screens/10.2__iPad_landscape.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)", url: "/splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_landscape.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)", url: "/splash_screens/8.3__iPad_Mini_landscape.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)", url: "/splash_screens/iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_portrait.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)", url: "/splash_screens/iPhone_15_Pro__iPhone_15__iPhone_14_Pro_portrait.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)", url: "/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)", url: "/splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)", url: "/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)", url: "/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)", url: "/splash_screens/iPhone_11__iPhone_XR_portrait.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)", url: "/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)", url: "/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)", url: "/splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)", url: "/splash_screens/12.9__iPad_Pro_portrait.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)", url: "/splash_screens/11__iPad_Pro__10.5__iPad_Pro_portrait.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)", url: "/splash_screens/10.9__iPad_Air_portrait.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)", url: "/splash_screens/10.5__iPad_Air_portrait.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)", url: "/splash_screens/10.2__iPad_portrait.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)", url: "/splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_portrait.png" },
    { rel: "apple-touch-startup-image", media: "screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)", url: "/splash_screens/8.3__iPad_Mini_portrait.png" },
  ],
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
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className={`font-satoshi ${clash.variable} ${satoshi.variable} flex flex-col min-h-screen antialiased transition-colors duration-300`}>
        <SessionProvider session={session}>
          <TRPCReactProvider cookies={cookies().toString()}>
            <Navbar />
            <main className="h-screen pt-20 overflow-x-hidden md:pb-0 scroll-smooth pb-20">
              {children}
            </main>
            <MobileNav />
            <Toaster
              toastOptions={{
                className: 'border font-clash font-bold',
              }}
            />
          </TRPCReactProvider>
        </SessionProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
