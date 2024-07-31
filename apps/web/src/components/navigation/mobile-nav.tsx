"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";

import {
    PiBookmarkSimple,
    PiBookmarkSimpleFill,
    PiHouse, PiHouseFill, PiMagnifyingGlass, PiMagnifyingGlassFill, PiPlus, PiUserPlus
} from 'react-icons/pi';

import { usePathname } from "next/navigation";

export function MobileNav() {
    const { data: session } = useSession();
    const pathname = usePathname();

    if (pathname !== '/login' && pathname !== '/onboarding') {
        return (
            <div className="flex w-full h-21 justify-between items-center px-6 border-t gap-3 sm:hidden fixed bottom-0 left-0 right-0 bg-white bg-opacity-95 dark:bg-black dark:border-stroke mobilenav">
                <Link href={'/'} className='rounded-xl flex items-center justify-center text-3xl transform transition duration-100 ease-in-out active:scale-[110%]'>
                    {pathname === '/' ? <PiHouseFill /> : <PiHouse />}
                </Link>

                <Link href={'/search'} className='rounded-xl flex items-center justify-center text-3xl transform transition duration-100 ease-in-out active:scale-[110%]'>
                    {pathname === "/search" ? <PiMagnifyingGlassFill /> : <PiMagnifyingGlass />}
                </Link>

                <Link href={'/post'} className='rounded-xl flex flex-col items-center justify-center text-2xl'>
                    <Button shape={'square'} variant={'outline-ghost'} accent>
                        <PiPlus />
                    </Button>
                </Link>

                <Link href={'/wishlist'} className='rounded-xl flex items-center justify-center text-3xl transform transition duration-100 ease-in-out active:scale-[110%]'>
                    {pathname.startsWith("/wishlist") ? <PiBookmarkSimpleFill /> : <PiBookmarkSimple />}
                </Link>

                {session ? (
                    <Link href={"/" + session.user.username} className='rounded-xl flex items-center justify-center text-3xl transform transition duration-100 ease-in-out active:scale-[110%]'>
                        <Avatar
                            image={session.user.image}
                            id={session.user.id}
                            username={session.user.username}
                            size={'xs'} />
                    </Link>
                ) : (
                    <Link href={'/login'} className='rounded-xl flex items-center justify-center text-3xl transform transition duration-100 ease-in-out active:scale-[110%]'>
                        <PiUserPlus />
                    </Link>
                )}
            </div>
        )
    }
}
