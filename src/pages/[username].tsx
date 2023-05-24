import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Layout } from '~/components/Layout';

export const ProfilePage: NextPage = () => {
    const { query } = useRouter();
    const { data } = useSession();

    const pageTitle = data && data.user.username === query.username?.toString() ? `profile` : query.username?.toString() ?? 'profile';

    return (
        <Layout title={pageTitle}>
            Profile
        </Layout>
    );
};

export default ProfilePage;