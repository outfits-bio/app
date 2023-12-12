/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import nextBudleAnalyzer from "@next/bundle-analyzer";
import million from "million/compiler";
import withPlugins from "next-compose-plugins";
import nextPWA from "next-pwa";

await import("./src/env.mjs");

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const withBundleAnalyzer = nextBudleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: true,
});

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    domains: [
      "pub-4bf8804d3efc464b862de36f974618d4.r2.dev",
      "lh3.googleusercontent.com",
      "cdn.discordapp.com",
      "ui-avatars.com",
      "upload.wikimedia.org",
    ],
    unoptimized: true,
  },
};

export default withPlugins([withBundleAnalyzer, withPWA, million.next], config);
