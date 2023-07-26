import { signIn } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';
import { Button } from '~/components/Button';
import { Layout } from '~/components/Layout';

import { ArrowRight, DiscordLogo, GoogleLogo } from '@phosphor-icons/react';

import landing from '../../public/landing.png';

const Home = () => {
  return (
    <Layout title='outfits.bio' showSlash={false}>
      <div className='w-screen h-full flex flex-col gap-4 justify-center items-center font-urbanist pb-20 overflow-x-hidden'>
        <h1 className='text-5xl font-black'>Your virtual wardrobe</h1>

        <h3 className='font-inter text-gray-600 dark:text-white text-2xl w-[525px] text-center'>
          A virtual wardrobe where people can add photos of clothes to their profile and share them with a link like outfits.bio/jeremy.
        </h3>

        <div className='flex w-[525px] items-center gap-2'>
          <Button iconLeft={<GoogleLogo />} iconRight={<ArrowRight />} color='outline' onClick={() => signIn('google')} centerItems>
            Join with Google
          </Button>
          <Button iconLeft={<DiscordLogo />} iconRight={<ArrowRight />} color='outline' onClick={() => signIn('discord')} centerItems>
            Join with Discord
          </Button>
        </div>

        {/* <Image src={landing} alt='Landing Image' priority placeholder='blur' className='absolute bottom-0 left-1/2' /> */}
      </div>
    </Layout>
  );
};

export default Home;
