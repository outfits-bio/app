import { auth } from "@acme/auth";
import { redirect } from "next/navigation";

import { AvatarCard } from "~/app/settings/profile/avatar-card";
import { DeleteAccountCard } from "~/app/settings/profile/delete-account-card";
import { LinksCard } from "~/app/settings/profile/links-card";
import { TaglineCard } from "~/app/settings/profile/tagline-card";
import { UsernameCard } from "~/app/settings/profile/username-card";
import { SettingsSidebar } from "~/components/settings/settings-sidebar";

export default async function ProfileSettingsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    return (
        <div className="flex">
            <SettingsSidebar />
            <section className="grow flex flex-col gap-4 pt-2 md:pt-4 md:p-8 px-2 py-8 h-full max-w-full">
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

