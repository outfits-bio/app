import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import superjson from 'superjson';
import { Layout } from '~/components/Layout';
import { ProfileCard } from '~/components/ProfileCard';
import { appRouter } from '~/server/api/root';
import { prisma } from '~/server/db';
import { api } from '~/utils/api';

import { createServerSideHelpers } from '@trpc/react-query/server';

export const ProfilePage = ({ username }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const { push } = useRouter();
    const { data } = useSession();

    const { data: profileData } = api.user.getProfile.useQuery({ username }, { onError: () => push('/') });

    const isCurrentUser = data?.user.username === username ?? false;

    const pageTitle = isCurrentUser ? `profile` : username ?? 'profile';

    return (
        <Layout title={pageTitle}>
            <ProfileCard profileData={profileData} isCurrentUser={isCurrentUser} username={username} />
        </Layout>
    );
};

export const getServerSideProps = async (context: GetServerSidePropsContext<{ username: string }>,
) => {
    const helpers = createServerSideHelpers({
        router: appRouter,
        ctx: { prisma, session: null },
        transformer: superjson, // optional - adds superjson serialization
    });


    const username = context.params?.username?.toString() ?? '';

    const userExists = await helpers.user.getProfile.fetch({ username });

    if (userExists) {
        await helpers.user.getProfile.prefetch({ username });
    } else {
        return {
            notFound: true,
            props: {
                username
            }
        };
    }

    return {
        props: {
            trpcState: helpers.dehydrate(),
            username
        }
    };
}

export default ProfilePage;