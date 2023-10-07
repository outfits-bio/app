import localFont from 'next/font/local';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import {
    PiGear, PiGearFill, PiHouse, PiHouseFill, PiMagnifyingGlass, PiMagnifyingGlassFill, PiPlus, PiUserPlus
} from 'react-icons/pi';
import { formatAvatar } from '~/utils/image-src-format.util';

import { Button } from './Button';
import { Navbar } from './Navbar';

interface Props {
    children: React.ReactNode;
    title: string;
    showSlash?: boolean;
    redirectIfNotAuth?: boolean;
    showActions?: boolean;
    hideSearch?: boolean;
}

const clash = localFont({
    src: '../../public/fonts/ClashDisplay-Variable.woff2',
    display: 'swap',
    variable: '--font-clash',
});

const satoshi = localFont({
    src: '../../public/fonts/Satoshi-Variable.woff2',
    display: 'swap',
    variable: '--font-satoshi',
});

export const Layout = ({ children, title, showSlash, redirectIfNotAuth, showActions, hideSearch }: Props) => {
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
        <div className={`bg-body font-satoshi flex flex-col min-h-screen antialiased transition-colors duration-300 ${clash.variable} ${satoshi.variable}`}>
            <Navbar title={title} session={session} showSlash={showSlash} showActions={showActions} hideSearch={hideSearch} />
            <main className='h-screen pt-20 overflow-x-hidden pb-24 md:pb-0 scroll-smooth'>{children}</main>
            {pathname !== '/login' && pathname !== '/onboarding' && pathname !== '/' &&
                <div className='py-5 px-6 bg-white dark:bg-black border border-stroke flex justify-between w-screen h-24 fixed bottom-0 md:hidden gap-4 z-50'>
                    <Link href={'/discover'} className='grow hover:bg-hover rounded-md flex items-center justify-center text-3xl transition duration-300 ease-in-out'>
                        {pathname === "/discover" ? <PiHouseFill /> : <PiHouse />}
                    </Link>

                    <Link href={'/search'} className='grow hover:bg-hover rounded-md flex items-center justify-center text-3xl transition duration-300 ease-in-out'>
                        {pathname === "/search" ? <PiMagnifyingGlassFill /> : <PiMagnifyingGlass />}
                    </Link>

                    <Link href={'/shoot'} className='rounded-md flex flex-col items-center justify-center text-3xl transition duration-300 ease-in-out'>
                        <Button shape={'square'} variant={'outline-ghost'} accent>
                            <PiPlus />
                        </Button>
                    </Link>

                    <Link href={'/settings'} className='grow hover:bg-hover rounded-md flex items-center justify-center text-3xl transition duration-300 ease-in-out'>
                        {pathname.startsWith("/settings") ? <PiGearFill /> : <PiGear />}
                    </Link>

                    {session.data?.user ? <Link href={`/${session.data?.user.username}`} className='grow hover:bg-hover rounded-md flex items-center justify-center text-3xl transition duration-300 ease-in-out'>
                        <Image className='rounded-full object-contain' src={formatAvatar(session.data?.user.image, session.data?.user.id)} alt={session.data?.user.username ?? ""} width={30} height={30} />
                    </Link> : <Link href={'/login'} className='grow hover:bg-hover rounded-md flex items-center justify-center text-3xl transition duration-300 ease-in-out'>
                        <PiUserPlus />
                    </Link>}
                </div>
            }
        </div>
    )
}