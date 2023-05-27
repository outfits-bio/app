import Image from 'next/image';
import Link from 'next/link';
import { AppRouter } from '~/server/api/root';

import { Hoodie, Pants, Person, Share, Sneaker, TShirt, Watch } from '@phosphor-icons/react';
import { inferRouterOutputs } from '@trpc/server';

type RouterOutput = inferRouterOutputs<AppRouter>;

interface Props {
    profileData?: RouterOutput['user']['getProfile'];
    username: string;
    isCurrentUser: boolean;
}

export const ProfileCard = ({ profileData, username, isCurrentUser }: Props) => {
    return (
        <div className="flex flex-col md:flex-row justify-between md:items-center border border-b-gray-500 p-10 gap-10 md:gap-0">
            <div className='flex flex-col gap-10'>
                <div className='flex items-center gap-10'>
                    <div className='relative sm:w-32 sm:h-32 w-24 h-24'>
                        <Image sizes='128px 96px' src={profileData?.image?.startsWith('https://') ? profileData.image : `https://pub-4bf8804d3efc464b862de36f974618d4.r2.dev/${profileData?.id}/${profileData?.image}.png`} fill alt={`${username}'s profile image`} className='object-cover rounded-full' />
                    </div>

                    <div className='space-y-4'>
                        <h1 className='sm:text-5xl text-4xl font-bold'>{profileData?.name}</h1>
                        <h3 className='sm:text-2xl text-xl font-bold text-gray-400'>@{profileData?.username}</h3>
                    </div>
                </div>

                <div className='flex gap-4 text-gray-400 text-2xl sm:text-xl sm:flex-row flex-col'>
                    <div className='flex gap-4'>
                        <div className='flex items-center gap-1'>
                            <Person className='mt-1' />
                            <span>{profileData?.outfitPostCount}</span>
                        </div>

                        <div className='flex items-center gap-1'>
                            <Hoodie className='mt-1' />
                            <span>{profileData?.hoodiePostCount}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <TShirt className='mt-1' />
                            <span>{profileData?.shirtPostCount}</span>
                        </div>
                    </div>

                    <div className='flex gap-4'>
                        <div className='flex items-center gap-1'>
                            <Pants className='mt-1' />
                            <span>{profileData?.pantsPostCount}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <Sneaker className='mt-1' />
                            <span>{profileData?.shoesPostCount}</span>
                        </div>

                        <div className='flex items-center gap-1'>
                            <Watch className='mt-1' />
                            <span>{profileData?.watchPostCount}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-10 md:items-end'>
                <div className='text-2xl flex gap-6'>
                    <div className='text-center'>
                        <h1 className='font-bold'>{profileData?.imageCount}</h1>
                        <h3>images</h3>
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
    )
}