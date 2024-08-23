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

interface NotificationCardProps {
    notification: RouterOutputs['notifications']['getNotifications'][number];
    refetch?: () => void;
}

const sendPushNotification = async (subscription: PushSubscription, payload: string) => {
    try {
        const response = await fetch('/api/send-push-notification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subscription,
                payload,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to send push notification');
        }
    } catch (error) {
        console.error('Error sending push notification:', error);
    }
};

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

    const { data: subscriptions } = api.notifications.getSubscriptions.useQuery({
        userId: notification.user?.id ?? '',
    });

    // Send push notification
    const sendNotification = async () => {
        if (subscriptions) {
            const payload = JSON.stringify({
                title: 'outfits.bio',
                body: `${notification.user?.username} ${notification.message}`,
            });

            subscriptions.forEach(async (subscription) => {
                const pushSubscription: PushSubscription = {
                    endpoint: subscription.endpoint,
                    getKey: (name: PushEncryptionKeyName) => {
                        const keys = subscription.keys as Record<string, string>;
                        return new TextEncoder().encode(keys[name] ?? '').buffer;
                    },
                    toJSON: () => ({
                        endpoint: subscription.endpoint,
                        keys: subscription.keys as Record<string, string>
                    }),
                    unsubscribe: async () => false,
                    expirationTime: null,
                    options: {
                        applicationServerKey: null,
                        userVisibleOnly: true
                    }
                };
                await sendPushNotification(pushSubscription, payload);
            });
        }
    };

    sendNotification();

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