import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '~/components/Button';
import { Layout } from '~/components/Layout';
import { api } from '~/utils/api.util';
import { formatAvatar, formatImage } from '~/utils/image-src-format.util';

import { DiscordLogo, GoogleLogo, Hammer, SealCheck } from '@phosphor-icons/react';

const LoginPage = () => {
  const handleGoogle = async () => {
    signIn('google', { callbackUrl: `/profile`, redirect: true });
  };

  const handleDiscord = async () => {
    signIn('discord', { callbackUrl: `/profile`, redirect: true });
  };

  const { data: posts } = api.post.getLoginPosts.useQuery(undefined, {});

  return (
    <Layout title='Login' showSlash={false} showActions={false} showSearch={false}>
      <div className='flex flex-col md:flex-row w-screen h-full'>
        <div className='h-full flex w-full md:px-[90px] md:w-auto flex-col justify-center items-center gap-4 md:border-r border-black dark:border-white'>
          <h1 className='text-3xl sm:text-5xl font-black font-urbanist sm:w-72'>Your virtual wardrobe</h1>

          <div className='w-72 gap-4 flex flex-col mb-20'>
            <Button onClick={handleDiscord} iconRight={<DiscordLogo />}>Continue with Discord</Button>
            <Button onClick={handleGoogle} iconRight={<GoogleLogo />}>Continue with Google</Button>
          </div>
          <p className='bottom-0 fixed p-10 text-sm text-center w-96'>By signing up, you agree to our <span><Link href={'/docs/terms-of-service'} className='font-bold underline'>Terms of Service</Link></span> and <span><Link href={'/docs/privacy-policy'} className='font-bold underline'>Privacy Policy</Link></span>.</p>
        </div>
        <div className='h-full shrink-0 grow hidden overflow-hidden flex-col md:flex'>


          <div className='flex gap-8 -mt-44'>
            {posts && posts.slice(0, 7).map((post, i) =>
              <Link href={`/explore/?postId=${post.id}`} key={post.id} className={`w-44 h-72 rotate-12 min-w-[176px] border border-gray-500 rounded-md relative mt-${12 * i}`}>
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
                      {post.user.admin ? <Hammer className='w-4 h-4' /> : post.user.verified && <SealCheck className='w-4 h-4' />}
                    </h1>
                  </div>
                </div>

              </Link>
            )}
          </div>

          <div className='flex gap-8 -mt-40'>
            {posts && posts.slice(8, 14).map((post, i) =>
              <Link href={`/explore/?postId=${post.id}`} key={post.id} className={`w-44 h-72 rotate-12 min-w-[176px] border border-gray-500 rounded-md relative mt-${12 * i}`}>
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
                      {post.user.admin ? <Hammer className='w-4 h-4' /> : post.user.verified && <SealCheck className='w-4 h-4' />}
                    </h1>
                  </div>
                </div>

              </Link>
            )}
          </div>

          <div className='flex gap-8 -mt-40'>
            {posts && posts.slice(15, 21).map((post, i) =>
              <Link href={`/explore/?postId=${post.id}`} key={post.id} className={`w-44 h-72 rotate-12 min-w-[176px] border border-gray-500 rounded-md relative mt-${12 * i}`}>
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
                      {post.user.admin ? <Hammer className='w-4 h-4' /> : post.user.verified && <SealCheck className='w-4 h-4' />}
                    </h1>
                  </div>
                </div>

              </Link>
            )}
          </div>

          <div className='flex gap-8 -mt-40'>
            {posts && posts.slice(22, 24).map((post, i) =>
              <Link href={`/explore/?postId=${post.id}`} key={post.id} className={`w-44 h-72 rotate-12 min-w-[176px] border border-gray-500 rounded-md relative mt-${12 * i}`}>
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
                      {post.user.admin ? <Hammer className='w-4 h-4' /> : post.user.verified && <SealCheck className='w-4 h-4' />}
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

export default LoginPage;