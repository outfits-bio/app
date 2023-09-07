import Link from "next/link";
import { BaseMenu } from "./BaseMenu";
import { Button } from "../Button";
import { BellSimple, SpinnerGap } from "@phosphor-icons/react";
import { api } from "~/utils/api.util";
import NotificationCard from "../Notification";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface NotificationsMenuProps {
    unreadCount?: number;
}

export const NotificationsMenu = ({ unreadCount }: NotificationsMenuProps) => {

    const ctx = api.useContext();

    const { data: notifications, refetch, isFetching } = api.notifications.getNotifications.useQuery(undefined, {
        onSuccess: () => {
            ctx.notifications.getUnreadNotificationsCount.invalidate();
        },
        enabled: false,
    });

    const hasNotifications = unreadCount && unreadCount > 0;

    return <Menu as="div" className="relative inline-block text-left z-50">
        <div>
            <Menu.Button onClick={() => refetch()}>
                <div className="relative">
                    <Button variant='outline-ghost' shape={'circle'} iconLeft={<BellSimple />} />
                    {hasNotifications ? <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-error text-white text-[9px] font-bold flex items-center justify-center">
                        {unreadCount}
                    </div> : null}
                </div>
            </Menu.Button>
        </div>
        <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
            <Menu.Items className="absolute right-1 rounded-md divide-y divide-stroke mt-1 origin-top-right border border-stroke bg-white dark:bg-black shadow-dropdown p-4 w-[400px] px-4 divide-none">
                {notifications?.length ?? 0 > 0 ?
                    notifications?.map((notification, index) => <NotificationCard refetch={refetch} key={index} notification={notification} />) ?? <></>
                    : <div className='flex flex-col items-center justify-center font-clash py-2'>
                        <h3 className='text-center'>No notifications</h3>
                    </div>}
            </Menu.Items>
        </Transition>
    </Menu >
};