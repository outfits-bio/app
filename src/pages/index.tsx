import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { PiBackpackBold, PiBaseballCapBold, PiCoatHangerBold, PiDotsThreeBold, PiEyeglassesBold, PiHammer, PiHeartBold, PiHeartFill, PiLinkSimpleBold, PiPantsBold, PiSealCheck, PiShirtFoldedBold, PiShoppingBagOpenBold, PiSneakerBold, PiTShirtBold, PiWatchBold } from 'react-icons/pi';
import { Button } from '~/components/Button';
import { Layout } from '~/components/Layout';


import { Logo } from '~/components/Logo';
import { PostSkeleton } from '~/components/Skeletons/PostSkeleton';
import { api } from '~/utils/api.util';
import { formatAvatar, formatImage } from '~/utils/image-src-format.util';
import landing from '../../public/landing.png';

const Home = () => {
  const { status, data } = useSession();
  const { push } = useRouter();

  const [likeAnimation, setLikeAnimation] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [color, setColor] = useState('orange-accent');

  const { data: posts, isLoading: postsLoading } = api.post.getTwoRandomPosts.useQuery(undefined, {
    refetchInterval: 15000,
  });

  useEffect(() => {
    if (status === 'authenticated') {
      push(`/${data.user.username}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <Layout title='outfits.bio' showSlash={false}>
      <section className='w-full h-screen flex flex-col items-center -mt-20 pt-24 border-b border-stroke gap-24 overflow-hidden'>
        <div className='relative px-44 py-28'>
          <PiCoatHangerBold className='text-6xl transition-colors duration-300 text-stroke hover:text-secondary-text absolute left-20 top-8 -rotate-12' />
          <PiPantsBold className='text-6xl transition-colors duration-300 text-stroke hover:text-secondary-text absolute left-12 top-40 rotate-12' />
          <PiSneakerBold className='text-6xl transition-colors duration-300 text-stroke hover:text-secondary-text absolute bottom-8 md:bottom-16 rotate-[30deg]' />
          <PiEyeglassesBold className='text-6xl transition-colors duration-300 text-stroke hover:text-secondary-text absolute bottom-0 left-80 -rotate-[30deg]' />
          <PiBackpackBold className='text-6xl hidden md:block transition-colors duration-300 text-stroke hover:text-secondary-text absolute bottom-0 left-[480px] -rotate-12' />
          <PiWatchBold className='text-6xl hidden md:block transition-colors duration-300 text-stroke hover:text-secondary-text absolute bottom-0 right-52 rotate-[30deg]' />
          <PiShirtFoldedBold className='text-6xl transition-colors duration-300 text-stroke hover:text-secondary-text absolute right-28 bottom-20 rotate-[30deg]' />
          <PiTShirtBold className='text-6xl transition-colors duration-300 text-stroke hover:text-secondary-text absolute right-16 top-40 -rotate-[30deg]' />
          <PiShoppingBagOpenBold className='text-6xl transition-colors duration-300 text-stroke hover:text-secondary-text absolute top-8 right-36 -rotate-12' />
          <PiBaseballCapBold className='text-6xl transition-colors duration-300 text-stroke hover:text-secondary-text absolute top-8 right-1/2 rotate-[30deg]' />

          <div className='flex flex-col gap-4 text-center'>
            <h1 className='font-clash text-4xl md:text-5xl font-bold orange-selection'>Your virtual <span className='underline-skew orange-selection'>wardrobe</span></h1>
            <article className='text-secondary-text w-[335px] md:w-[400px] orange-selection overflow-hidden relative text-center flex flex-col m-auto'>
              <p className='inline'>Your wardrobe in the cloud, share and inspire your followers through a simple link for in your</p>
              <span className='flex relative justify-center -ml-32'>
                <p className='inline'>{' '}bio like{' '}</p>
                <span className='absolute overflow-y-hidden pl-1 text-left ml-48'>
                  <Link href={'/jeremy'} className='orange-selection text-orange-accent block h-full animate-spin-words cursor-pointer hover:underline'>outfits.bio/jeremy</Link>
                  <Link href={'/brice'} className='orange-selection text-orange-accent block h-full animate-spin-words cursor-pointer hover:underline'>outfits.bio/brice</Link>
                  <Link href={'/hollxo'} className='orange-selection text-orange-accent block h-full animate-spin-words cursor-pointer hover:underline'>outfits.bio/hollxo</Link>
                  <Link href={'/asciidude'} className='orange-selection text-orange-accent block h-full animate-spin-words cursor-pointer hover:underline'>outfits.bio/asciidude</Link>
                  <Link href={'/jeremy'} className='orange-selection text-orange-accent block h-full animate-spin-words cursor-pointer hover:underline'>outfits.bio/jeremy</Link>
                </span>
              </span>
            </article>


            <div className='flex justify-center gap-3'>
              <div>
                <Link href={'/login'}>
                  <Button variant={'outline-ghost'} className='orange-selection'>Get Started</Button>
                </Link>
              </div>

              <div>
                <Link href={'#more'}>
                  <Button className='orange-selection'>
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Image src={landing} alt='Landing Image' className='w-11/12 md:w-2/3 shadow-2xl object-contain hover:-translate-y-16 transition-all duration-300' />
      </section>

      <div id='more' className='h-12 bg-white dark:bg-black' />

      <section className='flex flex-col items-center gap-12 w-full border-b border-stroke py-12 px-4 sm:px-12 lg:px-24 bg-white dark:bg-black'>
        <h1 className='text-4xl md:text-5xl font-bold font-clash text-center'>Your wardrobe, <span className='text-orange-accent'>electrified</span></h1>

        <div className='border border-stroke rounded-xl w-full py-12 flex flex-col px-4 md:px-12 gap-12 md:flex-row md:justify-between xl:w-3/4'>
          <div className='sm:w-96 md:w-[500px]'>
            <h2 className='font-bold text-3xl md:text-4xl font-clash mb-4'>Socialize through fashion</h2>
            <p className='mb-4'>Besides sharing your wardrobe you can also follow other people or like individual items to get recommended similar people or clothes you like.  </p>
            <div className='flex'>
              <Link href={'/login'}>
                <Button variant={'outline-ghost'}>Create your profile</Button>
              </Link>
            </div>
          </div>

          <div className='flex flex-col items-end gap-2 md:w-[500px]'>
            <div className='rounded-full h-24 w-24 bg-hover border border-stroke relative overflow-hidden'>
              {/* checkered pattern */}
              <Image src={'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'} alt='' fill />
            </div>

            <h3 className='font-clash text-2xl font-bold'>Username</h3>

            <span className='inline text-sm'>
              <PiHeartBold className='text-lg mb-1 inline mr-1' />
              <span className='inline font-bold'>{hasLiked ? '10 ' : '9 '}</span>
              <span className='inline'>Likes</span>
            </span>

            <div className='w-5/6 flex gap-2'>
              <div className='relative w-6 h-6 shrink-0'>
                <Image src={'https://upload.wikimedia.org/wikipedia/en/7/70/Graduation_%28album%29.jpg'} alt={''} fill className='rounded-md' />
              </div>
              <Marquee pauseOnHover autoFill speed={40} className='cursor-pointer select-none'>
                <p className='text-sm mx-4'>Listening to <span className='font-bold'>Can&apos;t Tell Me Nothing</span> by <span className='font-bold'>Kanye West</span></p>
              </Marquee>
            </div>

            <div className='flex gap-2 w-5/6 mt-2'>
              <div className='grow'>
                <Button
                  accent
                  centerItems
                  onClick={() => {
                    setLikeAnimation(true);
                    setHasLiked(!hasLiked);
                  }}
                  iconLeft={

                    hasLiked ? (
                      <PiHeartFill
                        onAnimationEnd={() => setLikeAnimation(false)}
                        className={likeAnimation ? 'animate-ping text-white dark:text-black' : ''}
                      />
                    ) : (
                      <PiHeartBold
                        onAnimationEnd={() => setLikeAnimation(false)}
                        className={likeAnimation ? 'animate-ping text-white dark:text-black' : ''}
                      />
                    )}
                >
                  Like{hasLiked ? 'd' : ''}
                </Button>
              </div>
              <div>
                <Button variant={'outline'} iconLeft={<PiDotsThreeBold />} shape={'square'} />
              </div>
            </div>
          </div>
        </div>

        <div className='border border-stroke rounded-xl w-full flex flex-col gap-12 md:flex-row md:justify-between xl:w-3/4'>
          <div className='px-4 md:px-12 pt-12 sm:w-96 md:w-[500px]'>
            <h2 className='font-bold text-3xl md:text-4xl font-clash mb-4'>Discover trendy style</h2>
            <p className='mb-4'>Our discover page offers various styles powered by our users who are actively posting their OOTDs shaping a variety of outfits and clothes on our platform</p>
            <div className='flex gap-2'>
              <div className='flex'>
                <Link href={'/discover'}>
                  <Button>Discover</Button>
                </Link>
              </div>

              <div className='flex'>
                <Link href={'/login'}>
                  <Button variant={'outline-ghost'}>Sign Up</Button>
                </Link>
              </div>
            </div>
          </div>

          <div>
            <div className='shrink-0 grow overflow-hidden flex-col lg:flex'>
              <div className='flex gap-8 mb-0'>
                {postsLoading ? <>
                  <PostSkeleton className='rotate-12 mt-4' />
                  <PostSkeleton className='rotate-12 mt-16' />
                </> : posts?.map((post, i) => (
                  <Link style={{ marginTop: i === 0 ? '16px' : '64px' }} href={`/discover/?postId=${post.id}`} key={post.id} className={`w-44 h-72 rotate-12 min-w-[176px] border border-gray-500 rounded-md relative`}>
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
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className='border border-stroke rounded-xl w-full py-12 flex flex-col px-4 md:px-12 gap-12 md:flex-row md:justify-between xl:w-3/4'>
          <div className='sm:w-96 md:w-[500px]'>
            <h2 className='font-bold text-3xl md:text-4xl font-clash mb-4'>Creator-friendly</h2>
            <p className='mb-4'>We offer free outfits.bio/”username” links for everyone who signs up which makes it very easy to plug your wardrobe in a link-in-bio format.</p>
            <div className='flex'>
              <Link href={'/login'}>
                <Button variant={'outline-ghost'}>Create your unique link</Button>
              </Link>
            </div>
          </div>

          <div className='relative flex md:justify-end overflow-y-hidden m-auto h-8 max-h-8 w-full md:w-72 text-2xl shrink-0 md:basis-72'>
            <span className='absolute overflow-y-hidden'>
              <Link href={'/jeremy'} className='animate-spin-words block h-full cursor-pointer hover:underline text-secondary-text text-clash font-semibold'>
                <span className='flex items-center'>
                  <PiLinkSimpleBold className='text-2xl inline mr-1' />
                  <p className='inline'>outfits.bio/jeremy</p>
                </span>
              </Link>
              <Link href={'/brice'} className='animate-spin-words block h-full cursor-pointer hover:underline text-secondary-text text-clash font-semibold'>
                <span className='flex items-center'>
                  <PiLinkSimpleBold className='text-2xl inline mr-1' />
                  <p className='inline'>outfits.bio/brice</p>
                </span>
              </Link>
              <Link href={'/hollxo'} className='animate-spin-words block h-full cursor-pointer hover:underline text-secondary-text text-clash font-semibold'>
                <span className='flex items-center'>
                  <PiLinkSimpleBold className='text-2xl inline mr-1' />
                  <p className='inline'>outfits.bio/hollxo</p>
                </span>
              </Link>
              <Link href={'/asciidude'} className='animate-spin-words block h-full cursor-pointer hover:underline text-secondary-text text-clash font-semibold'>
                <span className='flex items-center'>
                  <PiLinkSimpleBold className='text-2xl inline mr-1' />
                  <p className='inline'>outfits.bio/asciidude</p>
                </span>
              </Link>
              <Link href={'/jeremy'} className='animate-spin-words block h-full cursor-pointer hover:underline text-secondary-text text-clash font-semibold'>
                <span className='flex items-center'>
                  <PiLinkSimpleBold className='text-2xl inline mr-1' />
                  <p className='inline'>outfits.bio/jeremy</p>
                </span>
              </Link>
            </span>
          </div>
        </div>

        <div className='flex flex-col gap-12 2xl:flex-row xl:w-3/4'>
          <div className='border border-stroke rounded-xl w-full py-12 flex flex-col px-4 '>
            <h2 className='font-bold text-3xl md:text-4xl font-clash mb-4'>Spotify Plugin</h2>
            <p className='mb-4'>We use <Link href={'https://github.com/Phineas/lanyard'} className='underline'>Lanyard</Link> to power our Spotify Status feature. To use Lanyard, you must join their Discord Server using the Discord account that&apos;s connected to outfits.bio.</p>
            <div className='flex'>
              <Link href={'/login'}>
                <Button variant={'outline-ghost'}>Register with Discord</Button>
              </Link>
            </div>
          </div>

          <div className='border border-stroke rounded-xl w-full py-12 flex flex-col px-4 '>
            <h2 className='font-bold text-3xl md:text-4xl font-clash mb-4'>Personalization</h2>
            <p className='mb-4'>We offer a variety of themes and accent colors try them below:</p>

            <div className='flex gap-2 mb-4'>
              <button className={`w-6 h-6 rounded-full bg-orange-accent ${color === 'orange-accent' && 'border border-stroke'}`} onClick={() => setColor('orange-accent')} />
              <button className={`w-6 h-6 rounded-full bg-hot-pink-accent ${color === 'hot-pink-accent' && 'border border-stroke'}`} onClick={() => setColor('hot-pink-accent')} />
              <button className={`w-6 h-6 rounded-full bg-brown-accent ${color === 'brown-accent' && 'border border-stroke'}`} onClick={() => setColor('brown-accent')} />
              <button className={`w-6 h-6 rounded-full bg-light-pink-accent ${color === 'light-pink-accent' && 'border border-stroke'}`} onClick={() => setColor('light-pink-accent')} />
              <button className={`w-6 h-6 rounded-full bg-accent ${color === 'accent' && 'border border-stroke'}`} onClick={() => setColor('accent')} />
            </div>

            <div className='flex'>
              <Link href={'/login'}>
                <Button variant={'outline-ghost'} className={`bg-${color} text-white ${color === 'accent' && 'dark:text-black'}`}>Try it Today</Button>
              </Link>
            </div>
          </div>

          <div className='border border-stroke rounded-xl w-full py-12 flex flex-col px-4 '>
            <h2 className='font-bold text-3xl md:text-4xl font-clash mb-4'>Verified Program</h2>
            <p className='mb-4'>Our verified plan is available for everyone for a small fee but will be given to any relatively known creator on other social media platforms setting up their simple virtual wardrobe often these people are recruited by outfits.</p>
            <div className='flex'>
              <Link href={'/login'}>
                <Button variant={'outline-ghost'}>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className='flex justify-center items-center w-screen py-12'>
        <div className='flex flex-col w-full md:flex-row md:justify-between gap-12 xl:w-3/4 px-12'>
          <div className='flex flex-col'>
            <h1 className='text-3xl font-black font-clash flex items-center gap-2 mb-2'><Logo /> outfits.bio</h1>
            <p className='text-[11px] text-secondary-text'>You make the look, we&apos;ll make the link!</p>
            <p className='text-[11px] text-secondary-text'>Copyright © 2023, All Rights Reserved.</p>
          </div>

          <div className='grid gap-8 lg:gap-20 xl:gap-32 grid-cols-1 sm:grid-cols-3'>
            <div className='flex flex-col gap-1 text-secondary-text'>
              <h3 className='font-bold text-gray-500'>Explore</h3>
              <Link href='/discover' className='text-sm'>Discover</Link>
              <Link href='/discover' className='text-sm'>Blog</Link>
            </div>

            <div className='flex flex-col gap-1 text-secondary-text'>
              <h3 className='font-bold text-gray-500'>Socials</h3>
              <Link href='https://twitter.com/linkyouroutfits' className='text-sm'>X (formerly Twitter)</Link>
              <Link href='https://discord.gg/f4KEs5TVz2' className='text-sm'>Discord</Link>
              <Link href='https://www.producthunt.com/posts/outfits-bio' className='text-sm'>Product Hunt</Link>
            </div>

            <div className='flex flex-col gap-1 text-secondary-text'>
              <h3 className='font-bold text-gray-500'>Legal</h3>
              <Link href='/docs/privacy-policy' className='text-sm'>Privacy Policy</Link>
              <Link href='/docs/terms-of-service' className='text-sm'>Terms of Service</Link>
              <Link href='/docs/brand-guide' className='text-sm'>Brand Guide</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
