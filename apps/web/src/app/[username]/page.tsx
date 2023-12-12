"use client";

import { PostType } from 'database';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Layout } from '~/components/Layout';
import { PostSection } from '~/components/PostSection';
import { ProfileCard } from '~/components/ProfileCard';
import { ProfilePost, ProfilePostModal } from '~/components/ProfilePostModal';
import { api } from '~/components/TRPCWrapper';
import { handleErrors } from '~/utils/handle-errors.util';


export const ProfilePage = () => {
    const { push } = useRouter();
    const username = useParams().username as string;
    const params = useSearchParams();
    const { data, status } = useSession();

    const [postModalOpen, setPostModalOpen] = useState<boolean>(false);
    const [post, setPost] = useState<ProfilePost | null>(null);

    const { data: profileData, isLoading } = api.user.getProfile.useQuery({ username }, { onError: (e) => handleErrors({ e, message: "Failed to get user!", fn: () => push(`/${username}/not-found`) }), retry: 0 });

    const { data: postsData, isLoading: postsLoading } = api.post.getPostsAllTypes.useQuery({
        id: profileData?.id ?? ''
    }, { retry: 0, enabled: !!profileData?.id, refetchOnMount: false, refetchOnWindowFocus: false, onError: (e) => handleErrors({ e, message: "Failed to get posts!", fn: () => push('/') }) });

    useEffect(() => {
        if (params.has('postId')) {
            const post = postsData?.find(p => p.id === params.get('postId'));

            if (post) {
                setPost(post);
                setPostModalOpen(true);
            }
        } else {
            setPost(null);
            setPostModalOpen(false);
        }
    }, [params, postsData]);

    const isCurrentUser = data?.user.username === username ?? false;

    const pageTitle = isCurrentUser ? `profile` : username ?? 'profile';

    return (
        <Layout title={pageTitle}>
            {postModalOpen && <ProfilePostModal setPostModalOpen={setPostModalOpen} post={post} user={profileData ?? null} />}
            <div className='flex flex-col md:flex-row w-screen h-full gap-4 pr-4 md:gap-20 lg:gap-36  overflow-y-scroll md:overflow-y-auto'>
                <ProfileCard loading={isLoading} authStatus={status} currentUser={data?.user ?? null} profileData={profileData} username={username} isCurrentUser={isCurrentUser} />

                <div className='md:overflow-y-scroll w-full pl-4 md:pl-0 py-4'>
                    <PostSection loading={postsLoading} profileData={profileData} postsData={postsData} type={PostType.OUTFIT} />
                    <PostSection loading={postsLoading} profileData={profileData} postsData={postsData} type={PostType.HOODIE} />
                    <PostSection loading={postsLoading} profileData={profileData} postsData={postsData} type={PostType.SHIRT} />
                    <PostSection loading={postsLoading} profileData={profileData} postsData={postsData} type={PostType.PANTS} />
                    <PostSection loading={postsLoading} profileData={profileData} postsData={postsData} type={PostType.SHOES} />
                    <PostSection loading={postsLoading} profileData={profileData} postsData={postsData} type={PostType.WATCH} />
                    <PostSection loading={postsLoading} profileData={profileData} postsData={postsData} type={PostType.JEWELRY} />
                    <PostSection loading={postsLoading} profileData={profileData} postsData={postsData} type={PostType.HEADWEAR} />
                    <PostSection loading={postsLoading} profileData={profileData} postsData={postsData} type={PostType.GLASSES} />
                </div>
            </div>
        </Layout>
    );
};

export default ProfilePage;