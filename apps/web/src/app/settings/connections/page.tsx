"use client";

import { SettingsCard } from "@/app/_components/settings/settings-card";
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
                <SettingsCard />
            </section>
        </div>
    )
}

