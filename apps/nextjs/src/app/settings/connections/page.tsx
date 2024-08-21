import { auth } from "@acme/auth";
import { redirect } from "next/navigation";
import { AuthButtons } from "~/components/settings/auth-buttons";

import { DiscordCard } from "~/components/settings/connections/discord-card";
import { GoogleCard } from "~/components/settings/connections/google-card";
import { SpotifyStatusCard } from "~/components/settings/connections/spotify-status-card";
import { SettingsSidebar } from "~/components/settings/settings-sidebar";

export default async function ConnectionsSettingsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    return (
        <div className="flex">
            <SettingsSidebar />
            <section className="grow flex flex-col gap-4 pt-2 md:pt-4 md:p-8 px-2 py-8 h-full max-w-full">
                <div>
                    <h1 className="font-clash font-bold text-3xl">Connections</h1>
                    <p>Manage your connections and plugins</p>
                </div>
                <GoogleCard>
                    <AuthButtons provider="google" />
                </GoogleCard>
                <DiscordCard>
                    <AuthButtons provider="discord" />
                </DiscordCard>
                <SpotifyStatusCard />
            </section>
        </div>
    )
}

