"use server";

import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import { Posts } from "~/components/profile/posts";
import { ProfileCard } from "~/components/profile/profile-section";
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
    try {
        const profileData = await api.user.getProfile({ username: params.username });
        return {
            title: `${profileData.username}`,
            description: profileData.tagline || `Check out ${profileData.username}'s profile on outfits.bio`,
            openGraph: {
                images: [`/api/og/${params.username}`],
            },
            twitter: {
                card: 'summary_large_image',
                images: [`/api/og/${params.username}`],
            },
        };
    } catch (error) {
        return {};
    }
}

export default async function ProfilePage({ params }: { params: { username: string } }) {
    try {
        const profileData = await api.user.getProfile({ username: params.username });

        return <div className='flex flex-col md:flex-row w-screen h-full gap-4 pr-4 md:gap-20 lg:gap-36 overflow-y-scroll md:overflow-y-auto'>
            <ProfileCard profileData={profileData} username={params.username} />

            <Posts username={params.username} />
        </div>
    } catch (error) {
        notFound();
    }
}