"use client";

import { api } from "~/trpc/react";
import { NotificationCard } from "~/components/notifications/notification-card";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/Button";
import { useSession } from "next-auth/react";

export default function NotificationsPage() {
    const { data: session } = useSession();
    const { data: notifications } = api.notifications.getNotifications.useQuery();
    const [visibleCount, setVisibleCount] = useState(10);

    const loadMoreNotifications = () => {
        setVisibleCount((prev) => prev + 5);
    };

    const filteredNotifications = notifications?.filter(
        notification => notification.user?.id !== session?.user?.id
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
        <div className='w-screen flex h-full justify-center'>
            <div className="flex flex-col w-full sm:w-[400px] gap-2 font-clash py-2">
                {filteredNotifications.slice(0, visibleCount).map((notification, index) => (
                    <NotificationCard key={index} notification={notification} />
                ))}
                <div className='flex flex-col items-center justify-center font-clash py-2'>
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
        </div>
    );
}