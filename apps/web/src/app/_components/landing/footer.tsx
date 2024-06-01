import Link from "next/link";
import { Logo } from "../ui/Logo";

export function Footer() {

  return <section className='flex justify-center items-center w-screen py-12'>
    <div className='flex flex-col w-full md:flex-row md:justify-between gap-12 xl:w-3/4 px-12'>
      <div className='flex flex-col'>
        <h1 className='text-3xl font-black font-clash flex items-center gap-2 mb-2'><Logo /> outfits.bio</h1>
        <p className='text-[11px] text-secondary-text'>You make the look, we&apos;ll make the link!</p>
        <p className='text-[11px] text-secondary-text'>Copyright © 2023, All Rights Reserved.</p>
      </div>

      <div className='grid gap-8 lg:gap-20 xl:gap-32 grid-cols-1 sm:grid-cols-3'>
        <div className='flex flex-col gap-1 text-secondary-text'>
          <h3 className='font-bold text-gray-500'>Explore</h3>
          <Link href='/' className='text-sm'>Discover</Link>
        </div>

        <div className='flex flex-col gap-1 text-secondary-text'>
          <h3 className='font-bold text-gray-500'>Socials</h3>
          <Link href='https://twitter.com/linkyouroutfits' className='text-sm'>X (formerly Twitter)</Link>
          <Link href='https://discord.gg/f4KEs5TVz2' className='text-sm'>Discord</Link>
        </div>

        <div className='flex flex-col gap-1 text-secondary-text'>
          <h3 className='font-bold text-gray-500'>Legal</h3>
          <Link href='/docs/privacy-policy' className='text-sm'>Privacy Policy</Link>
          <Link href='/docs/terms-of-service' className='text-sm'>Terms of Service</Link>
          <Link href='/docs/brand-guide' className='text-sm'>Brand Guide</Link>
        </div>
      </div>
    </div>
  </section>
}