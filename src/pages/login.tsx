import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { Button } from '~/components/Button';

const LoginPage = () => {
  const handleGoogle = async () => {
    signIn('google', { callbackUrl: `/profile`, redirect: true });
  };

  const handleDiscord = async () => {
    signIn('discord', { callbackUrl: `/profile`, redirect: true });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white dark:bg-slate-950">
      <div className="rounded px-8 py-10 mb-4 max-w-sm w-full">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 mr-2 relative">
            <Image priority fill src="/favicon.ico" alt="Outfits Bio" sizes='32px' />
          </div>
          <h2 className="text-2xl font-semibold text-black dark:text-white font-prompt">Login</h2>
        </div>

        <div className='gap-4 flex flex-col'>
          <Button
            size='lg'
            color='secondary'
            onClick={handleGoogle}
          >
            Google
          </Button>
          <Button
            size='lg'
            color='secondary'
            onClick={handleDiscord}
          >
            Discord
          </Button>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;