"use client";

import { api } from "~/trpc/react";
import { NotificationCard } from "~/components/notifications/notification-card";
import { useState } from "react";
import { Button } from "~/components/ui/Button";

export default function NotificationsPage() {
    const { data: notifications } = api.notifications.getNotifications.useQuery();

    const [visibleCount, setVisibleCount] = useState(10);

    const loadMoreNotifications = () => {
        setVisibleCount((prev) => prev + 5);
    };

    return (
        <div className='w-screen flex h-full justify-center'>
            <div className="flex flex-col w-full sm:w-[400px] gap-2 font-clash py-2">
                {notifications ? (
                    notifications.slice(0, visibleCount).map((notification, index) => (
                        <NotificationCard key={index} notification={notification} />
                    ))
                ) : (
                    <></>
                )}
                <div className='flex flex-col items-center justify-center font-clash py-2'>
                    {notifications && notifications.length > visibleCount && (
                        <Button onClick={loadMoreNotifications} variant="outline">
                            Load more
                        </Button>
                    )}
                    {notifications?.length === 0 && (
                        <div className='flex flex-col items-center justify-center font-clash py-2'>
                            <h3 className='text-center'>That&apos;s it, you don&apos;t have any notifications</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}