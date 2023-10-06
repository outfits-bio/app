import debounce from 'lodash.debounce';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { api } from '~/utils/api.util';

import {
    PiBellSimple, PiBellSimpleFill, PiCamera, PiCompass, PiHammer, PiHeart,
    PiMagnifyingGlass, PiMagnifyingGlassBold, PiPlus, PiSealCheck, PiSpinnerGap
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
import { Popover, Transition } from '@headlessui/react';

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

    const iconComponent = pathname === "/notifications" ? <PiBellSimpleFill /> : <PiBellSimple />;

    if (!isAuth) return null;


    return <>
        {bugReportModalOpen && <BugReportModal isOpen={bugReportModalOpen} setIsOpen={setBugReportModalOpen} />}
        {feedbackModalOpen && <FeedbackModal isOpen={feedbackModalOpen} setIsOpen={setFeedbackModalOpen} />}
        {createPostModalOpen && <CreatePostModal isOpen={createPostModalOpen} setIsOpen={setCreatePostModalOpen} />}

        <div className='hidden md:flex items-center justify-center gap-4'>
            <div>
                <Button variant='outline-ghost' accent={theme !== 'dark' && theme !== 'light'} iconLeft={<PiPlus />} onClick={() => setCreatePostModalOpen(true)}>Create</Button>
            </div>

            {pathname !== '/discover' && <Link href='/discover'>
                <Button variant='outline-ghost' shape={'square'} iconLeft={<PiCompass />} />
            </Link>}

            <NotificationsMenu unreadCount={data} />

            {session.data?.user && <NavbarMenu user={session.data.user} setBugReportModalOpen={setBugReportModalOpen} setFeedbackModalOpen={setFeedbackModalOpen} />}
        </div>
        <Link href='/notifications' className='md:hidden relative'>
            <Button variant='outline-ghost' shape={'circle'} iconLeft={iconComponent} />
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
                <Link href={isAuth ? '/discover' : '/'} className='flex items-center gap-2'>
                    <Logo size={'lg'} />
                    {showSlash ? <h1 className='text-2xl font-black font-clash'>{title.toLowerCase()}</h1> : <h1 className='text-2xl font-black font-clash'>outfits.bio</h1>}
                </Link>

                {(isAuth && !hideSearch) && <div className='hidden relative items-center font-clash font-medium xl:flex'>
                    <input
                        autoComplete='off'
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

                    <div className='absolute top-14 w-full'>
                        <Popover className={'relative'}>
                            {({ close }) => (
                                <>
                                    <Transition
                                        show={input.length > 0}
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1"
                                    >
                                        <Popover.Panel>
                                            <div className="relative border border-stroke rounded-md p-4 bg-white w-full flex flex-col gap-2 shadow-lg">
                                                <Link href={`/search?username=${input}`} className='flex items-center rounded-md p-2 bg-stroke border border-stroke text-secondary-text w-full text-left'>
                                                    <PiMagnifyingGlassBold className='text-xl mr-2' />
                                                    <p>Search for &quot;{input}&quot;</p>
                                                </Link>

                                                {searchData && searchData.map((user) => (
                                                    <Link href={`/${user.username}`} key={user.id} className='flex items-center rounded-md p-2 hover:bg-hover w-full text-left border border-stroke'>
                                                        <Avatar image={user.image} size={'xs'} className='mr-2' />
                                                        <p>{user.username}</p>
                                                        {user.admin ? <PiHammer className='ml-1 text-primary' /> : user.verified ? <PiSealCheck className='ml-1 text-primary' /> : null}
                                                    </Link>
                                                ))
                                                }
                                            </div>
                                        </Popover.Panel>
                                    </Transition>
                                </>
                            )}
                        </Popover>
                    </div>
                </div>
                }

                {showActions && status !== 'loading' && <>
                    {isAuth ? <AuthSection isAuth={!!isAuth} session={session} /> : <NavMenu />}
                    {isAuth ? null : <div className='items-center gap-4 hidden md:flex'>
                        {pathname !== '/discover' && <Link href='/discover'>
                            <Button variant='outline-ghost'>Discover</Button>
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
        </div >
    )
}