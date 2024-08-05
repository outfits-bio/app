"use client";

import { signOut } from '@acme/auth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

import { PiCopySimple } from 'react-icons/pi';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useRef } from 'react';



export const NavbarMenu = () => {
    const { data: session } = useSession();
    const ref = useRef<HTMLDivElement>(null);

    if (!session) return null;

    const user = session.user;

    const handleShare = () => {
        void navigator.clipboard.writeText(user.username ?? "");

        toast.success('Username copied to clipboard!');
    }

    return <Popover>
        <PopoverTrigger>
            <Avatar ref={ref} size={'sm'} image={user.image} id={user.id} username={user.username} />
        </PopoverTrigger>
        <PopoverContent className='mr-6 w-fit'>
            <div className="px-6 pb-2 space-y-1 font-clash font-bold h-12 flex items-center gap-2">
                <p className='peer cursor-pointer hover:underline' onClick={handleShare}>{user.username}</p>

                <div className='h-full peer-hover:flex items-center pb-5 hidden'>
                    <PiCopySimple className='w-4 h-4 text-secondary-text' />
                </div>
            </div>
            <div className="pt-2 space-y-1 border-t border-stroke" />
            <div className="py-2 space-y-1">
                <div>
                    <Link href={`/${user.username}`} onClick={() => ref.current?.click()}>
                        <Button
                            variant='ghost'
                        >
                            <p className='font-semibold'>Profile</p>
                        </Button>
                    </Link>
                </div>
                <div>
                    <Link href={'/wishlist'} onClick={() => ref.current?.click()}>
                        <Button
                            variant='ghost'
                        >
                            <p className='font-semibold'>Wishlist</p>
                        </Button>
                    </Link>
                </div>
                <div>
                    <Link href={'/settings/profile'} onClick={() => ref.current?.click()}>
                        <Button
                            variant='ghost'
                        >
                            <p className='font-semibold'>Settings</p>
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="pt-2 space-y-1 border-t border-stroke">
                <div>
                    <Link href={'https://discord.gg/f4KEs5TVz2'}>
                        <Button
                            variant='ghost'
                        >
                            <p className='font-semibold' onClick={() => ref.current?.click()}>Join Discord</p>
                        </Button>
                    </Link>
                </div>
                <div>
                    <Button
                        variant='ghost'
                        onClick={() => signOut()}
                    >
                        <p className='font-semibold' onClick={() => ref.current?.click()}>Logout</p>
                    </Button>
                </div>
            </div>
        </PopoverContent>
    </Popover>
}