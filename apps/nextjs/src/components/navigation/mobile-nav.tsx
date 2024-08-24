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
import { api } from "~/trpc/react";
import { useEffect } from "react";
import { useMediaQuery } from "~/hooks/use-media-query.hook";

const CreatePostModal = dynamic(() => import('../modals/create-post-modal').then(mod => mod.CreatePostModal), {
    loading: () => <Button className="px-3 md:px-6" iconLeft={<PiPlus />}><span className="hidden sm:inline">Post</span></Button>,
    ssr: false
});

export function MobileNav() {
    const { data: session } = useSession();
    const pathname = usePathname();

    const subscribeToPushNotifications = api.notifications.subscribeToPushNotifications.useMutation();

    const subscribeUser = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
            });

            const subscriptionData = {
                endpoint: subscription.endpoint,
                keys: {
                    p256dh: subscription.toJSON().keys?.p256dh ?? '',
                    auth: subscription.toJSON().keys?.auth ?? '',
                },
            };

            const result = await subscribeToPushNotifications.mutateAsync({ subscription: subscriptionData });
            console.log('Subscription saved:', result);
        } catch (error) {
            console.error('Error subscribing to push notifications:', error);
        }
    };

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').then(
                function (registration) {
                    console.log('Service worker registration succeeded:', registration);
                },
                function (error) {
                    console.log('Service worker registration failed:', error);
                }
            );
        }
    }, []);

    const isDesktop = useMediaQuery("(min-width: 768px)");

    useEffect(() => {
        if (isDesktop) {
            return;
        }

        else if (session && typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        subscribeUser();
                    }
                });
            } else if (Notification.permission === 'granted') {
                subscribeUser();
            }
        }
    }, [session]);

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
