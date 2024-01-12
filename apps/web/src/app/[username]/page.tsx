import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { Posts } from "../_components/profile/posts";
import { notFound } from "next/navigation";

export default async function ProfilePage({ params }: { params: { username: string } }) {
    try {
        const session = await getServerAuthSession();
        const profileData = await api.user.getProfile.query({ username: params.username });

        return <div className='flex flex-col md:flex-row w-screen h-full gap-4 pr-4 md:gap-20 lg:gap-36  overflow-y-scroll md:overflow-y-auto'>
            {/* <ProfileCard profileData={profileData} username={params.username} isCurrentUser={session?.user.id === profileData.id} /> */}

            <Posts profileData={profileData} />
        </div>
    } catch (error) {
        notFound();

    }
}