"use client";

import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PiBellSimple, PiBellSimpleFill, PiCompass, PiDresser, PiPlus } from "react-icons/pi";
import { NavbarMenu } from "../menus/navbar-menu";
import dynamic from 'next/dynamic';
import { Button } from "../ui/Button";

const CreatePostModal = dynamic(() => import('../modals/create-post-modal').then(mod => mod.CreatePostModal), {
    loading: () => <Button className="px-3 md:px-6" iconLeft={<PiPlus />}><span className="hidden sm:inline">Post</span></Button>,
    ssr: false
});

const NotificationsMenu = dynamic(() => import('../menus/notifications-menu').then(mod => mod.NotificationsMenu), {
    loading: () => <div className="font-semibold font-clash self-stretch h-12 py-2 gap-3 flex items-center border border-stroke hover:bg-hover disabled:bg-hover transform transition duration-100 ease-in-out active:scale-[99%] rounded-full px-2 w-12 justify-center text-2xl"><div><PiBellSimple /></div></div>,
    ssr: false
});

export function AuthSection() {
    const { data: session } = useSession();
    const pathname = usePathname();

    const iconComponent = pathname === "/notifications" ? <PiBellSimpleFill className="h-5 w-5" /> : <PiBellSimple className="h-5 w-5" />;

    if (session && session.user) {
        const { data: notificationsCount } = api.notifications.getUnreadNotificationsCount.useQuery(undefined, { enabled: !!session });
        const hasNotifications = notificationsCount && notificationsCount > 0;

        return <>
            <div className="hidden md:flex items-center justify-center gap-4">
                <div>
                    <CreatePostModal />
                </div>

                {pathname !== '/' && <Link href='/'>
                    <Button variant={'outline-ghost'} shape={'square'} iconLeft={<PiCompass />} />
                </Link>}

                <Link href='/generate'>
                    <Button variant={'outline-ghost'} shape={'square'} iconLeft={<PiDresser />}>
                        {/* className="text-nowrap w-fit px-4" */}
                        {/* Generate */}
                    </Button>
                </Link>

                <NotificationsMenu />
                <NavbarMenu />
            </div>

            <Link aria-label="Notifications Link" href='/notifications' className='md:hidden relative'>
                <Button className="h-8 w-8" variant='outline-ghost' shape={'circle'} iconLeft={iconComponent} aria-label="Notifications Button" />
                {hasNotifications ? <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-error text-white text-[9px] font-bold flex items-center justify-center">
                    {notificationsCount}
                </div> : null}
            </Link>
        </>;
    }
    return <div className='items-center gap-4 hidden md:flex'>
        {pathname !== '/' && (
            <Link href='/'>
                <Button variant='outline-ghost' iconLeft={<PiCompass />}>Discover</Button>
            </Link>
        )}

        {pathname !== '/login' && (
            <>
                <Link href='/login'>
                    <Button variant='outline'>Login</Button>
                </Link>
                <Link href='/login'>
                    <Button variant='primary'>Create your profile</Button>
                </Link>
            </>
        )}
    </div>;
}