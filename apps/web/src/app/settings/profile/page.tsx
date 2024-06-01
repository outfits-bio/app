import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

import { AvatarCard } from "@/app/_components/settings/profile/avatar-card";
import { DeleteAccountCard } from "@/app/_components/settings/profile/delete-account-card";
import { LinksCard } from "@/app/_components/settings/profile/links-card";
import { TaglineCard } from "@/app/_components/settings/profile/tagline-card";
import { UsernameCard } from "@/app/_components/settings/profile/username-card";
import { SettingsSidebar } from "@/app/_components/settings/settings-sidebar";

export default async function ProfileSettingsPage() {
    const session = await getServerAuthSession();

    if (!session?.user) {
        redirect('/login');
    }

    return (
        <div className="flex">
            <SettingsSidebar />
            <section className="grow flex flex-col gap-4 pt-2 md:pt-4 p-8 h-full">
                <div>
                    <h1 className="font-clash font-bold text-3xl">Profile</h1>
                    <p>Edit and manage your profile.</p>
                </div>
                <AvatarCard />
                <UsernameCard />
                <TaglineCard />
                <LinksCard />
                <DeleteAccountCard />
            </section>
        </div>
    )
}

