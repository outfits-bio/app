"use client";

import { api } from "@/trpc/react";
import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query.hook";

export function NotificationStatusCard() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const subscribeToPushNotifications = api.notifications.subscribeToPushNotifications.useMutation();
    const isDesktop = useMediaQuery("(min-width: 768px)");

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
            setNotificationsEnabled(true);
        } catch (error) {
            console.error('Error subscribing to push notifications:', error);
            setNotificationsEnabled(false);
        }
    };

    const unsubscribeUser = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
                await subscription.unsubscribe();
                await subscribeToPushNotifications.mutateAsync({
                    subscription: {
                        keys: {
                            p256dh: '',
                            auth: ''
                        },
                        endpoint: ''
                    }
                });
                console.log('User unsubscribed');
            }
            setNotificationsEnabled(false);
        } catch (error) {
            console.error('Error unsubscribing from push notifications:', error);
        }
    };

    async function handleNotificationStatus() {
        if (isDesktop) return;

        if (!notificationsEnabled) {
            if (typeof window !== 'undefined' && 'Notification' in window) {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    await navigator.serviceWorker.register('/sw.js');
                    await subscribeUser();
                }
            }
        } else {
            await unsubscribeUser();
        }
    }

    useEffect(() => {
        const checkSubscription = async () => {
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                try {
                    const registration = await navigator.serviceWorker.ready;
                    const subscription = await registration.pushManager.getSubscription();
                    setNotificationsEnabled(!!subscription);
                } catch (error) {
                    console.error('Error checking subscription:', error);
                }
            }
        };

        void checkSubscription();
    }, []);

    return (
        <div className="md:hidden flex flex-col items-start rounded-lg border border-stroke bg-white dark:bg-black">
            <div className="flex-wrap items-start flex gap-24 p-10 self-stretch">
                <div className="flex flex-col items-start gap-3 flex-1">
                    <h1 className="font-clash font-bold text-3xl">Notification Status</h1>
                    <p>Turn on notifications to receive notifications on your mobile device.</p>
                </div>
                <div className={`flex w-[96px] h-[48px] p-2 items-center gap-3 rounded-full border dark:border-stroke ${notificationsEnabled && "bg-orange-accent justify-end"}`} onClick={handleNotificationStatus}>
                    <div className={`w-[32px] h-[32px] flex-shrink-0 bg-black rounded-full ${notificationsEnabled && "bg-white"} dark:bg-white`} />
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 p-6 px-10 self-stretch justify-between border-t rounded-b-lg dark:border-stroke bg-gray-100 dark:bg-neutral-900">
                <p>More settings coming soon...</p>
            </div>
        </div>
    )
}