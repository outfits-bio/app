import { GetStaticProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { Layout } from '~/components/Layout';
import { PostSection } from '~/components/PostSection';
import { ProfileCard } from '~/components/ProfileCard';
import { generateSSGHelper } from '~/server/utils/ssg.util';
import { api } from '~/utils/api.util';
import { handleErrors } from '~/utils/handle-errors.util';

import { PostType } from '@prisma/client';

export const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
    const { push } = useRouter();
    const { data, status } = useSession();

    const { data: profileData, isLoading } = api.user.getProfile.useQuery({ username }, { onError: (e) => handleErrors({ e, message: "Failed to get user!", fn: () => push('/') }), retry: 0 });

    const { data: postsData, isLoading: postsLoading } = api.post.getPostsAllTypes.useQuery({
        id: profileData?.id ?? ''
    }, { retry: 0, enabled: !!profileData?.id, refetchOnMount: false, refetchOnWindowFocus: false, onError: (e) => handleErrors({ e, message: "Failed to get posts!", fn: () => push('/') }) });

    const isCurrentUser = data?.user.username === username ?? false;

    const pageTitle = isCurrentUser ? `profile` : username ?? 'profile';

    return (
        <Layout title={pageTitle}>
            <div className='flex flex-col md:flex-row w-screen h-full gap-4 p-4 md:gap-12 md:p-12 overflow-y-scroll md:overflow-y-auto'>
                <ProfileCard loading={isLoading} authStatus={status} currentUser={data?.user ?? null} profileData={profileData} username={username} isCurrentUser={isCurrentUser} />

                <div className='md:overflow-y-scroll w-full'>
                    <PostSection loading={postsLoading} profileData={profileData} postsData={postsData} type={PostType.OUTFIT} />
                    <PostSection loading={postsLoading} profileData={profileData} postsData={postsData} type={PostType.HOODIE} />
                    <PostSection loading={postsLoading} profileData={profileData} postsData={postsData} type={PostType.PANTS} />
                    <PostSection loading={postsLoading} profileData={profileData} postsData={postsData} type={PostType.SHIRT} />
                    <PostSection loading={postsLoading} profileData={profileData} postsData={postsData} type={PostType.SHOES} />
                    <PostSection loading={postsLoading} profileData={profileData} postsData={postsData} type={PostType.WATCH} />
                </div>

            </div>
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = async (context) => {
    const ssg = generateSSGHelper();

    const username = context.params?.username?.toString();

    if (!username) return {
        notFound: true,
        props: {}
    }

    try {
        await ssg.user.getProfile.prefetch({ username });

        return {
            props: {
                username,
                trpcState: ssg.dehydrate(),
            },
        }
    } catch (error) {
        return {
            props: {
                username,
            },
        }
    }
}

export const getStaticPaths = () => {
    return { paths: [], fallback: "blocking" };
}

export default ProfilePage;