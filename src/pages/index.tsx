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
            <Button color='outline' centerItems>
              <Link href='/login'>
                Sign up!
              </Link>
            </Button>
            <Button iconRight={<ArrowRight />} color='ghost' centerItems>
              <Link href={'#more'}>
                Learn More
              </Link>
            </Button>
          </div>
        </div>

        <div className='w-1/2 justify-end items-end hidden xl:flex'>
          <Image src={landing} alt='Landing Image' priority placeholder='blur' className='object-cover object-right-top w-3/4' />
        </div>
      </div>

      <div className='w-full flex xl:flex-row flex-col px-12 sm:px-20 py-24 border-y border-black justify-between items-center xl:items-start gap-8'>
        <div className='w-full flex items-center justify-center xl:justify-start'>
          {/* <Image src={landing} alt='Landing Image' priority placeholder='blur' className='object-cover object-right-top w-3/4' /> */}
          <div className='max-w-full w-[450px] h-72 rounded-lg bg-black' />
        </div>

        <div className='xl:w-1/2 flex flex-col justify-center items-center gap-4 text-center xl:text-right sm:w-[550px]'>
          <h1 className='text-4xl sm:text-5xl font-black font-urbanist'>Your fashion link-in-bio</h1>
          <p className='font-inter text-gray-600 dark:text-white text-lg sm:text-2xl flex'>Upload your pictures and share your personal link in your tiktok or instagram bio!</p>

          <Link href='/login' className='w-full'>
            <Button color='outline' centerItems iconRight={<ArrowRight />}>
              Sign up now!
            </Button>
          </Link>
        </div>
      </div>

      <div className='w-full flex xl:flex-row flex-col-reverse px-12 sm:px-20 py-24 justify-between items-center xl:items-start gap-8 text-center xl:text-left'>
        <div className='flex flex-col justify-center items-center gap-4 sm:w-[550px]'>
          <h1 className='text-4xl sm:text-5xl font-black font-urbanist'>Show or recieve likes!</h1>
          <p className='font-inter text-gray-600 dark:text-white text-lg sm:text-2xl flex'>Do you like someones wardrobe? Make sure to show them love by liking their profile!</p>

          <Link href='/login' className='w-full'>
            <Button color='outline' centerItems iconRight={<ArrowRight />}>
              Sign up now!
            </Button>
          </Link>
        </div>

        <div className='w-full xl:w-1/2 flex justify-center xl:justify-end items-center'>
          {/* <Image src={landing} alt='Landing Image' priority placeholder='blur' className='object-cover object-right-top w-3/4' /> */}
          <div className='max-w-full w-[450px] h-72 rounded-lg bg-black' />
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-12 items-center w-full py-12 px-20'>
        <div className='flex flex-col items-center'>
          <h1 className='text-lg font-black font-urbanist flex items-center gap-2'><CoatHanger className='mt-1' /> outfits.bio</h1>
          <p className='text-sm text-gray-500'>Your wardrobe in your bio.</p>
        </div>


      </div>
    </Layout>
  );
};

export default Home;
