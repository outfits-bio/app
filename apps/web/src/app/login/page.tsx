import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginButtons } from "./buttons";


export default async function LoginPage() {
    const session = await getServerAuthSession();

    if (session && session.user) {
        redirect(`${session.user.username}`);
    }

    return <div className='relative flex flex-col md:flex-row w-screen h-full'>
    <div className='h-full flex w-full flex-col justify-center items-center gap-4'>
      <h1 className='text-3xl sm:text-5xl font-black font-clash sm:w-80 text-center'>
        Your virtual wardrobe
      </h1>
      <LoginButtons />
      <p className='bottom-0 fixed p-10 text-sm text-center w-96'>
        By signing up, you agree to our <span><Link href={'/docs/terms-of-service'} className='font-bold underline'>Terms of Service</Link></span> and <span><Link href={'/docs/privacy-policy'} className='font-bold underline'>Privacy Policy</Link></span>.
      </p>
    </div>
    <div className='absolute inset-0 hidden md:block -z-10'>
      <div className='absolute bg-gray-200 w-32 h-48 rounded-lg transform -rotate-12 top-20 left-1 pop-in-1'></div>
      <div className='absolute bg-gray-200 w-32 h-48 rounded-lg transform rotate-6 top-20 right-40 pop-in-2' style={{ animationDelay: '0.2s' }}></div>
      <div className='absolute bg-gray-200 w-32 h-48 rounded-lg transform rotate-3 bottom-20 left-40 pop-in-3' style={{ animationDelay: '0.4s' }}></div>
      <div className='absolute bg-gray-200 w-32 h-48 rounded-lg transform -rotate-6 bottom-40 right-1 pop-in-4' style={{ animationDelay: '0.6s' }}></div>
    </div>
  </div>  
}