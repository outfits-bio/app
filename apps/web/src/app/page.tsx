import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { formatAvatar, formatImage } from "@/utils/image-src-format.util";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PiBackpackBold, PiBaseballCapBold, PiCoatHangerBold, PiEyeglassesBold, PiHammer, PiLinkSimpleBold, PiPantsBold, PiSealCheck, PiShirtFoldedBold, PiShoppingBagOpenBold, PiSneakerBold, PiTShirtBold, PiWatchBold } from "react-icons/pi";
import landing from "../../public/landing.png";
import { PersonalizationSection } from "./_components/landing/personalization-section";
import { SocialSection } from "./_components/landing/social-secion";
import { Button } from "./_components/ui/Button";
import { Footer } from "./_components/landing/footer";

export default async function Home() {
  const session = await getServerAuthSession();
  const posts = await api.post.getTwoRandomPosts.query();

  if (session && session.user) {
    redirect(`/${session.user.username}`);
  }

  return (
    <>
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

        <SocialSection />

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
                {posts.map((post, i) => (
                  <Link style={{ marginTop: i === 0 ? '16px' : '64px' }} href={`/discover/?postId=${post.id}`} key={post.id} className={`w-44 h-72 rotate-12 min-w-[176px] border border-stroke rounded-xl relative`}>
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

          <PersonalizationSection />

          {/* <div className='border border-stroke rounded-xl w-full py-12 flex flex-col px-4 '>
            <h2 className='font-bold text-3xl md:text-4xl font-clash mb-4'>Verified Program</h2>
            <p className='mb-4'>Our verified plan is available for everyone for a small fee but will be given to any relatively known creator on other social media platforms setting up their simple virtual wardrobe often these people are recruited by outfits.</p>
            <div className='flex'>
              <Link href={'/login'}>
                <Button variant={'outline-ghost'}>Sign Up</Button>
              </Link>
            </div>
          </div> */}
        </div>
      </section>

      <Footer />
    </>
  );
}