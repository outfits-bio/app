import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'react-hot-toast';
import { formatAvatar } from '~/utils/image-src-format.util';

import { Menu } from '@headlessui/react';
import { CopySimple } from '@phosphor-icons/react';

import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { BaseMenu } from './BaseMenu';

import type { User } from 'next-auth';
interface NavbarMenuProps {
    user: User;
    setBugReportModalOpen: Dispatch<SetStateAction<boolean>>;
    setFeedbackModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const NavbarMenu = ({ user, setBugReportModalOpen, setFeedbackModalOpen, ...props }: NavbarMenuProps) => {
    const handleShare = () => {
        navigator.clipboard.writeText(user.username ?? "");

        toast.success('Username copied to clipboard!');
    }

    return <BaseMenu {...props} button={<Avatar size={'sm'} image={user.image} id={user.id} username={user.username} className='mt-2' />}>
        <div className="px-6 pb-2 space-y-1 font-urbanist font-bold h-12 flex items-center gap-2">
            <p className='peer cursor-pointer hover:underline' onClick={handleShare}>{user.username}</p>

            <div className='h-full peer-hover:flex items-center pb-1 hidden'>
                <CopySimple className='w-4 h-4 text-secondary-text' />
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
                <Link href={'/settings/profile'}>
                    <Button
                        variant='ghost'
                    >
                        <p className='font-semibold'>Settings</p>
                    </Button>
                </Link>
            </Menu.Item>
            <Menu.Item>
                <Link href={'https://discord.gg/f4KEs5TVz2'}>
                    <Button
                        variant='ghost'
                    >
                        <p className='font-semibold'>Discord</p>
                    </Button>
                </Link>
            </Menu.Item>
        </div>
        <div className="pt-2 space-y-1">
            <Menu.Item>
                <Button
                    variant='ghost'
                    onClick={() => setBugReportModalOpen(true)}
                >
                    <p className='font-semibold'>Report Bug</p>
                </Button>
            </Menu.Item>
            <Menu.Item>
                <Button
                    variant='ghost'
                    onClick={() => setFeedbackModalOpen(true)}
                >
                    <p className='font-semibold'>Feedback</p>
                </Button>
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