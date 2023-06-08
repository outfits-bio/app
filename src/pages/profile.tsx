import { GetServerSideProps } from 'next';
import { getServerAuthSession } from '~/server/auth';

export const Profile = () => {
    return null;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getServerAuthSession(ctx);

    if (!session?.user) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            }
        };
    }

    return {
        redirect: {
            destination: `/${session.user.username}`,
            permanent: false,
        }
    };
}

export default Profile;