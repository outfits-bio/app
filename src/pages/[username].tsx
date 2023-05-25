import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import superjson from 'superjson';
import { Layout } from '~/components/Layout';
import { appRouter } from '~/server/api/root';
import { prisma } from '~/server/db';
import { api } from '~/utils/api';

import { Hoodie, Pants, Share, Sneaker, TShirt } from '@phosphor-icons/react';
import { createServerSideHelpers } from '@trpc/react-query/server';

export const ProfilePage = ({ username }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const { push } = useRouter();
    const { data } = useSession();

    const { data: profileData } = api.user.getProfile.useQuery({ username }, { onError: () => push('/') });

    const isCurrentUser = data && data.user.username === username;

    const pageTitle = isCurrentUser ? `profile` : username ?? 'profile';

    return (
        <Layout title={pageTitle}>
            <div className="flex flex-col md:flex-row justify-between md:items-center border border-b-gray-500 p-10 gap-10 md:gap-0">
                <div className='flex flex-col gap-10'>
                    <div className='flex items-center gap-10'>
                        <div className='relative w-32 h-32'>
                            <Image src="/avatar.webp" fill alt={`${username}'s profile image`} className='object-cover rounded-full' />
                        </div>

                        <div className='space-y-4'>
                            <h1 className='text-5xl font-bold'>{profileData?.name}</h1>
                            <h3 className='text-2xl font-bold text-gray-400'>@{profileData?.username}</h3>
                        </div>
                    </div>

                    <div className='flex gap-4 text-gray-400 text-xl'>
                        <div className='flex items-center gap-1'>
                            <Hoodie className='mt-1' />
                            <span>12</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <TShirt className='mt-1' />
                            <span>21</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <Pants className='mt-1' />
                            <span>14</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <Sneaker className='mt-1' />
                            <span>5</span>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col gap-10 md:items-end'>
                    <div className='text-2xl flex gap-6'>
                        <div className='text-center'>
                            <h1 className='font-bold'>54</h1>
                            <h3>images</h3>
                        </div>

                        <div className='text-center'>
                            <h1 className='font-bold'>1.2k+</h1>
                            <h3>likes</h3>
                        </div>
                    </div>

                    <div className='flex gap-4 text-gray-400 font-semibold'>
                        {isCurrentUser && <Link href={'/settings'} className='border border-gray-400 px-6 h-10 rounded-sm flex items-center justify-center'>Edit Profile</Link>}
                        <button className='border border-gray-400 px-6 h-10 rounded-sm text-xl'>
                            <Share />
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export const getServerSideProps = async (context: GetServerSidePropsContext<{ username: string }>,
) => {
    const helpers = createServerSideHelpers({
        router: appRouter,
        ctx: { prisma, session: null },
        transformer: superjson, // optional - adds superjson serialization
    });


    const username = context.params?.username?.toString() ?? '';

    const userExists = await helpers.user.getProfile.fetch({ username });

    if (userExists) {
        await helpers.user.getProfile.prefetch({ username });
    } else {
        return {
            notFound: true,
            props: {
                username
            }
        };
    }

    return {
        props: {
            trpcState: helpers.dehydrate(),
            username
        }
    };
}

export default ProfilePage;