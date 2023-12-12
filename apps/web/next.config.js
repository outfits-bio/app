/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    domains: [
      "pub-4bf8804d3efc464b862de36f974618d4.r2.dev",
      "lh3.googleusercontent.com",
      "cdn.discordapp.com",
      "ui-avatars.com",
      "upload.wikimedia.org",
    ],
  },
};

export default config;
