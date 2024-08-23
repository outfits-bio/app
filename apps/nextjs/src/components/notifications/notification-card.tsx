"use client";

import { api } from '~/trpc/react';
import type { RouterOutputs } from '@acme/api';
import { handleErrors } from '@acme/utils/handle-errors.util';
import { intlFormatDistance } from 'date-fns';
import Link from 'next/link';
import { PiSpinnerGap, PiX } from 'react-icons/pi';
import { Avatar } from '../ui/Avatar';
import { useSession } from "next-auth/react";
import { urlBase64ToUint8Array } from '~/utils/base64-utils';
import { useEffect } from 'react';

interface NotificationCardProps {
    notification: RouterOutputs['notifications']['getNotifications'][number];
    refetch?: () => void;
}

const RelativeDate = ({ date }: { date: Date }) => {
    const timeString = intlFormatDistance(date, Date.now(), {
        style: 'narrow',
        locale: 'en',
    });

    return <>{timeString}</>
}

export function NotificationCard({ notification, refetch }: NotificationCardProps) {
    const { data: session } = useSession();

    if (session?.user?.id === notification.user?.id) {
        return null;
    }

    let href: string;

    switch (notification.type) {
        case 'PROFILE_LIKE':
            href = `/${notification.user?.username}`;
            break;
        case 'POST_LIKE':
            href = `/${notification.user?.username}`;
            break;
        case 'POST_REACTION':
            href = `/${notification.user?.username}`;
            break;
        case 'POST_WISHLIST':
            href = `/${notification.user?.username}`;
            break;
        case 'OTHER':
            href = `/${notification.link}`;
            break;
        default:
            href = '';
            break;
    }

    const image = notification.user?.image ?? null;

    const ctx = api.useUtils();

    const { mutate, isPending } = api.notifications.deleteNotification.useMutation({
        onSuccess: () => {
            refetch?.();
            void ctx.notifications.getNotifications.refetch();
        },
        onError: (e) => handleErrors({ e, message: 'Failed to delete notification' })
    });

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

    const sendNotification = api.notifications.sendPushNotification.useMutation();

    const handleSendNotification = () => {
        if (notification.user?.id) {
            sendNotification.mutate({
                userId: notification.user.id,
                title: 'outfits.bio',
                body: `${notification.user?.username} ${notification.message}`,
            });
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
        if (session && typeof window !== 'undefined' && 'Notification' in window) {
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

    return <div className='w-full rounded-xl px-4 py-2 flex items-center justify-between hover:bg-white dark:hover:bg-black'>
        <Link href={href} className='flex items-center gap-3'>
            <Avatar className='shrink-0' size={'xs'} image={image} username={notification.user?.username} id={notification.user?.id} />
            <span className='font-medium'>
                {notification.type === 'PROFILE_LIKE' && <>
                    <span className="font-bold">{notification.user?.username}</span>
                    <span> liked your profile </span>
                </>}
                {notification.type === 'POST_LIKE' && <>
                    <span className="font-bold">{notification.user?.username}</span>
                    <span> liked your post </span>
                </>}
                {notification.type === 'POST_REACTION' && <>
                    <span className="font-bold">{notification.user?.username}</span>
                    <span> reacted to your post with {notification.message}</span>
                </>}
                {notification.type === 'POST_WISHLIST' && <>
                    <span className="font-bold">{notification.user?.username}</span>
                    <span> added your post to their wishlist </span>
                </>}
                {notification.type === 'POST_COMMENT' && <>
                    <span className="font-bold">{notification.user?.username}</span>
                    <span> left a comment on your post </span>
                </>}
                {notification.type === 'OTHER' && <>
                    <span> {notification.message} </span>
                </>}
                <span><RelativeDate date={notification.createdAt} /></span>
            </span>
        </Link>

        <button className='shrink-0 hover:bg-hover border border-stroke flex items-center justify-center h-8 w-8 rounded-full' disabled={isPending} onClick={() => mutate({ id: notification.id })}>
            {isPending ? <PiSpinnerGap className='w-4 h-4 animate-spin' /> : <PiX className='w-4 h-4' />}
        </button>
    </div>
}