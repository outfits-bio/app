"use client";

import { api } from '@/trpc/react';
import type { RouterOutputs } from '@/trpc/shared';
import { handleErrors } from '@/utils/handle-errors.util';
import { intlFormatDistance } from 'date-fns';
import Link from 'next/link';
import { PiSpinnerGap, PiX } from 'react-icons/pi';
import { Avatar } from '../ui/Avatar';


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
        case 'OTHER':
            href = `/${notification.link}`;
            break;
        default:
            href = '';
            break;
    }

    const image = notification.user?.image ?? null;

    const ctx = api.useUtils();

    const { mutate, isLoading } = api.notifications.deleteNotification.useMutation({
        onSuccess: () => {
            refetch?.();
            void ctx.notifications.getNotifications.refetch();
        },
        onError: (e) => handleErrors({ e, message: 'Failed to delete notification' })
    });

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
                {notification.type === 'OTHER' && <>
                    <span> {notification.message} </span>
                </>}
                <span><RelativeDate date={notification.createdAt} /></span>
            </span>
        </Link>

        <button className='shrink-0 hover:bg-hover border border-stroke flex items-center justify-center h-8 w-8 rounded-full' disabled={isLoading} onClick={() => mutate({ id: notification.id })}>
            {isLoading ? <PiSpinnerGap className='w-4 h-4 animate-spin' /> : <PiX className='w-4 h-4' />}
        </button>
    </div>
}