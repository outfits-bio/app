import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { AppRouter } from '~/server/api/root';
import { formatAvatar } from '~/utils/image-src-format.util';

import { Hoodie, Pants, Person, Share, Sneaker, TShirt, Watch } from '@phosphor-icons/react';
import { inferRouterOutputs } from '@trpc/server';

import { Button } from './Button';

type RouterOutput = inferRouterOutputs<AppRouter>;

interface Props {
    profileData?: RouterOutput['user']['getProfile'];
    username: string;
    isCurrentUser: boolean;
}

export const ProfileCard = ({ profileData, username, isCurrentUser }: Props) => {
    const { asPath } = useRouter();

    const origin =
        typeof window !== 'undefined' && window.location.origin
            ? window.location.origin
            : '';

    const userUrl = `${origin}${asPath}`;

    const handleShare = () => {
        navigator.clipboard.writeText(userUrl);

        toast.success('Copied profile link to clipboard!');
    }

    return (
        <div className="flex flex-col md:flex-row justify-between md:items-center border border-b-slate-500 dark:border-b-slate-500 p-10 gap-10 md:gap-0 dark:border-transparent">
            <div className='flex flex-col gap-10'>
                <div className='flex items-center gap-10'>
                    <div className='relative sm:w-32 sm:h-32 w-24 h-24'>
                        <Image sizes='128px 96px' src={formatAvatar(profileData?.image, profileData?.id)} fill alt={`${username}'s profile image`} className='object-cover rounded-full' />
                    </div>

                    <div className='space-y-2'>
                        <h1 className='sm:text-4xl text-3xl font-bold'>{profileData?.name}</h1>
                        <h3 className='sm:text-xl text-lg font-bold text-slate-400'>@{profileData?.username}</h3>
                    </div>
                </div>

                <div className='flex gap-4 text-slate-400 text-xl sm:text-lg sm:flex-row flex-col'>
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
                <div className='text-xl flex gap-6'>
                    <div className='text-center'>
                        <h1 className='font-bold'>{profileData?.imageCount}</h1>
                        <h3>images</h3>
                    </div>
                </div>

                <div className='flex gap-4 text-slate-400 font-semibold'>
                    {isCurrentUser && <Link href={'/settings'}>
                        <Button>Edit Profile</Button>
                    </Link>}
                    <Button onClick={handleShare}>
                        <Share className='text-xl' />
                    </Button>
                </div>
            </div>
        </div>
    )
}