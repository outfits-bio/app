"use client";

import { api } from "~/trpc/react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { PiBellSimple } from "react-icons/pi";
import { NotificationCard } from "../notifications/notification-card";
import { Button } from "../ui/Button";

export function NotificationsMenu() {
    const { data: session } = useSession();
    const [visibleCount, setVisibleCount] = useState(5);

    if (session && session.user) {
        const { data: notifications, refetch } = api.notifications.getNotifications.useQuery();
        const { data: notificationsCount } = api.notifications.getUnreadNotificationsCount.useQuery(undefined, { enabled: !!session });
        const hasNotifications = notificationsCount && notificationsCount > 0;

        const loadMoreNotifications = () => {
            setVisibleCount((prev) => prev + 5);
        };

        const filteredNotifications = notifications?.filter(
            notification => notification.user?.id !== session.user.id
        ) ?? [];

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
                navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(
                    function (registration) {
                        console.log('Service worker registration succeeded:', registration);
                    },
                    function (error) {
                        console.log('Service worker registration failed:', error);
                    }
                );
            }
        }, []);

        useEffect(() => {
            if (session) {
                if (Notification.permission === 'default') {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            subscribeUser();
                        }
                    });
                } else if (Notification.permission === 'granted') {
                    subscribeUser();
                }
            } else return;
        }, []);

        return (
            <Popover>
                <PopoverTrigger className="focus:outline-none w-fit h-fit relative">
                    <div className="font-semibold font-clash self-stretch h-12 py-2 gap-3 flex items-center border border-stroke hover:bg-hover disabled:bg-hover transform transition duration-100 ease-in-out active:scale-[99%] rounded-full px-2 w-12 justify-center text-2xl">
                        <div><PiBellSimple /></div>
                    </div>
                    {hasNotifications ? (
                        <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-error text-white text-[9px] font-bold flex items-center justify-center translate-x-1/4 translate-y-1/4">
                            {notificationsCount}
                        </div>
                    ) : null}
                </PopoverTrigger>
                <PopoverContent className="min-w-fit absolute right-1 rounded-xl divide-stroke mt-1 border border-stroke shadow-dropdown p-4 max-h-[438px] overflow-auto">
                    <div className="flex flex-col w-full sm:w-[400px] gap-2 font-clash py-2">
                        <h1 className="font-bold text-xl pt-0">Your Inbox</h1>
                        {filteredNotifications.slice(0, visibleCount).map((notification, index) => (
                            <NotificationCard key={index} notification={notification} refetch={refetch} />
                        )) ?? <></>}
                        <div className='flex flex-col items-center justify-center font-clash pt-2'>
                            {filteredNotifications.length > visibleCount && (
                                <Button onClick={loadMoreNotifications} variant="outline">
                                    Load more
                                </Button>
                            )}
                            {filteredNotifications.length === 0 && (
                                <div className='flex flex-col items-center justify-center font-clash py-2'>
                                    <h3 className='text-center'>That&apos;s it, you don&apos;t have any notifications</h3>
                                </div>
                            )}
                        </div>
                    </div>
                </PopoverContent>
                {/* <Popover.Overlay className="fixed inset-0" /> */}
            </Popover>
        );
    }
}