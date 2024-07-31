"use client";

import { api } from "@/trpc/react";
import { NotificationCard } from "@/components/notifications/notification-card";

export default function NotificationsPage() {
    const { data: notifications, refetch } = api.notifications.getNotifications.useQuery();

    return <div className='w-screen flex h-full justify-center'>
        <div className="flex flex-col w-full sm:w-[400px] gap-2 font-clash py-2">
            {notifications?.map((notification, index) => <NotificationCard key={index} notification={notification} />) ?? <></>}
            <div className='flex flex-col items-center justify-center font-clash py-2'>
                {((notifications?.length ?? 0) > 0) ?
                    notifications?.map((notification, index) => <NotificationCard refetch={refetch} key={index} notification={notification} />) ?? <></>
                    : <div className='flex flex-col items-center justify-center font-clash py-2'>
                        <h3 className='text-center'>That&apos;s it, you don&apos;t have any notifications</h3>
                    </div>
                }
            </div>
        </div>
    </div>
}