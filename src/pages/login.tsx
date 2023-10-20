import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { PiDiscordLogo, PiGoogleLogo, PiHammer, PiSealCheck } from 'react-icons/pi';
import { Button } from '~/components/Button';
import { Layout } from '~/components/Layout';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api.util';
import { formatAvatar, formatImage } from '~/utils/image-src-format.util';


import { PostSkeleton } from '../components/Skeletons/PostSkeleton';

const LoginPage = () => {
  const handleGoogle = async () => {
    signIn('google', { callbackUrl: `/profile`, redirect: true });
  };

  const handleDiscord = async () => {
    signIn('discord', { callbackUrl: `/profile`, redirect: true });
  };

  const { data: posts, isLoading } = api.post.getLoginPosts.useQuery(undefined, {});

  return (
    <Layout title='Login' showSlash={false} showActions={false} hideSearch={true}>
      <div className='flex flex-col md:flex-row w-screen h-full'>
        <div className='h-full flex w-full md:px-[90px] md:w-auto flex-col justify-center items-center gap-4 md:border-r border-black dark:border-white'>
          <h1 className='text-3xl sm:text-5xl font-black font-clash sm:w-72 text-center'>Your virtual wardrobe</h1>

          <div className='w-72 gap-4 flex flex-col mb-20'>
            <Button onClick={handleDiscord} iconRight={<PiDiscordLogo />}>Continue with Discord</Button>
            <Button onClick={handleGoogle} iconRight={<PiGoogleLogo />}>Continue with Google</Button>
          </div>
          <p className='bottom-0 fixed p-10 text-sm text-center w-96'>By signing up, you agree to our <span><Link href={'/docs/terms-of-service'} className='font-bold underline'>Terms of Service</Link></span> and <span><Link href={'/docs/privacy-policy'} className='font-bold underline'>Privacy Policy</Link></span>.</p>
        </div>
        <div className='h-full shrink-0 grow hidden overflow-hidden flex-col md:flex'>

          {isLoading && <>
            <div className='flex gap-8 -mt-72'>
              <PostSkeleton className='rotate-12 mt-12' />
              <PostSkeleton className='rotate-12 mt-24' />
              <PostSkeleton className='rotate-12 mt-36' />
              <PostSkeleton className='rotate-12 mt-48' />
              <PostSkeleton className='rotate-12 mt-60' />
              <PostSkeleton className='rotate-12 mt-72' />
              <PostSkeleton className='rotate-12 mt-[336px]' />
              <PostSkeleton className='rotate-12 mt-[384px]' />
            </div>

            <div className='flex gap-8 -mt-[336px]'>
              <PostSkeleton className='rotate-12 mt-12' />
              <PostSkeleton className='rotate-12 mt-24' />
              <PostSkeleton className='rotate-12 mt-36' />
              <PostSkeleton className='rotate-12 mt-48' />
              <PostSkeleton className='rotate-12 mt-60' />
              <PostSkeleton className='rotate-12 mt-72' />
              <PostSkeleton className='rotate-12 mt-[336px]' />
              <PostSkeleton className='rotate-12 mt-[384px]' />
            </div>

            <div className='flex gap-8 -mt-[336px]'>
              <PostSkeleton className='rotate-12 mt-12' />
              <PostSkeleton className='rotate-12 mt-24' />
              <PostSkeleton className='rotate-12 mt-36' />
              <PostSkeleton className='rotate-12 mt-48' />
              <PostSkeleton className='rotate-12 mt-60' />
              <PostSkeleton className='rotate-12 mt-72' />
              <PostSkeleton className='rotate-12 mt-[336px]' />
              <PostSkeleton className='rotate-12 mt-[384px]' />
            </div>

            <div className='flex gap-8 -mt-[336px]'>
              <PostSkeleton className='rotate-12 mt-12' />
              <PostSkeleton className='rotate-12 mt-24' />
              <PostSkeleton className='rotate-12 mt-36' />
              <PostSkeleton className='rotate-12 mt-48' />
              <PostSkeleton className='rotate-12 mt-60' />
              <PostSkeleton className='rotate-12 mt-72' />
              <PostSkeleton className='rotate-12 mt-[336px]' />
              <PostSkeleton className='rotate-12 mt-[384px]' />
            </div>
          </>}


          <div className='flex gap-8 -mt-72'>
            {posts && posts.slice(0, 7).map((post, i) =>
              <Link style={{ marginTop: `${48 * i}px` }} href={`/discover/?postId=${post.id}`} key={post.id} className={`w-44 h-72 rotate-12 min-w-[176px] border border-gray-500 rounded-md relative`}>
                <Image
                  // 176px is the same as w-44, the width of the container
                  sizes="176px"
                  src={formatImage(post.image, post.user.id)}
                  className="object-cover"
                  fill
                  alt={post.type}
                  priority
                />

                <div className='flex flex-col justify-end items-center p-2 absolute inset-0 bg-gradient-to-b from-transparent to-black w-full h-full bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100'>
                  <div className='flex gap-2 w-full'>
                    <Image className='rounded-full object-contain' src={formatAvatar(post.user.image, post.user.id)} alt={post.user.username ?? ""} width={30} height={30} />

                    <h1 className='text-white flex gap-1 items-center text-sm w-full'>
                      <span className='truncate'>{post.user.username}</span>
                      {post.user.admin ? <PiHammer className='w-4 h-4' /> : post.user.verified && <PiSealCheck className='w-4 h-4' />}
                    </h1>
                  </div>
                </div>

              </Link>
            )}
          </div>

          <div className='flex gap-8 -mt-60'>
            {posts && posts.slice(8, 15).map((post, i) =>
              <Link style={{ marginTop: `${48 * i}px` }} href={`/discover/?postId=${post.id}`} key={post.id} className={`w-44 h-72 rotate-12 min-w-[176px] border border-gray-500 rounded-md relative mt-[${48 * i}px]`}>
                <Image
                  // 176px is the same as w-44, the width of the container
                  sizes="176px"
                  src={formatImage(post.image, post.user.id)}
                  className="object-cover"
                  fill
                  alt={post.type}
                  priority
                />

                <div className='flex flex-col justify-end items-center p-2 absolute inset-0 bg-gradient-to-b from-transparent to-black w-full h-full bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100'>
                  <div className='flex gap-2 w-full'>
                    <Image className='rounded-full object-contain' src={formatAvatar(post.user.image, post.user.id)} alt={post.user.username ?? ""} width={30} height={30} />

                    <h1 className='text-white flex gap-1 items-center text-sm w-full'>
                      <span className='truncate'>{post.user.username}</span>
                      {post.user.admin ? <PiHammer className='w-4 h-4' /> : post.user.verified && <PiSealCheck className='w-4 h-4' />}
                    </h1>
                  </div>
                </div>

              </Link>
            )}
          </div>

          <div className='flex gap-8 -mt-60'>
            {posts && posts.slice(16, 23).map((post, i) =>
              <Link style={{ marginTop: `${48 * i}px` }} href={`/discover/?postId=${post.id}`} key={post.id} className={`w-44 h-72 rotate-12 min-w-[176px] border border-gray-500 rounded-md relative mt-[${48 * i}px]`}>
                <Image
                  // 176px is the same as w-44, the width of the container
                  sizes="176px"
                  src={formatImage(post.image, post.user.id)}
                  className="object-cover"
                  fill
                  alt={post.type}
                  priority
                />

                <div className='flex flex-col justify-end items-center p-2 absolute inset-0 bg-gradient-to-b from-transparent to-black w-full h-full bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100'>
                  <div className='flex gap-2 w-full'>
                    <Image className='rounded-full object-contain' src={formatAvatar(post.user.image, post.user.id)} alt={post.user.username ?? ""} width={30} height={30} />

                    <h1 className='text-white flex gap-1 items-center text-sm w-full'>
                      <span className='truncate'>{post.user.username}</span>
                      {post.user.admin ? <PiHammer className='w-4 h-4' /> : post.user.verified && <PiSealCheck className='w-4 h-4' />}
                    </h1>
                  </div>
                </div>

              </Link>
            )}
          </div>

          <div className='flex gap-8 -mt-60'>
            {posts && posts.slice(24, 31).map((post, i) =>
              <Link style={{ marginTop: `${48 * i}px` }} href={`/discover/?postId=${post.id}`} key={post.id} className={`w-44 h-72 rotate-12 min-w-[176px] border border-gray-500 rounded-md relative mt-[${48 * i}px]`}>
                <Image
                  // 176px is the same as w-44, the width of the container
                  sizes="176px"
                  src={formatImage(post.image, post.user.id)}
                  className="object-cover"
                  fill
                  alt={post.type}
                  priority
                />

                <div className='flex flex-col justify-end items-center p-2 absolute inset-0 bg-gradient-to-b from-transparent to-black w-full h-full bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100'>
                  <div className='flex gap-2 w-full'>
                    <Image className='rounded-full object-contain' src={formatAvatar(post.user.image, post.user.id)} alt={post.user.username ?? ""} width={30} height={30} />

                    <h1 className='text-white flex gap-1 items-center text-sm w-full'>
                      <span className='truncate'>{post.user.username}</span>
                      {post.user.admin ? <PiHammer className='w-4 h-4' /> : post.user.verified && <PiSealCheck className='w-4 h-4' />}
                    </h1>
                  </div>
                </div>

              </Link>
            )}
          </div>
        </div>
      </div>

    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (session?.user) {
    return {
      redirect: {
        destination: `/${session.user.username}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default LoginPage;