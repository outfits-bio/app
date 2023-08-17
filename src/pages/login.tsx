import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '~/components/Button';
import { Layout } from '~/components/Layout';

import { DiscordLogo, GoogleLogo } from '@phosphor-icons/react';

const LoginPage = () => {
  const handleGoogle = async () => {
    signIn('google', { callbackUrl: `/profile`, redirect: true });
  };

  const handleDiscord = async () => {
    signIn('discord', { callbackUrl: `/profile`, redirect: true });
  };

  return (
    <Layout title='Login' showSlash={false} showActions={false}>
      <div className='flex flex-col md:flex-row w-screen h-full'>
        <div className='h-full flex w-full md:px-[90px] md:w-auto flex-col justify-center items-center gap-4 md:border-r border-black dark:border-white'>
          <h1 className='text-3xl sm:text-5xl font-black font-urbanist sm:w-72'>Your virtual wardrobe</h1>

          <div className='w-72 gap-4 flex flex-col mb-20'>
            <Button onClick={handleDiscord} iconRight={<DiscordLogo />}>Continue with Discord</Button>
            <Button onClick={handleGoogle} iconRight={<GoogleLogo />}>Continue with Google</Button>
          </div>
          <p className='bottom-0 fixed p-10 text-sm text-center w-96'>By clicking Get Started, you agree to our <span><Link href={'/docs/terms-of-service'} className='font-bold underline'>Terms of Service</Link></span> and <span><Link href={'/docs/privacy-policy'} className='font-bold underline'>Privacy Policy</Link></span>.</p>
        </div>


        <div className='h-full shrink-0 grow hidden overflow-hidden flex-col md:flex'>
          <div className='flex gap-10 -mt-96'>
            <div className='w-52 h-80 bg-black dark:bg-white rounded-lg rotate-12'></div>
            <div className='w-52 h-80 bg-black dark:bg-white rounded-lg rotate-12 mt-12'></div>
            <div className='w-52 h-80 bg-black dark:bg-white rounded-lg rotate-12 mt-24'></div>
            <div className='w-52 h-80 bg-black dark:bg-white rounded-lg rotate-12 mt-36'></div>
            <div className='w-52 h-80 bg-black dark:bg-white rounded-lg rotate-12 mt-48'></div>
            <div className='w-52 h-80 bg-black dark:bg-white rounded-lg rotate-12 mt-60'></div>
            <div className='w-52 h-80 bg-black dark:bg-white rounded-lg rotate-12 mt-72'></div>
          </div>
          <div className='flex gap-10 -mt-60'>
            <div className='w-52 h-80 bg-black dark:bg-white rounded-lg rotate-12'></div>
            <div className='w-52 h-80 bg-black dark:bg-white rounded-lg rotate-12 mt-12'></div>
            <div className='w-52 h-80 bg-black dark:bg-white rounded-lg rotate-12 mt-24'></div>
            <div className='w-52 h-80 bg-black dark:bg-white rounded-lg rotate-12 mt-36'></div>
            <div className='w-52 h-80 bg-black dark:bg-white rounded-lg rotate-12 mt-48'></div>
            <div className='w-52 h-80 bg-black dark:bg-white rounded-lg rotate-12 mt-60'></div>
            <div className='w-52 h-80 bg-black dark:bg-white rounded-lg rotate-12 mt-72'></div>
          </div>
          <div className='flex gap-10 -mt-60'>
            <div className='w-52 h-80 bg-black dark:bg-white rounded-lg rotate-12'></div>
            <div className='w-52 h-80 bg-black dark:bg-white rounded-lg rotate-12 mt-12'></div>
            <div className='w-52 h-80 bg-black dark:bg-white rounded-lg rotate-12 mt-24'></div>
            <div className='w-52 h-80 bg-black dark:bg-white rounded-lg rotate-12 mt-36'></div>
            <div className='w-52 h-80 bg-black dark:bg-white rounded-lg rotate-12 mt-48'></div>
            <div className='w-52 h-80 bg-black dark:bg-white rounded-lg rotate-12 mt-60'></div>
            <div className='w-52 h-80 bg-black dark:bg-white rounded-lg rotate-12 mt-72'></div>
          </div>
          <div className='flex gap-10 -mt-60'>
            <div className='w-52 h-80 bg-black dark:bg-white rounded-lg rotate-12'></div>
            <div className='w-52 h-80 bg-black dark:bg-white rounded-lg rotate-12 mt-12'></div>
            <div className='w-52 h-80 bg-black dark:bg-white rounded-lg rotate-12 mt-24'></div>
            <div className='w-52 h-80 bg-black dark:bg-white rounded-lg rotate-12 mt-36'></div>
            <div className='w-52 h-80 bg-black dark:bg-white rounded-lg rotate-12 mt-48'></div>
            <div className='w-52 h-80 bg-black dark:bg-white rounded-lg rotate-12 mt-60'></div>
            <div className='w-52 h-80 bg-black dark:bg-white rounded-lg rotate-12 mt-72'></div>
          </div>
        </div>
      </div>

    </Layout>
  );
};

export default LoginPage;