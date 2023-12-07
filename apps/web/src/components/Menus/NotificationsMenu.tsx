import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { PiBellSimple } from "react-icons/pi";
import { Button } from "../Button";
import NotificationCard from "../Notification";
import { api } from "~/utils/api.util";

interface NotificationsMenuProps {
    unreadCount?: number;
}

export const NotificationsMenu = ({ unreadCount }: NotificationsMenuProps) => {
    const [visibleNotifications, setVisibleNotifications] = useState(5);

    const ctx = api.useContext();

    const { data: notifications, refetch } = api.notifications.getNotifications.useQuery(undefined, {
        onSuccess: () => {
            ctx.notifications.getUnreadNotificationsCount.refetch();
        },
        enabled: false,
    });

    const { mutate: deleteAllNotifications, isLoading: deleteAllNotificationsLoading } = api.notifications.deleteAllNotifications.useMutation({
        onSuccess: async () => {
            refetch();
            await ctx.notifications.getUnreadNotificationsCount.refetch();
        },
    });

    const hasNotifications = unreadCount && unreadCount > 0;

    const handleLoadMore = () => {
        setVisibleNotifications((prevCount) => prevCount + 5);
    };

    return (
        <Menu as="div" className="relative inline-block text-left z-50 overflow-y">
            <div>
                <Menu.Button onClick={() => refetch()}>
                    <div className="relative">
                        <Button variant='outline-ghost' shape={'circle'} iconLeft={<PiBellSimple />} />
                        {hasNotifications ? (
                            <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-error text-white text-[9px] font-bold flex items-center justify-center">
                                {unreadCount}
                            </div>
                        ) : null}
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
                <Menu.Items className="absolute right-1 rounded-md divide-y divide-stroke mt-1 origin-top-right border border-stroke bg-white dark:bg-black shadow-dropdown p-4 w-[400px] divide-none">
                    {((notifications?.length ?? 0) > 0) ? (
                        <>
                            {notifications?.slice(0, visibleNotifications).map((notification, index) => (
                                <NotificationCard refetch={refetch} key={index} notification={notification} />
                            ))}
                            {(notifications?.length ?? 0) > visibleNotifications && (
                                <Button
                                    variant={'outline-ghost'}
                                    centerItems
                                    className="text-secondary-text text-sm h-10"
                                    onClick={handleLoadMore}
                                >
                                    Load More
                                </Button>
                            )}
                        </>
                    ) : (
                        <div className='flex flex-col items-center justify-center font-clash py-2'>
                            <h3 className='text-center'>No notifications</h3>
                        </div>
                    )}
                    {!!notifications?.length && (
                        <Button
                            variant={'outline-ghost'}
                            centerItems
                            className="text-secondary-text text-sm h-10"
                            onClick={() => deleteAllNotifications()}
                            isLoading={deleteAllNotificationsLoading}
                        >
                            Dismiss all Notifications
                        </Button>
                    )}
                </Menu.Items>
            </Transition>
        </Menu>
    );
};