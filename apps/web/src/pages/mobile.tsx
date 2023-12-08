import Image from "next/image";
import Link from "next/link";

import {
  PiBackpackBold, PiBaseballCapBold, PiCoatHangerBold, PiEyeglassesBold,
  PiPantsBold, PiShirtFoldedBold, PiShoppingBagOpenBold, PiSneakerBold, PiTShirtBold, PiWatchBold,
} from "react-icons/pi";
import landing from "../../public/mobile.png";
import { Button } from "~/components/Button";
import { Layout } from "~/components/Layout";

import { Logo } from "~/components/Logo";

const Mobile = () => {

  return (
    <Layout title="outfits.bio" showSlash={false}>
      <section className="-mt-20 flex h-screen w-full flex-col items-center gap-24 overflow-hidden border-b border-stroke pt-24">
        <div className="relative px-44 py-28">
          <PiCoatHangerBold className="absolute left-20 top-8 -rotate-12 text-6xl text-stroke transition-colors duration-300 hover:text-secondary-text" />
          <PiPantsBold className="absolute left-12 top-40 rotate-12 text-6xl text-stroke transition-colors duration-300 hover:text-secondary-text" />
          <PiSneakerBold className="absolute bottom-8 rotate-[30deg] text-6xl text-stroke transition-colors duration-300 hover:text-secondary-text md:bottom-16" />
          <PiEyeglassesBold className="absolute bottom-0 left-80 -rotate-[30deg] text-6xl text-stroke transition-colors duration-300 hover:text-secondary-text" />
          <PiBackpackBold className="absolute bottom-0 left-[480px] hidden -rotate-12 text-6xl text-stroke transition-colors duration-300 hover:text-secondary-text md:block" />
          <PiWatchBold className="absolute bottom-0 right-52 hidden rotate-[30deg] text-6xl text-stroke transition-colors duration-300 hover:text-secondary-text md:block" />
          <PiShirtFoldedBold className="absolute bottom-20 right-28 rotate-[30deg] text-6xl text-stroke transition-colors duration-300 hover:text-secondary-text" />
          <PiTShirtBold className="absolute right-16 top-40 -rotate-[30deg] text-6xl text-stroke transition-colors duration-300 hover:text-secondary-text" />
          <PiShoppingBagOpenBold className="absolute right-36 top-8 -rotate-12 text-6xl text-stroke transition-colors duration-300 hover:text-secondary-text" />
          <PiBaseballCapBold className="absolute right-1/2 top-8 rotate-[30deg] text-6xl text-stroke transition-colors duration-300 hover:text-secondary-text" />

          <div className="flex flex-col gap-4 text-center">
            <h1 className="orange-selection font-clash text-4xl font-bold md:text-5xl">
              Fit-checks{" "}
              <span className="underline-skew orange-selection">on the go</span>
            </h1>
            <article className="orange-selection relative m-auto flex w-[335px] flex-col overflow-hidden text-center text-secondary-text md:w-[400px]">
              <p className="inline">
                Have a native outfits.bio app right from your pocket. Because we do not know the demand please join our waitlist if you are interested. Android & iOS
              </p>
            </article>

            <div className="flex justify-center gap-3">
              <div>
                <Link href={"#"}>
                  <Button
                    variant={"outline-ghost"}
                    className="orange-selection"
                  >
                    Donate devs
                  </Button>
                </Link>
              </div>

              <div>
                <Link href={"#"}>
                  <Button className="orange-selection">Join Waitlist</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Image
          src={landing}
          alt="Landing Image"
          className="w-11/12 md:w-2/3 object-contain hover:-translate-y-16 transition-all duration-300"
        />
      </section>

      <section className="flex w-screen items-center justify-center py-12">
        <div className="flex w-full flex-col gap-12 px-12 md:flex-row md:justify-between xl:w-3/4">
          <div className="flex flex-col">
            <h1 className="mb-2 flex items-center gap-2 font-clash text-3xl font-black">
              <Logo /> outfits.bio
            </h1>
            <p className="text-[11px] text-secondary-text">
              You make the look, we&apos;ll make the link!
            </p>
            <p className="text-[11px] text-secondary-text">
              Copyright © 2023, All Rights Reserved.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:gap-20 xl:gap-32">
            <div className="flex flex-col gap-1 text-secondary-text">
              <h3 className="font-bold text-gray-500">Explore</h3>
              <Link href="/discover" className="text-sm">
                Discover
              </Link>
              <Link href="/discover" className="text-sm">
                Blog
              </Link>
            </div>

            <div className="flex flex-col gap-1 text-secondary-text">
              <h3 className="font-bold text-gray-500">Socials</h3>
              <Link
                href="https://twitter.com/linkyouroutfits"
                className="text-sm"
              >
                X (formerly Twitter)
              </Link>
              <Link href="https://discord.gg/f4KEs5TVz2" className="text-sm">
                Discord
              </Link>
              <Link
                href="https://www.producthunt.com/posts/outfits-bio"
                className="text-sm"
              >
                Product Hunt
              </Link>
            </div>

            <div className="flex flex-col gap-1 text-secondary-text">
              <h3 className="font-bold text-gray-500">Legal</h3>
              <Link href="/docs/privacy-policy" className="text-sm">
                Privacy Policy
              </Link>
              <Link href="/docs/terms-of-service" className="text-sm">
                Terms of Service
              </Link>
              <Link href="/docs/brand-guide" className="text-sm">
                Brand Guide
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Mobile;
