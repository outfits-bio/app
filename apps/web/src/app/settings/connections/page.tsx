"use client";

import { GoogleCard } from "@/app/_components/settings/connections/google-card";
import { DiscordCard } from "@/app/_components/settings/connections/discord-card";
import { SpotifyStatusCard } from "@/app/_components/settings/connections/spotify-status-card";
import { SettingsSidebar } from "@/app/_components/settings/settings-sidebar";

export default function AppearanceSettingsPage() {
    return (
        <div className="flex h-full">
            <SettingsSidebar />
            <section className="grow flex flex-col gap-4 pt-2 md:pt-4 bg-gray-100 p-8">
                <div>
                    <h1 className="font-clash font-bold text-3xl">Connections</h1>
                    <p>Manage your connections and plugins</p>
                </div>
                <GoogleCard />
                <DiscordCard />
                <SpotifyStatusCard />
            </section>
        </div>
    )
}

