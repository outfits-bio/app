import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { LandingElements } from '~/components/LandingElements';
import { Layout } from '~/components/Layout';

import { ArrowRight } from '@phosphor-icons/react';

import landing from '../../public/landing.png';

const Home = () => {
  return (
    <Layout title='outfits.bio' showSlash={false}>
      <div className='w-full flex flex-col items-center pt-16 h-screen fixed'>
        <div className='flex flex-col gap-6 sm:w-[518px] w-5/6 text-center items-center'>
          <Link href={'/login'}>
            <button className='hover:text-black border dark:border-white border-slate-500 rounded-xl flex justify-between items-center px-4 py-2 gap-4 hover:bg-gradient-to-r hover:from-[#bf0fff] hover:via-[#C58CA0] hover:to-[#cbff49] background-animate'>
              <p>We&apos;ve launched our open beta</p>
              <ArrowRight />
            </button>
          </Link>
          <h1 className='sm:text-5xl text-3xl font-bold'>Your virtual wardrobe</h1>
          <p className='sm:text-xl'>A virtual wardrobe where people can add photos of clothes to their profile and share them with a link like outfits.bio/jeremy.</p>
        </div>

        <div className='w-5/6 h-full flex justify-center items-end relative'>
          <LandingElements />
          <Image src={landing} alt='ogimage' priority className='z-10 object-contain lg:w-[77%] sm:h-5/6 object-bottom w-full mb-20 sm:mb-0' />
        </div>
      </div>
    </Layout>
  );
};

export default Home;
