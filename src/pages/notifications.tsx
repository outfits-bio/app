import { NextPage } from 'next';
import { Layout } from '~/components/Layout';
import NotificationCard from '~/components/Notification';
import { api } from '~/utils/api.util';



export const NotificationsPage: NextPage = () => {
    const { data: notifications } = api.notifications.getNotifications.useQuery();

    return <Layout
        title="notifications"
    >
        <div className='w-screen flex h-full justify-center'>
            <div className="flex flex-col w-full sm:w-[400px] gap-2 font-clash py-2">
                {notifications?.map((notification, index) => <NotificationCard key={index} notification={notification} />) ?? <></>}
                <div className='flex flex-col items-center justify-center font-clash py-2'>
                {((notifications?.length ?? 0) > 0) ?
                    notifications?.map((notification, index) => <NotificationCard refetch={refetch} key={index} notification={notification} />) ?? <></>
                    : <div className='flex flex-col items-center justify-center font-clash py-2'>
                        <h3 className='text-center'>That's it, you don't have any notifications</h3>
                    </div>
                }
                </div>
            </div>
        </div>
    </Layout>
}

export default NotificationsPage;