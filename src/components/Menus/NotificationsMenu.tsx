import Link from "next/link";
import { BaseMenu } from "./BaseMenu";
import { Button } from "../Button";
import { BellSimple } from "@phosphor-icons/react";
import { api } from "~/utils/api.util";
import NotificationCard from "../Notification";

interface NotificationsMenuProps {
    unreadCount?: number;
}

export const NotificationsMenu = ({ unreadCount }: NotificationsMenuProps) => {

    const ctx = api.useContext();

    const { data: notifications, isLoading } = api.notifications.getNotifications.useQuery(undefined, {
        onSuccess: () => {
            ctx.notifications.getUnreadNotificationsCount.invalidate();
        }
    });

    const hasNotifications = unreadCount && unreadCount > 0;

    return <BaseMenu button={<div className="relative">
        <Button variant='outline-ghost' shape={'circle'} iconLeft={<BellSimple />} />
        {hasNotifications ? <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-error text-white text-[9px] font-bold flex items-center justify-center">
            {unreadCount}
        </div> : null}
    </div>} className="w-[400px] px-4 divide-none">
        {notifications?.length ?? 0 > 0 ?
            notifications?.map((notification, index) => <NotificationCard key={index} notification={notification} />) ?? <></>
            : <div className='flex flex-col items-center justify-center font-clash py-2'>
                <h3 className='text-center'>No notifications</h3>
            </div>}
    </BaseMenu>;
};