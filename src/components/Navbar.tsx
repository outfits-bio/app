import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';
import { formatAvatar } from '~/utils/image-src-format.util';

import { Menu, Transition } from '@headlessui/react';
import {
    Bell, CoatHanger, Compass, Door, DoorOpen, Gear, Person, Plus, User
} from '@phosphor-icons/react';

import { Button } from './Button';
import { NavMenu } from './Menu';

interface Props {
    title: string;
    session: ReturnType<typeof useSession>;
    showSlash?: boolean;
    showActions?: boolean;
}

export const AuthSection = ({ session, isAuth }: { session: Props['session'], isAuth: boolean }) => {

    if (!isAuth) return null;

    return <div className='hidden md:flex items-center justify-center gap-2'>
        <Link href='/explore'>
            <Button color='ghost' iconLeft={<Plus />} />
        </Link>

        <Link href='/explore'>
            <Button color='ghost' iconLeft={<Compass />} />
        </Link>

        <Link href='/notifications'>
            <Button color='ghost' iconLeft={<Bell />} />
        </Link>

        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button>
                    <Button color='outline'>
                        <Image className='rounded-full object-contain' src={formatAvatar(session.data?.user.image, session.data?.user.id)} alt={session.data?.user.username ?? ""} width={24} height={24} />

                        <p className='font-semibold'>{session.data?.user.username}</p>
                    </Button>
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
                <Menu.Items className="absolute right-1 -mt-2 rounded-md w-56 origin-top-right border border-black dark:border-white bg-white dark:bg-black">
                    <div className="px-1 py-1 space-y-1">
                        <Menu.Item>
                            <Link href={`/${session.data?.user.username}`}>
                                <Button
                                    color='ghost'
                                    iconRight={<User />}
                                >
                                    <p className='font-semibold'>Profile</p>
                                </Button>
                            </Link>
                        </Menu.Item>
                        <Menu.Item>
                            <Link href={'/settings/profile'}>
                                <Button
                                    color='ghost'
                                    iconRight={<Gear />}
                                >
                                    <p className='font-semibold'>Settings</p>
                                </Button>
                            </Link>
                        </Menu.Item>
                        <Menu.Item>
                            <Button
                                color='warning-ghost'
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

export const Navbar = ({ title, session, showSlash = true, showActions = true }: Props) => {
    const { data, status } = session;

    const isAuth = status === 'authenticated' && data;

    return (
        <div className='border-b h-20 border-black dark:border-white fixed w-full z-10 bg-white dark:bg-black'>
            <Head>
                <title>{title}</title>
            </Head>

            <div className='flex items-center px-6 sm:px-12 h-full justify-between gap-2'>
                <Link href='/' className='flex items-center gap-4'>
                    <CoatHanger className='h-10 w-10' />



                    {showSlash ? <h1 className='text-2xl font-black font-urbanist'>/ {title}</h1> : <h1 className='text-2xl font-black font-urbanist'>outfits.bio</h1>}
                </Link>

                {showActions && status !== 'loading' && <>
                    {isAuth ? <AuthSection isAuth={!!isAuth} session={session} /> : <NavMenu />}
                    {isAuth ? null : <div className='items-center gap-4 hidden md:flex'>
                        <Link href='/explore'>
                            <Button color='ghost'>Explore</Button>
                        </Link>
                        <Link href='/discord'>
                            <Button color='ghost'>Discord</Button>
                        </Link>

                        <Link href='/login'>
                            <Button color='outline'>Login</Button>
                        </Link>
                        <Link href='/login'>
                            <Button color='primary'>Register</Button>
                        </Link>
                    </div>}
                </>}
            </div>
        </div>
    )
}