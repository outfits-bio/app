"use client";

import { ThemeCard } from "@/app/_components/settings/appearance/theme-card";
import { AccentCard } from "@/app/_components/settings/appearance/accent-card";
import { HidePresenceCard } from "@/app/_components/settings/appearance/hide-presence-card";
import { SettingsSidebar } from "@/app/_components/settings/settings-sidebar";

export default function AppearanceSettingsPage() {
    return (
        <div className="flex">
            <SettingsSidebar />
            <section className="grow flex flex-col gap-4 pt-2 md:pt-4 p-8 h-full">
                <div>
                    <h1 className="font-clash font-bold text-3xl">Appearance</h1>
                    <p>Change the look-and-feel to your preference</p>
                </div>
                <ThemeCard />
                <AccentCard />
                <HidePresenceCard />
            </section>
        </div>
    )
}

