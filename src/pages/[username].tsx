import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import superjson from 'superjson';
import { Layout } from '~/components/Layout';
import { PostSection } from '~/components/PostSection';
import { ProfileCard } from '~/components/ProfileCard';
import { appRouter } from '~/server/api/root';
import { prisma } from '~/server/db';
import { api } from '~/utils/api';

import { PostType } from '@prisma/client';
import { createServerSideHelpers } from '@trpc/react-query/server';

export const ProfilePage = ({ username }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const { push } = useRouter();
    const { data } = useSession();

    const { data: profileData } = api.user.getProfile.useQuery({ username }, { onError: () => push('/') });

    const { data: postsData, refetch } = api.post.getPostsAllTypes.useQuery({
        id: profileData?.id ?? ''
    }, { retry: 0, enabled: !!profileData?.id });

    const isCurrentUser = data?.user.username === username ?? false;

    const pageTitle = isCurrentUser ? `profile` : username ?? 'profile';

    return (
        <Layout title={pageTitle}>
            <ProfileCard profileData={profileData} isCurrentUser={isCurrentUser} username={username} />
            <PostSection key={PostType.OUTFIT} type={PostType.OUTFIT} profileData={profileData} postsData={postsData} />
            <PostSection key={PostType.HOODIE} type={PostType.HOODIE} profileData={profileData} postsData={postsData} />
            <PostSection key={PostType.SHIRT} type={PostType.SHIRT} profileData={profileData} postsData={postsData} />
            <PostSection key={PostType.PANTS} type={PostType.PANTS} profileData={profileData} postsData={postsData} />
            <PostSection key={PostType.SHOES} type={PostType.SHOES} profileData={profileData} postsData={postsData} />
            <PostSection key={PostType.WATCH} type={PostType.WATCH} profileData={profileData} postsData={postsData} />

            <div className='h-10'></div>
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

    const userExists = await helpers.user.profileExists.fetch({ username });

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