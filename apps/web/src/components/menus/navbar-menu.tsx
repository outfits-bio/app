"use client";

import { Menu } from '@headlessui/react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

import { PiCopySimple } from 'react-icons/pi';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { BaseMenu } from './base-menu';



export const NavbarMenu = () => {
    const { data: session } = useSession();

    if (!session) return null;

    const user = session.user;

    const handleShare = () => {
        void navigator.clipboard.writeText(user.username ?? "");

        toast.success('Username copied to clipboard!');
    }

    return <BaseMenu button={<Avatar size={'sm'} image={user.image} id={user.id} username={user.username} className='mt-2' />}>
        <div className="px-6 pb-2 space-y-1 font-clash font-bold h-12 flex items-center gap-2">
            <p className='peer cursor-pointer hover:underline' onClick={handleShare}>{user.username}</p>

            <div className='h-full peer-hover:flex items-center pb-5 hidden'>
                <PiCopySimple className='w-4 h-4 text-secondary-text' />
            </div>
        </div>

        <div className="py-2 space-y-1">
            <Menu.Item>
                <Link href={`/${user.username}`}>
                    <Button
                        variant='ghost'
                    >
                        <p className='font-semibold'>Profile</p>
                    </Button>
                </Link>
            </Menu.Item>
            <Menu.Item>
                <Link href={'/wishlist'}>
                    <Button
                        variant='ghost'
                    >
                        <p className='font-semibold'>Wishlist</p>
                    </Button>
                </Link>
            </Menu.Item>
            <Menu.Item>
                <Link href={'/settings/profile'}>
                    <Button
                        variant='ghost'
                    >
                        <p className='font-semibold'>Settings</p>
                    </Button>
                </Link>
            </Menu.Item>
        </div>
        <div className="pt-2 space-y-1">
            <Menu.Item>
                <Link href={'https://discord.gg/f4KEs5TVz2'}>
                    <Button
                        variant='ghost'
                    >
                        <p className='font-semibold'>Join Discord</p>
                    </Button>
                </Link>
            </Menu.Item>
            <Menu.Item>
                <Button
                    variant='ghost'
                    onClick={() => signOut()}
                >
                    <p className='font-semibold'>Logout</p>
                </Button>
            </Menu.Item>
        </div>
    </BaseMenu>
}