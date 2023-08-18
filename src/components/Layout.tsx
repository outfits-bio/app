import { useSession } from 'next-auth/react';
import { Inter, Poppins, Urbanist } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { formatAvatar } from '~/utils/image-src-format.util';

import {
    Bell, DoorOpen, Gear, HouseSimple, MagnifyingGlass, Plus, UserPlus
} from '@phosphor-icons/react';

import { Navbar } from './Navbar';

interface Props {
    children: React.ReactNode;
    title: string;
    showSlash?: boolean;
    redirectIfNotAuth?: boolean;
    showActions?: boolean;
    showSearch?: boolean;
}

const urbanist = Urbanist({
    subsets: ['latin-ext'],
    display: 'swap',
    variable: '--font-urbanist',
});

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

export const Layout = ({ children, title, showSlash, redirectIfNotAuth, showActions, showSearch }: Props) => {
    const { push, pathname } = useRouter();

    const session = useSession();

    useEffect(() => {
        if (redirectIfNotAuth && session.status === 'unauthenticated') {
            push('/login');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, redirectIfNotAuth]);

    if (redirectIfNotAuth && session.status !== 'authenticated') {
        return null;
    }

    return (
        <div className={`bg-white font-inter text-black flex flex-col dark:bg-black dark:text-white min-h-screen antialiased ${urbanist.variable} ${inter.variable}`}>
            <Navbar title={title} session={session} showSlash={showSlash} showActions={showActions} showSearch={showSearch} />
            <main className='h-screen pt-20 overflow-x-hidden pb-24 md:pb-0 scroll-smooth'>{children}</main>
            {pathname !== '/login' && pathname !== '/onboarding' && pathname !== '/' &&
                <div className='py-2 px-6 bg-white dark:bg-black border border-black dark:border-white flex justify-between w-screen h-24 fixed bottom-0 md:hidden gap-4'>
                    <Link href={'/explore'} className='grow hover:bg-slate-100 rounded-md flex items-center justify-center text-3xl'>
                        <HouseSimple />
                    </Link>

                    <Link href={'/search'} className='grow hover:bg-slate-100 rounded-md flex items-center justify-center text-3xl'>
                        <MagnifyingGlass />
                    </Link>

                    <Link href={'/shoot'} className='grow hover:bg-slate-100 rounded-md flex items-center justify-center text-3xl'>
                        <Plus />
                    </Link>

                    <Link href={'/settings'} className='grow hover:bg-slate-100 rounded-md flex items-center justify-center text-3xl'>
                        <Gear />
                    </Link>

                    {session.data?.user ? <Link href={`/${session.data?.user.username}`} className='grow hover:bg-slate-100 rounded-md flex items-center justify-center text-3xl'>
                        <Image className='rounded-full object-contain' src={formatAvatar(session.data?.user.image, session.data?.user.id)} alt={session.data?.user.username ?? ""} width={30} height={30} />
                    </Link> : <Link href={'/login'} className='grow hover:bg-slate-100 rounded-md flex items-center justify-center text-3xl'>
                        <UserPlus />
                    </Link>}
                </div>
            }
        </div>
    )
}