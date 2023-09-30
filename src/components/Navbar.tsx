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
    PiBell, PiBellSimple, PiCamera, PiCoatHanger, PiCompass, PiCopySimple, PiDoor, PiDoorOpen, PiGear, PiHammer, PiHeart,
    PiMagnifyingGlass, PiPerson, PiPlus, PiSealCheck, PiSpinnerGap, PiUser
} from 'react-icons/pi';

import { Avatar } from './Avatar';
import { Button } from './Button';
import { Logo } from './Logo';
import { NavMenu } from './Menu';
import { NavbarMenu } from './Menus/NavbarMenu';
import { BugReportModal } from './Modals/BugReportModal';
import { FeedbackModal } from './Modals/FeedbackModal';
import { NotificationsMenu } from './Menus/NotificationsMenu';
import { useTheme } from 'next-themes';
import { CreatePostModal } from './Modals/CreatePostModal';

interface Props {
    title: string;
    session: ReturnType<typeof useSession>;
    showSlash?: boolean;
    showActions?: boolean;
    hideSearch?: boolean;
}

export const AuthSection = ({ session, isAuth }: { session: Props['session'], isAuth: boolean }) => {
    const { theme } = useTheme();

    const { data, refetch } = api.notifications.getUnreadNotificationsCount.useQuery(undefined);

    const [bugReportModalOpen, setBugReportModalOpen] = useState(false);
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [createPostModalOpen, setCreatePostModalOpen] = useState(false);

    const hasNotifications = data && data > 0;

    const { pathname } = useRouter();

    if (!isAuth) return null;

    return <>
        {bugReportModalOpen && <BugReportModal isOpen={bugReportModalOpen} setIsOpen={setBugReportModalOpen} />}
        {feedbackModalOpen && <FeedbackModal isOpen={feedbackModalOpen} setIsOpen={setFeedbackModalOpen} />}
        {createPostModalOpen && <CreatePostModal isOpen={createPostModalOpen} setIsOpen={setCreatePostModalOpen} />}

        <div className='hidden md:flex items-center justify-center gap-4'>
            <div>
                <Button variant='outline-ghost' accent={theme !== 'dark' && theme !== 'light'} iconLeft={<PiPlus />} onClick={() => setCreatePostModalOpen(true)}>Create</Button>
            </div>

            {pathname !== '/explore' && <Link href='/explore'>
                <Button variant='outline-ghost' shape={'square'} iconLeft={<PiCompass />} />
            </Link>}

            <NotificationsMenu unreadCount={data} />

            {session.data?.user && <NavbarMenu user={session.data.user} setBugReportModalOpen={setBugReportModalOpen} setFeedbackModalOpen={setFeedbackModalOpen} />}
        </div>
        <Link href='/notifications' className='md:hidden relative'>
            <Button variant='outline-ghost' shape={'circle'} iconLeft={<PiBellSimple />} />
            {hasNotifications ? <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-error text-white text-[9px] font-bold flex items-center justify-center">
                {data}
            </div> : null}
        </Link>
    </>
}

export const Navbar = ({ title, session, showSlash = true, showActions = true, hideSearch = false }: Props) => {
    const { asPath, pathname, push } = useRouter();

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
        <div className='border-b h-20 border-stroke fixed w-full z-10 bg-white dark:bg-black font-clash'>
            <Head>
                <title>{pageTitle}</title>
            </Head>

            <div className='flex items-center px-6 sm:px-12 h-full justify-between gap-2'>
                {input.length > 0 && <div className='absolute w-screen h-screen inset-0' onClick={() => setInput('')}></div>}
                <Link href={isAuth ? '/explore' : '/'} className='flex items-center gap-2'>
                    <Logo size={'lg'} />
                    {showSlash ? <h1 className='text-2xl font-black font-clash'>{title.toLowerCase()}</h1> : <h1 className='text-2xl font-black font-clash'>outfits.bio</h1>}
                </Link>

                {(isAuth && !hideSearch) && <div className='hidden relative items-center font-clash font-medium xl:flex'>
                    <input
                        id="link"
                        type="text"
                        placeholder='Search for users'
                        className="pl-4 py-2 h-12 w-[400px] border rounded-md border-stroke text-secondary-text dark:bg-black focus:outline-none"
                        onChange={(e) => {
                            setInput(e.target.value)
                            debounceRequest()
                        }}
                        onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                push(`/search?username=${input}`)
                            }
                        }}
                        value={input}
                    />

                    <div className='w-[1px] h-full absolute right-12 bg-stroke' />

                    <button className='absolute right-0 flex items-center justify-center h-full w-12 hover:bg-hover disabled:hover:bg-transparent rounded-r-md' disabled={!input} onClick={() => input && push(`/search?username=${input}`)}>
                        {isFetching ? <PiSpinnerGap className=' text-secondary-text w-6 h-6 animate-spin' /> : <PiMagnifyingGlass className='text-secondary-text w-6 h-6' />}
                    </button>

                    {input.length > 0 && <div className='absolute top-14 w-full flex flex-col gap-1'>
                        {(searchData?.length ?? 0) > 0 ? searchData?.map((user) => (
                            <Link href={`/${user.username}`} key={user.id}>
                                <div className='bg-white dark:bg-black border border-stroke p-4 rounded-md hover:bg-body dark:hover:bg-body cursor-pointer flex gap-2'>
                                    <Avatar image={user.image} id={user.id} username={user.username} />

                                    <div className='flex flex-col gap-1'>
                                        <h1 className='font-black flex gap-1 items-center'>
                                            <span>{user.username}</span>
                                            {user.admin ? <PiHammer className='w-4 h-4' /> : user.verified && <PiSealCheck className='w-4 h-4' />}
                                        </h1>
                                        <p className='text-xs'>{user.tagline}</p>

                                        <div className='flex gap-2 items-center text-xs'>
                                            <span className='flex gap-1 items-center'>
                                                <PiCamera className='w-3 h-3' />
                                                <span>{user.imageCount} Shots</span>
                                            </span>
                                            <span className='flex gap-1 items-center'>
                                                <PiHeart className='w-3 h-3' />
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