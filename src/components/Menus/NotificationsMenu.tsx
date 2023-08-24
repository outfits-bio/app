import Link from "next/link";
import { BaseMenu } from "./BaseMenu";
import { Button } from "../Button";
import { BellSimple } from "@phosphor-icons/react";
import { api } from "~/utils/api.util";
import NotificationCard from "../Notification";

export const NotificationsMenu = () => {
    const { data: notifications, isLoading } = api.notifications.getNotifications.useQuery();

    return <BaseMenu button={<Button variant='outline-ghost' shape={'circle'} iconLeft={<BellSimple />} />} className="w-[400px] px-4 divide-none">
        {notifications?.length ?? 0 > 0 ?
            notifications?.map((notification, index) => <NotificationCard key={index} notification={notification} />) ?? <></>
            : <div className='flex flex-col items-center justify-center font-urbanist py-2'>
                <h3 className='text-center'>No notifications</h3>
            </div>}
    </BaseMenu>;
};