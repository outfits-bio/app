import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { api } from "@/trpc/server";
import { AvatarCard } from "./avatar-card";
import { DeleteAccountCard } from "./delete-account-card";
import { LinksCard } from "./links-card";
import { TaglineCard } from "./tagline-card";
import { UsernameCard } from "./username-card";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { memo } from 'react';

const MemoizedDeleteAccountCard = memo(DeleteAccountCard);

export default async function ProfileSettingsPage() {
    const session = await getServerAuthSession();

    if (!session?.user) {
        redirect('/login');
    }
    const userData = await api.user.getMe();
    const tagline = await api.user.getProfile({ username: session.user.username ?? '' });

    return (
        <div className="flex">
            <SettingsSidebar />
            <section className="grow flex flex-col gap-4 pt-2 md:pt-4 md:p-8 px-2 py-8 h-full max-w-full">
                <div>
                    <h1 className="font-clash font-bold text-3xl">Profile</h1>
                    <p>Edit and manage your profile.</p>
                </div>
                <AvatarCard session={session} />
                <UsernameCard session={session} />
                <TaglineCard session={session} />
                <LinksCard />
                <MemoizedDeleteAccountCard />
            </section>
        </div>
    )
}
