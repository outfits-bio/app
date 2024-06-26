import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginButtons } from "./buttons";
import { api } from "@/trpc/server";
import Image from "next/image";
import { formatImage } from "@/utils/image-src-format.util";


export default async function LoginPage() {
  const session = await getServerAuthSession();
  const posts = await api.post.getFourRandomPosts.query();

  if (session && session.user) {
    redirect(`${session.user.username}`);
  }

  return (
    <div className='relative flex flex-col md:flex-row w-screen h-full'>
      <div className='h-full flex w-full flex-col justify-center items-center gap-4'>
        <h1 className='text-3xl sm:text-5xl font-black font-clash sm:w-80 text-center'>
          Your virtual wardrobe
        </h1>
        <LoginButtons />
        <p className='bottom-0 fixed p-10 text-sm text-center w-96'>
          By signing up, you agree to our{' '}
          <span>
            <Link href={'/docs/terms-of-service'} className='font-bold underline'>
              Terms of Service
            </Link>
          </span>{' '}
          and{' '}
          <span>
            <Link href={'/docs/privacy-policy'} className='font-bold underline'>
              Privacy Policy
            </Link>
          </span>
          .
        </p>
      </div>
      <div className='absolute inset-0 hidden md:block -z-10'>
        {posts.map((post, i) => (
          <div
            key={i}
            className={`opacity-0 absolute bg-gray-200 w-40 h-60 border rounded-lg transform rotate-${i % 2 === 0 ? 6 : -6} ${i === 0 ? 'top-20 right-40' : i === 1 ? 'bottom-20 left-40' : i === 2 ? '-rotate-12 top-20 left-1' : '-rotate-6 bottom-40 right-1'
              } pop-in-${i + 1}`}
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            {post?.image && post?.user && (
              <Image
                sizes='176px'
                src={formatImage(post.image, post.user.id)}
                className='object-cover rounded-lg'
                fill
                alt={post.type}
                priority
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}