"use client";

import { inferRouterOutputs } from '@trpc/server';
import { LinkType } from 'database';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Marquee from 'react-fast-marquee';
import { toast } from 'react-hot-toast';
import {
    PiCameraBold, PiDiscordLogoBold, PiGithubLogoBold, PiHammerBold, PiHeartBold, PiHeartFill, PiInstagramLogoBold, PiLinkSimpleBold, PiPencilSimple,
    PiQuestion, PiSealCheckBold, PiShareFat, PiTiktokLogoBold, PiTwitterLogoBold, PiYoutubeLogoBold
} from 'react-icons/pi';

import { Avatar } from './Avatar';
import { Button } from './Button';
import { DeleteModal } from './DeleteModal';
import { ProfileMenu } from './Menus/ProfileMenu';
import { AdminEditUserModal } from './Modals/AdminEditUserModal';
import { SpotifySetupModal } from './Modals/SpotifySetupModal';
import { ReportModal } from './ReportModal';

import type { AppRouter } from '~/server/api/root';
import { api } from '~/components/TRPCWrapper';
import { handleErrors } from '~/utils/handle-errors.util';

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
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
    const [spotifySetupModalOpen, setSpotifySetupModalOpen] = useState(false);
    const [adminEditUserModalOpen, setAdminEditUserModalOpen] = useState(false);

    const { data: lanyardData } = api.user.getLanyardStatus.useQuery({ username });

    const { mutate: deleteUser } = api.admin.deleteUser.useMutation({
        onSuccess: () => toast.success('User deleted successfully!'),
        onError: (e) => handleErrors({ e, message: 'An error occurred while deleting this user.' })
    });

    const handleDeleteUser = () => {
        if (!profileData?.id) {
            toast.error('An error occurred while deleting this user.');
            return;
        }

        setConfirmDeleteModalOpen(true);
    }

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
            ctx.user.getProfile.refetch({ username });
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
        <div className="md:h-full flex flex-col font-satoshi md:bg-white md:dark:bg-black md:border-r border-stroke pl-4 py-4 md:px-12">
            {reportModalOpen && <ReportModal isOpen={reportModalOpen} setIsOpen={setReportModalOpen} type='USER' id={profileData?.id} />}
            {confirmDeleteModalOpen && <DeleteModal isOpen={confirmDeleteModalOpen} setIsOpen={setConfirmDeleteModalOpen} admin deleteFn={() => {
                deleteUser({ id: profileData?.id ?? '' });
                push('/discover');
            }} />}
            {spotifySetupModalOpen && <SpotifySetupModal isOpen={spotifySetupModalOpen} setIsOpen={setSpotifySetupModalOpen} />}
            {(adminEditUserModalOpen && profileData) && <AdminEditUserModal targetUser={profileData} isOpen={adminEditUserModalOpen} setIsOpen={setAdminEditUserModalOpen} />}

            <div className='md:w-96 w-full flex flex-col gap-4'>
                <div className='flex md:flex-col gap-4 md:justify-normal'>
                    <Avatar size='jumbo' image={profileData?.image} id={profileData?.id} username={profileData?.username} />

                    <div className='flex flex-col gap-1 md:gap-4'>
                        <h1 className='font-black text-2xl md:text-4xl font-clash gap-2 md:gap-3 flex items-center'>
                            <span>{profileData?.username}</span>
                            <div className='group relative w-max'>
                                {profileData?.admin ? <PiHammerBold className='w-6 h-6 md:w-8 md:h-8' /> : profileData?.verified && <PiSealCheckBold className='w-6 h-6 md:w-8 md:h-8' />}
                                <span className='opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none absolute w-0 h-0 -top-2 left-1/3 border-x-[5px] border-x-transparent border-t-[7.5px] border-t-black dark:border-t-stroke' />
                                <span
                                    className="shadow-lg pointer-events-none absolute bg-black dark:bg-white -top-[42px] -left-full w-max rounded-xl p-2 opacity-0 transition-opacity group-hover:opacity-100"
                                >

                                    <p className='text-sm font-medium text-white dark:text-black'>{profileData?.admin ? 'Administrator' : profileData?.verified && 'Verified'}</p>
                                </span>
                            </div>
                        </h1>

                        <p className={`grow ${loading && 'skeleton'}`}>{profileData?.tagline}</p>

                        <div className='flex gap-4 text-sm md:text-base'>
                            <p className={`flex items-center gap-1`}>
                                <PiCameraBold className='w-5 h-5' />
                                <span className={loading ? 'skeleton' : ''}><span className='font-bold'>{profileData?.imageCount}</span> Post{profileData?.imageCount !== 1 ? 's' : ''}</span>
                            </p>

                            <p className='flex items-center gap-1'>
                                <PiHeartBold className='w-5 h-5' />
                                <span className={loading ? 'skeleton' : ''}><span className='font-bold'>{profileData?.likeCount}</span> Follower{profileData?.likeCount !== 1 ? 's' : ''}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className={`flex text-sm gap-2 w-96 max-w-full flex-wrap`}>
                    {profileData?.links.map(link =>
                        <Link href={`${link.url}`} key={link.id}>
                            <p className='flex items-center gap-1'>
                                {link.type === LinkType.TWITTER && <PiTwitterLogoBold className='w-5 h-5' />}
                                {link.type === LinkType.YOUTUBE && <PiYoutubeLogoBold className='w-5 h-5' />}
                                {link.type === LinkType.TIKTOK && <PiTiktokLogoBold className='w-5 h-5' />}
                                {link.type === LinkType.DISCORD && <PiDiscordLogoBold className='w-5 h-5' />}
                                {link.type === LinkType.INSTAGRAM && <PiInstagramLogoBold className='w-5 h-5' />}
                                {link.type === LinkType.GITHUB && <PiGithubLogoBold className='w-5 h-5' />}
                                {link.type === LinkType.WEBSITE && <PiLinkSimpleBold className='w-5 h-5' />}
                                <span className='underline'>{link.url.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '')}</span>
                            </p>
                        </Link>)}
                </div>

                {(profileData?.lanyardEnabled && !currentUser?.hideLanyard) && <div className='w-full flex items-center gap-4'>
                    {lanyardData && lanyardData.albumArt && <>
                        <div className='relative w-6 h-6'>
                            <Image src={lanyardData.albumArt} alt={lanyardData.title} fill className='rounded-xl' />
                        </div>

                        <Marquee pauseOnHover autoFill speed={40} className='cursor-pointer select-none'>
                            <p className='text-sm mx-4'>Listening to <span className='font-bold'>{lanyardData?.title}</span> by <span className='font-bold'>{lanyardData?.artist}</span>
                            </p>
                        </Marquee>
                    </>}
                    {lanyardData === null && isCurrentUser && <p onClick={() => setSpotifySetupModalOpen(true)} className='text-sm text-error flex gap-2 items-center cursor-pointer hover:underline'>More setup required to display Spotify. <PiQuestion className='w-4 h-4' /></p>}
                </div>}

                <div className='w-full flex items-center justify-between gap-4'>
                    {!isCurrentUser && !profileData?.username?.toLowerCase().includes(currentUser?.username?.toLowerCase() ?? '') && <>
                        <div className='grow'>
                            <Button
                                accent
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

                                    (profileData?.authUserHasLiked) ? (
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

                                disabled={loading || isLoading}
                            >
                                Follow{(profileData?.authUserHasLiked) ? 'ed' : ''}
                            </Button>
                        </div>

                        <div>
                            {(currentUser && profileData) && <ProfileMenu setAdminEditUserModalOpen={setAdminEditUserModalOpen} username={profileData.username ?? ''} user={currentUser} userUrl={userUrl} handleDeleteUser={handleDeleteUser} setReportModalOpen={setReportModalOpen} />}
                        </div>
                    </>}

                    {(isCurrentUser || (currentUser && profileData && currentUser.username.toLowerCase() === (profileData?.username || '').toLowerCase())) && <>
                        <Link href='/settings/profile' className='grow'>
                            <Button variant='outline' iconLeft={<PiPencilSimple />} centerItems>
                                Edit
                            </Button>
                        </Link>

                        <div className='grow'>
                            <Button variant='outline' iconLeft={<PiShareFat />} centerItems onClick={handleShare}>
                                Share
                            </Button>
                        </div>
                    </>}
                </div>
            </div>
        </div >
    )
}