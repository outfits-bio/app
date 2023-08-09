import { NextPage } from 'next';
import { Layout } from '~/components/Layout';

export const NotificationsPage: NextPage = () => {
    return <Layout
        title="Explore"
    >
        <div className='pb-20 w-screen h-full flex items-center justify-center'>
            <h1 className='font-black font-urbanist text-3xl'>Coming Soon!</h1>
        </div>
    </Layout>
}

export default NotificationsPage;