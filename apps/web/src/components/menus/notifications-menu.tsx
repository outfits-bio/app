"use client";

import { api } from "@/trpc/react";
import { Popover, Transition } from '@headlessui/react';
import { useSession } from "next-auth/react";
import { Fragment, useState } from "react";
import { PiBellSimple, PiBellSimpleFill } from "react-icons/pi";
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

        return (
            <Popover className="relative">
                <Popover.Button className="focus:outline-none">
                    <div className="font-semibold font-clash self-stretch h-12 py-2 gap-3 flex items-center border border-stroke hover:bg-hover disabled:bg-hover transform transition duration-100 ease-in-out active:scale-[99%] rounded-full px-2 w-12 justify-center text-2xl">
                        <div className="ui-open:hidden"><PiBellSimple /></div>
                        <div className="ui-not-open:hidden"><PiBellSimpleFill /></div>
                    </div>
                    {hasNotifications ? (
                        <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-error text-white text-[9px] font-bold flex items-center justify-center">
                            {notificationsCount}
                        </div>
                    ) : null}
                </Popover.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Popover.Panel className="absolute right-1 rounded-xl divide-y divide-stroke mt-1 origin-top-right border border-stroke bg-white dark:bg-black shadow-dropdown p-4 divide-none z-10 max-h-[438px] overflow-auto">
                        <div className="flex flex-col w-full sm:w-[400px] gap-2 font-clash py-2">
                            <h1 className="font-bold text-xl pt-0">Your Inbox</h1>
                            {notifications?.slice(0, visibleCount).map((notification, index) => (
                                <NotificationCard key={index} notification={notification} refetch={refetch} />
                            )) ?? <></>}
                            <div className='flex flex-col items-center justify-center font-clash pt-2'>
                                {notifications && notifications.length > visibleCount && (
                                    <Button onClick={loadMoreNotifications} variant="outline">
                                        Load more
                                    </Button>
                                )}
                                {((notifications?.length ?? 0) === 0) && (
                                    <div className='flex flex-col items-center justify-center font-clash py-2'>
                                        <h3 className='text-center'>That&apos;s it, you don&apos;t have any notifications</h3>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Popover.Panel>
                </Transition>
                <Popover.Overlay className="fixed inset-0" />
            </Popover>
        );
    }
}