import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { Posts } from "../_components/profile/posts";
import { ProfileCard } from "../_components/profile/profile-section";

export default async function ProfilePage({ params }: { params: { username: string } }) {
    try {
        const profileData = await api.user.getProfile.query({ username: params.username });

        return <div className='flex flex-col md:flex-row w-screen h-full gap-4 pr-4 md:gap-20 lg:gap-36  overflow-y-scroll md:overflow-y-auto'>
            <ProfileCard profileData={profileData} username={params.username} />

            <Posts profileData={profileData} />
        </div>
    } catch (error) {
        notFound();

    }
}