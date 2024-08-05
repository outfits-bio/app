"use client";

import { api } from "~/trpc/react";
import type { RouterOutputs } from "@acme/api";
import { handleErrors } from "@acme/utils/handle-errors.util";
import { PostType } from "@acme/db";
import { useRouter } from "next/navigation";
import { PostSection } from "./post-section";

export function Posts({ profileData }: { profileData: RouterOutputs['user']['getProfile'] }) {
    const router = useRouter();

    const { data: postsData, isLoading: postsLoading } = api.post.getPostsAllTypes.useQuery(
        {
            id: profileData?.id ?? ''
        },
        {
            retry: 0,
            enabled: !!profileData?.id,
            refetchOnMount: false,
            refetchOnWindowFocus: false
        }
    );

    return <div className='md:overflow-y-scroll w-full pl-4 md:pl-0 py-4'>
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
}