import debounce from 'lodash.debounce';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { api } from '~/utils/api.util';
import { formatAvatar } from '~/utils/image-src-format.util';

import { Menu, Transition } from '@headlessui/react';
import {
    Bell, BellSimple, Camera, CoatHanger, Compass, Door, DoorOpen, Gear, Hammer, Heart,
    MagnifyingGlass, Person, Plus, SealCheck, SpinnerGap, User
} from '@phosphor-icons/react';

import { Button } from './Button';
import { Logo } from './Logo';
import { NavMenu } from './Menu';

interface Props {
    title: string;
    session: ReturnType<typeof useSession>;
    showSlash?: boolean;
    showActions?: boolean;
    showSearch?: boolean;
}

export const AuthSection = ({ session, isAuth }: { session: Props['session'], isAuth: boolean }) => {
    const { pathname } = useRouter();

    if (!isAuth) return null;

    return <div className='hidden md:flex items-center justify-center gap-2'>
        <Link href='/shoot'>
            <Button variant='ghost' iconLeft={<Plus />}>Create</Button>
        </Link>

        {pathname !== '/explore' && <Link href='/explore'>
            <Button variant='ghost' iconLeft={<Compass />} />
        </Link>}

        <Link href='/notifications'>
            <Button variant='ghost' iconLeft={<BellSimple />} />
        </Link>

        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button>
                    <Image className='rounded-full object-contain mt-2' src={formatAvatar(session.data?.user.image, session.data?.user.id)} alt={session.data?.user.username ?? ""} width={40} height={40} />
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-1 -mt-1 rounded-md w-56 origin-top-right border border-black dark:border-white bg-white dark:bg-black">
                    <div className="px-1 py-1 space-y-1">
                        <Menu.Item>
                            <Link href={`/${session.data?.user.username}`}>
                                <Button
                                    variant='ghost'
                                    iconRight={<User />}
                                >
                                    <p className='font-semibold'>Profile</p>
                                </Button>
                            </Link>
                        </Menu.Item>
                        <Menu.Item>
                            <Link href={'/settings/profile'}>
                                <Button
                                    variant='ghost'
                                    iconRight={<Gear />}
                                >
                                    <p className='font-semibold'>Settings</p>
                                </Button>
                            </Link>
                        </Menu.Item>
                        <Menu.Item>
                            <Button
                                variant='ghost'
                                iconRight={<DoorOpen />}
                                onClick={() => signOut()}
                            >
                                <p className='font-semibold'>Logout</p>
                            </Button>
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    </div>
}

export const Navbar = ({ title, session, showSlash = true, showActions = true, showSearch = false }: Props) => {
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

    return (
        <div className='border-b h-20 border-stroke fixed w-full z-10 bg-white dark:bg-black font-urbanist'>
            <Head>
                <title>outfits.bio - {title.toLowerCase()}</title>
            </Head>

            <div className='flex items-center px-6 sm:px-12 h-full justify-between gap-2'>
                {input.length > 0 && <div className='absolute w-screen h-screen inset-0' onClick={() => setInput('')}></div>}
                <Link href={isAuth ? '/explore' : '/'} className='flex items-center gap-4'>
                    <Logo size={'lg'} />
                    {showSlash ? <h1 className='text-2xl font-black font-urbanist'>{title.toLowerCase()}</h1> : <h1 className='text-2xl font-black font-urbanist'>outfits.bio</h1>}
                </Link>

                {(isAuth || showSearch) && <div className='hidden relative items-center font-urbanist font-medium xl:flex'>
                    {isFetching ? <SpinnerGap className='absolute left-4 text-gray-400 w-6 h-6 animate-spin' /> : <MagnifyingGlass className='absolute left-4 text-gray-400 dark:text-white w-6 h-6' />}
                    <input
                        id="link"
                        type="text"
                        placeholder='Search for users'
                        className="pl-12 py-2 w-[400px] border rounded-md border-stroke text-secondary-text"
                        onChange={(e) => {
                            setInput(e.target.value)
                            debounceRequest()
                        }}
                        value={input}
                    />

                    {input.length > 0 && <div className='absolute top-12 w-full flex flex-col gap-1'>
                        {(searchData?.length ?? 0) > 0 ? searchData?.map((user) => (
                            <Link href={`/${user.username}`} key={user.id}>
                                <div className='bg-white border border-black p-4 rounded-md hover:bg-slate-100 dark:hover:bg-slate-950 cursor-pointer flex gap-2'>
                                    <div className='basis-16 w-16 h-16 grow-0 shrink-0 md:basis-auto relative'>
                                        <Image className='rounded-full object-contain' priority src={formatAvatar(user.image, user.id)} alt={user.username ?? ""} fill />
                                    </div>

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
                        )) : <div className='bg-white border border-black p-4 rounded-md'>No results</div>}
                    </div>
                    }
                </div>}

                {showActions && status !== 'loading' && <>
                    {isAuth ? <AuthSection isAuth={!!isAuth} session={session} /> : <NavMenu />}
                    {isAuth ? null : <div className='items-center gap-4 hidden md:flex'>
                        {pathname !== '/explore' && <Link href='/explore'>
                            <Button variant='ghost'>Explore</Button>
                        </Link>}

                        <Link href='https://discord.gg/f4KEs5TVz2'>
                            <Button variant='ghost'>Discord</Button>
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