import debounce from 'lodash.debounce';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { api } from '~/utils/api.util';
import { formatAvatar } from '~/utils/image-src-format.util';

import { Menu, Transition } from '@headlessui/react';
import {
    Bell, BellSimple, Camera, CoatHanger, Compass, CopySimple, Door, DoorOpen, Gear, Hammer, Heart,
    MagnifyingGlass, Person, Plus, SealCheck, SpinnerGap, User
} from '@phosphor-icons/react';

import { Avatar } from './Avatar';
import { Button } from './Button';
import { Logo } from './Logo';
import { NavMenu } from './Menu';
import { NavbarMenu } from './Menus/NavbarMenu';
import { BugReportModal } from './Modals/BugReportModal';
import { FeedbackModal } from './Modals/FeedbackModal';

interface Props {
    title: string;
    session: ReturnType<typeof useSession>;
    showSlash?: boolean;
    showActions?: boolean;
    hideSearch?: boolean;
}

export const AuthSection = ({ session, isAuth }: { session: Props['session'], isAuth: boolean }) => {
    const [bugReportModalOpen, setBugReportModalOpen] = useState(false);
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

    const { pathname } = useRouter();

    if (!isAuth) return null;

    return <>
        {bugReportModalOpen && <BugReportModal isOpen={bugReportModalOpen} setIsOpen={setBugReportModalOpen} />}
        {feedbackModalOpen && <FeedbackModal isOpen={feedbackModalOpen} setIsOpen={setFeedbackModalOpen} />}

        <div className='hidden md:flex items-center justify-center gap-4'>
            <Link href='/shoot'>
                <Button variant='outline-ghost' iconLeft={<Plus />}>Create</Button>
            </Link>

            {pathname !== '/explore' && <Link href='/explore'>
                <Button variant='outline-ghost' shape={'square'} iconLeft={<Compass />} />
            </Link>}

            <Link href='/notifications'>
                <Button variant='outline-ghost' shape={'circle'} iconLeft={<BellSimple />} />
            </Link>

            {session.data?.user && <NavbarMenu user={session.data.user} setBugReportModalOpen={setBugReportModalOpen} setFeedbackModalOpen={setFeedbackModalOpen} />}
        </div>
        <Link href='/notifications' className='md:hidden'>
            <Button variant='outline-ghost' shape={'circle'} iconLeft={<BellSimple />} />
        </Link>
    </>
}

export const Navbar = ({ title, session, showSlash = true, showActions = true, hideSearch = false }: Props) => {
    const { asPath, pathname } = useRouter();

    const [input, setInput] = useState('');

    const { data, status } = session;

    const isAuth = status === 'authenticated' && data;

    const request = debounce(async () => {
        refetch();
    }, 300)

    const debounceRequest = useCallback(() => {
        request()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const { data: searchData, isFetching, refetch } = api.user.searchProfiles.useQuery({ username: input }, {
        enabled: false
    });

    useEffect(() => {
        setInput('');
    }, [asPath]);

    const pageTitle = title === 'outfits.bio' ? 'outfits.bio' : `outfits.bio - ${title.toLowerCase()}`;

    return (
        <div className='border-b h-20 border-stroke fixed w-full z-10 bg-white dark:bg-black font-urbanist'>
            <Head>
                <title>{pageTitle}</title>
            </Head>

            <div className='flex items-center px-6 sm:px-12 h-full justify-between gap-2'>
                {input.length > 0 && <div className='absolute w-screen h-screen inset-0' onClick={() => setInput('')}></div>}
                <Link href={isAuth ? '/explore' : '/'} className='flex items-center gap-4'>
                    <Logo size={'lg'} />
                    {showSlash ? <h1 className='text-2xl font-black font-urbanist'>{title.toLowerCase()}</h1> : <h1 className='text-2xl font-black font-urbanist'>outfits.bio</h1>}
                </Link>

                {(isAuth && !hideSearch) && <div className='hidden relative items-center font-urbanist font-medium xl:flex'>
                    {isFetching ? <SpinnerGap className='absolute left-4 text-gray-400 w-6 h-6 animate-spin' /> : <MagnifyingGlass className='absolute left-4 text-gray-400 dark:text-white w-6 h-6' />}
                    <input
                        id="link"
                        type="text"
                        placeholder='Search for users'
                        className="pl-12 py-2 h-12 w-[400px] border rounded-md border-stroke text-secondary-text dark:bg-black"
                        onChange={(e) => {
                            setInput(e.target.value)
                            debounceRequest()
                        }}
                        value={input}
                    />

                    {input.length > 0 && <div className='absolute top-14 w-full flex flex-col gap-1'>
                        {(searchData?.length ?? 0) > 0 ? searchData?.map((user) => (
                            <Link href={`/${user.username}`} key={user.id}>
                                <div className='bg-white dark:bg-black border border-stroke p-4 rounded-md hover:bg-body dark:hover:bg-body cursor-pointer flex gap-2'>
                                    <Avatar image={user.image} id={user.id} username={user.username} />

                                    <div className='flex flex-col gap-1'>
                                        <h1 className='font-black flex gap-1 items-center'>
                                            <span>{user.username}</span>
                                            {user.admin ? <Hammer className='w-4 h-4' /> : user.verified && <SealCheck className='w-4 h-4' />}
                                        </h1>
                                        <p className='text-xs'>{user.tagline}</p>

                                        <div className='flex gap-2 items-center text-xs'>
                                            <span className='flex gap-1 items-center'>
                                                <Camera className='w-3 h-3' />
                                                <span>{user.imageCount} Shots</span>
                                            </span>
                                            <span className='flex gap-1 items-center'>
                                                <Heart className='w-3 h-3' />
                                                <span>{user.likeCount} Likes</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )) : <div className='bg-white dark:bg-black border border-stroke p-4 rounded-md'>No results</div>}
                    </div>
                    }
                </div>}

                {showActions && status !== 'loading' && <>
                    {isAuth ? <AuthSection isAuth={!!isAuth} session={session} /> : <NavMenu />}
                    {isAuth ? null : <div className='items-center gap-4 hidden md:flex'>
                        {pathname !== '/explore' && <Link href='/explore'>
                            <Button variant='outline-ghost'>Explore</Button>
                        </Link>}

                        <Link href='https://discord.gg/f4KEs5TVz2'>
                            <Button variant='outline-ghost'>Discord</Button>
                        </Link>

                        <Link href='/login'>
                            <Button variant='outline'>Login</Button>
                        </Link>
                        <Link href='/login'>
                            <Button variant='primary'>Create your profile</Button>
                        </Link>
                    </div>}
                </>}
            </div>
        </div>
    )
}