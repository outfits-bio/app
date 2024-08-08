"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Avatar } from "../ui/Avatar";

import {
    PiBookmarkSimple,
    PiBookmarkSimpleFill,
    PiHouse, PiHouseFill, PiMagnifyingGlass, PiMagnifyingGlassFill, PiUserPlus, PiPlus
} from 'react-icons/pi';

import { usePathname } from "next/navigation";
import dynamic from 'next/dynamic';
import { Button } from "../ui/Button";

const CreatePostModal = dynamic(() => import('../modals/create-post-modal').then(mod => mod.CreatePostModal), {
    loading: () => <Button className="px-3 md:px-6" iconLeft={<PiPlus />}><span className="hidden sm:inline">Post</span></Button>,
    ssr: false
});

export function MobileNav() {
    const { data: session } = useSession();
    const pathname = usePathname();

    if (pathname !== '/login' && pathname !== '/onboarding') {
        return (
            <div className="flex w-full h-21 pt-2 justify-between items-center px-6 border-t gap-3 sm:hidden fixed bottom-0 left-0 right-0 bg-white bg-opacity-95 dark:bg-black dark:border-stroke p-mobile">
                <Link aria-label="Home Button" href={'/'} className='rounded-xl flex items-center justify-center text-3xl transform transition duration-100 ease-in-out active:scale-[110%]'>
                    {pathname === '/' ? <PiHouseFill /> : <PiHouse />}
                </Link>

                <Link aria-label="Search Button" href={'/search'} className='rounded-xl flex items-center justify-center text-3xl transform transition duration-100 ease-in-out active:scale-[110%]'>
                    {pathname === "/search" ? <PiMagnifyingGlassFill /> : <PiMagnifyingGlass />}
                </Link>

                <div className="max-w-fit">
                    <CreatePostModal />
                </div>

                <Link aria-label="Wishlist Button" href={'/wishlist'} className='rounded-xl flex items-center justify-center text-3xl transform transition duration-100 ease-in-out active:scale-[110%]'>
                    {pathname.startsWith("/wishlist") ? <PiBookmarkSimpleFill /> : <PiBookmarkSimple />}
                </Link>

                {session ? (
                    <Link aria-label="Profile Button" href={"/" + session.user.username} className='rounded-xl flex items-center justify-center text-3xl transform transition duration-100 ease-in-out active:scale-[110%]'>
                        <Avatar
                            image={session.user.image}
                            id={session.user.id}
                            username={session.user.username}
                            size={'xs'} />
                    </Link>
                ) : (
                    <Link aria-label="Login Button" href={'/login'} className='rounded-xl flex items-center justify-center text-3xl transform transition duration-100 ease-in-out active:scale-[110%]'>
                        <PiUserPlus />
                    </Link>
                )}
            </div>
        )
    }
}
