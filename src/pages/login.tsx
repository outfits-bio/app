import { signIn } from 'next-auth/react';
import Image from 'next/image';

const LoginPage = () => {
  const handleGoogle = async () => {
    signIn('google', { callbackUrl: '/onboarding', redirect: true });
  };

  const handleDiscord = async () => {
    signIn('discord', { callbackUrl: '/onboarding', redirect: true });
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

        <button
          onClick={handleGoogle}
          className="w-full h-12 bg-gray-700 hover:bg-gray-900 dark:bg-gray-600 dark:hover:bg-gray-700 text-white font-semibold rounded-md mt-4"
        >
          Google
        </button>
        <button
          onClick={handleDiscord}
          className="w-full h-12 bg-gray-700 hover:bg-gray-900 dark:bg-gray-600 dark:hover:bg-gray-700 text-white font-semibold rounded-md mt-4"
        >
          Discord
        </button>

      </div>
    </div>
  );
};

export default LoginPage;