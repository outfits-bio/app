import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Button } from '~/components/Button';
import { Layout } from '~/components/Layout';

import { ArrowRight, CoatHanger, DiscordLogo, GoogleLogo } from '@phosphor-icons/react';

import landing from '../../public/landing.png';

const Home = () => {
  const { status, data } = useSession();
  const { push } = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      push(`/${data.user.username}`);
    }
  }, [status]);

  return (
    <Layout title='outfits.bio' showSlash={false}>
      <div className='w-full h-screen flex -mt-20 pt-20'>
        <div className='w-full xl:w-1/2 xl:pl-20 flex flex-col justify-center items-center xl:items-start gap-4 text-center xl:text-left'>
          <h1 className='text-4xl sm:text-5xl font-black font-urbanist'>Your virtual wardrobe</h1>

          <h3 className='font-inter text-gray-600 dark:text-white text-lg sm:text-2xl flex sm:w-[550px] px-12 sm:px-0'>
            A virtual wardrobe where people can add photos of clothes to their profile and share them with a link-in-bio like outfits.bio/jeremy.
          </h3>

          <div className='w-full px-12 sm:px-0 flex flex-col sm:flex-row sm:w-[550px] items-center gap-2'>
            <div className='grow w-full'>
              <Button variant='outline' centerItems>
                <Link href='/login'>
                  Sign up!
                </Link>
              </Button>
            </div>
            <div className='grow w-full'>
              <Link href={'#more'}>
                <Button iconRight={<ArrowRight />} variant='ghost' centerItems>
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className='w-1/2 justify-end items-end hidden xl:flex'>
          <Image src={landing} alt='Landing Image' priority placeholder='blur' className='object-cover object-right-top w-3/4' />
        </div>
      </div>

      <div id='more' className='w-full flex xl:flex-row flex-col px-12 sm:px-20 py-24 border-y border-black justify-between items-center xl:items-start gap-8'>
        <div className='w-full flex items-center justify-center xl:justify-start'>
          <video src={'/share.mp4'} autoPlay controls={false} loop muted width={450} height={288} className='object-cover object-right-top max-w-full rounded-lg bg-black' />
        </div>

        <div className='xl:w-1/2 flex flex-col justify-center items-center gap-4 text-center xl:text-right sm:w-[550px]'>
          <h1 className='text-4xl sm:text-5xl font-black font-urbanist'>Your fashion link-in-bio</h1>
          <p className='font-inter text-gray-600 dark:text-white text-lg sm:text-2xl flex'>Upload your pictures and share your personal link in your tiktok or instagram bio!</p>

          <Link href='/login' className='w-full'>
            <Button variant='outline' centerItems iconRight={<ArrowRight />}>
              Create a profile!
            </Button>
          </Link>
        </div>
      </div>

      <div className='w-full flex xl:flex-row flex-col-reverse px-12 sm:px-20 py-24 justify-between items-center xl:items-start gap-8 text-center xl:text-left'>
        <div className='flex flex-col justify-center items-left gap-4 sm:w-[550px]'>
          <h1 className='text-4xl sm:text-5xl font-black font-urbanist'>Show or recieve likes!</h1>
          <p className='font-inter text-gray-600 dark:text-white text-lg sm:text-2xl flex'>Do you like someones wardrobe? Make sure to show them love by liking their profile!</p>

          <Link href='/explore' className='w-full'>
            <Button variant='outline' centerItems iconRight={<ArrowRight />}>
              Start exploring!
            </Button>
          </Link>
        </div>

        <div className='w-full xl:w-1/2 flex justify-center xl:justify-end items-center'>
          <video src={'/like.mp4'} autoPlay controls={false} loop muted width={450} height={288} className='object-cover object-right-top max-w-full rounded-lg bg-black' />
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-12 w-full py-12 px-20 justify-between'>
        <div className='flex flex-col items-left'>
          <h1 className='text-lg font-black font-urbanist flex items-center gap-2'><CoatHanger className='mt-1' /> outfits.bio</h1>
          <p className='text-sm text-gray-500'>Your wardrobe in your bio.</p>
        </div>

        <div className='grid gap-8 lg:gap-20 xl:gap-32 grid-cols-1 sm:grid-cols-3'>
          <div className='flex flex-col gap-1'>
            <h3 className='font-bold font-urbanist'>Explore</h3>
            <Link href='/explore' className='text-sm text-gray-500 underline'>Explore</Link>
          </div>

          <div className='flex flex-col gap-1'>
            <h3 className='font-bold font-urbanist'>Socials</h3>
            <Link href='https://www.producthunt.com/posts/outfits-bio' className='text-sm text-gray-500 underline'>Product Hunt</Link>
            <Link href='https://discord.gg/f4KEs5TVz2' className='text-sm text-gray-500 underline'>Discord Server</Link>
          </div>

          <div className='flex flex-col gap-1'>
            <h3 className='font-bold font-urbanist'>Legal</h3>
            <Link href='/docs/privacy-policy' className='text-sm text-gray-500 underline'>Privacy Policy</Link>
            <Link href='/docs/terms-of-service' className='text-sm text-gray-500 underline'>Terms of Service</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
