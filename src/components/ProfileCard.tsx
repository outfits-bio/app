import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { api } from '~/utils/api.util';
import { handleErrors } from '~/utils/handle-errors.util';
import { formatAvatar } from '~/utils/image-src-format.util';

import {
    Camera, DiscordLogo, DotsThree, Heart, InstagramLogo, LinkSimple, PencilSimple, ShareFat,
    TiktokLogo, TwitterLogo, YoutubeLogo
} from '@phosphor-icons/react';
import { inferRouterOutputs } from '@trpc/server';

import { Button } from './Button';

import type { AppRouter } from '~/server/api/root';
import type { User } from 'next-auth';

type RouterOutput = inferRouterOutputs<AppRouter>;

interface Props {
    profileData?: RouterOutput['user']['getProfile'];
    username: string;
    isCurrentUser: boolean;
    currentUser: User | null;
    authStatus: ReturnType<typeof useSession>['status'];
    loading: boolean;
}

export const ProfileCard = ({ profileData, username, isCurrentUser, currentUser, authStatus, loading }: Props) => {
    const { asPath, push } = useRouter();
    const ctx = api.useContext();

    const [likeAnimation, setLikeAnimation] = useState(false);

    const { mutate, isLoading } = api.user.likeProfile.useMutation({
        onMutate: async () => {
            await ctx.user.getProfile.cancel({ username });

            const previousProfileData = ctx.user.getProfile.getData({ username });

            if (!previousProfileData) return;

            ctx.user.getProfile.setData({ username }, {
                ...previousProfileData,
                authUserHasLiked: !previousProfileData.authUserHasLiked,
                likeCount: previousProfileData.likeCount + (previousProfileData.authUserHasLiked ? -1 : 1)
            });

            return previousProfileData;
        },
        onSettled: () => {
            ctx.user.getProfile.invalidate({ username });
        },
        onError: (e) => handleErrors({
            e, message: "Could not like!", fn: () => {
                if (!profileData) return;
                ctx.user.getProfile.setData({ username }, { ...profileData, authUserHasLiked: !profileData.authUserHasLiked })
            }
        }),
    })

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
        <div className="h-full flex flex-col justify-between font-inter">
            <div className='md:w-96 w-full flex flex-col gap-4'>
                <div className='flex md:flex-col gap-4 md:justify-normal'>
                    <div className={`object-contain w-32 h-32 md:w-96 md:h-96 relative ${loading && ' skeleton'}`}>
                        <Image priority src={formatAvatar(profileData?.image, profileData?.id)} alt={profileData?.username ?? ''} fill className='rounded-full' />
                    </div>

                    <div className='flex flex-col gap-1 md:gap-4'>
                        <h1 className='font-black text-2xl md:text-4xl font-urbanist'>{username}</h1>

                        <p className={`grow ${loading && 'skeleton'}`}>{profileData?.tagline}</p>

                        <div className='flex gap-4 text-sm md:text-base'>
                            <p className={`flex items-center gap-1`}>
                                <Camera className='w-5 h-5' />
                                <span className={loading ? 'skeleton' : ''}>{profileData?.imageCount} Shot{profileData?.imageCount !== 1 ? 's' : ''}</span>
                            </p>

                            <p className='flex items-center gap-1'>
                                <Heart className='w-5 h-5' />
                                <span className={loading ? 'skeleton' : ''}>{profileData?.likeCount} Like{profileData?.likeCount !== 1 ? 's' : ''}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className={`flex text-sm gap-2 w-96 flex-wrap`}>
                    {profileData?.twitter && <Link href={`https://twitter.com/${profileData?.twitter}`}>
                        <p className='flex items-center gap-1'>
                            <TwitterLogo className='w-5 h-5' />
                            <span className='underline'>https://twitter.com/{profileData?.twitter}</span>
                        </p>
                    </Link>}

                    {profileData?.youtube && <Link href={`https://youtube.com/@${profileData?.youtube}`}>
                        <p className='flex items-center gap-1'>
                            <YoutubeLogo className='w-5 h-5' />
                            <span className='underline'>https://youtube.com/@{profileData?.youtube}</span>
                        </p>
                    </Link>}

                    {profileData?.tiktok && <Link href={`https://tiktok.com/@${profileData?.tiktok}`}>
                        <p className='flex items-center gap-1'>
                            <TiktokLogo className='w-5 h-5' />
                            <span className='underline'>https://tiktok.com/@{profileData?.tiktok}</span>
                        </p>
                    </Link>}

                    {profileData?.discord && <Link href={`https://discord.gg/${profileData?.discord}`}>
                        <p className='flex items-center gap-1'>
                            <DiscordLogo className='w-5 h-5' />
                            <span className='underline'>https://discord.gg/{profileData?.discord}</span>
                        </p>
                    </Link>}

                    {profileData?.instagram && <Link href={`https://instagram.com/@${profileData?.instagram}`}>
                        <p className='flex items-center gap-1'>
                            <InstagramLogo className='w-5 h-5' />
                            <span className='underline'>https://instagram.com/@{profileData?.instagram}</span>
                        </p>
                    </Link>}

                    {profileData?.website && <Link href={profileData?.website ?? ''}>
                        <p className='flex items-center gap-1'>
                            <LinkSimple className='w-5 h-5' />
                            <span className='underline'>{profileData?.website}</span>
                        </p>
                    </Link>}
                </div>

                <div className='w-full flex items-center justify-between gap-4'>
                    {!isCurrentUser && <>
                        <div className='grow'>
                            <Button
                                centerItems
                                onClick={() => {
                                    if (authStatus !== 'authenticated') {
                                        push('/login');
                                        return;
                                    }

                                    setLikeAnimation(true);
                                    if (profileData?.id) mutate({ id: profileData.id });
                                }}
                                iconLeft={
                                    <Heart
                                        weight={(profileData?.authUserHasLiked) ? 'fill' : 'regular'}
                                        onAnimationEnd={() => setLikeAnimation(false)}
                                        className={likeAnimation ? 'animate-ping ' : '' + (profileData?.authUserHasLiked ? 'text-red-700' : 'text-white dark:text-black')}
                                    />
                                }
                                disabled={loading || isLoading}
                            >
                                Like{(profileData?.authUserHasLiked) ? 'd' : ''}
                            </Button>
                        </div>

                        <div>
                            <Button color='outline' iconLeft={<DotsThree />} centerItems />
                        </div>
                    </>}

                    {isCurrentUser && <>
                        <Link href='/settings/profile' className='grow'>
                            <Button color='outline' iconLeft={<PencilSimple />} centerItems>
                                Edit
                            </Button>
                        </Link>

                        <div className='grow'>
                            <Button color='outline' iconLeft={<ShareFat />} centerItems onClick={handleShare}>
                                Share
                            </Button>
                        </div>
                    </>}
                </div>
            </div>

            <div className='md:w-96 w-full hidden md:flex items-center gap-4'>
                {authStatus === 'authenticated' && currentUser && <>
                    <Link href={`/${currentUser.username}`}>
                        <Button color='outline'>
                            <Image className='rounded-full object-contain' src={formatAvatar(currentUser.image, currentUser.id)} alt={currentUser.username ?? ""} width={24} height={24} />

                            <p className='font-semibold'>{currentUser.username}</p>
                        </Button>
                    </Link>

                    <div>
                        <Button color='ghost' onClick={handleShare} iconLeft={<ShareFat />} centerItems />
                    </div>

                    <Link href={'https://discord.gg/atlis'}>
                        <Button color='ghost' iconLeft={<DiscordLogo />} centerItems />
                    </Link>
                </>}

                {authStatus === 'unauthenticated' && <>
                    <Link href={'/login'}>
                        <Button>Create your profile</Button>
                    </Link>

                    <Link href={'/login'}>
                        <Button color='ghost'>Login</Button>
                    </Link>
                </>}
            </div>
        </div>
    )
}