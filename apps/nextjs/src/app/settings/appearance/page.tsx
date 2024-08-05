import { auth } from "@acme/auth";
import { redirect } from "next/navigation";

import { AccentCard } from "~/components/settings/appearance/accent-card";
import { ThemeCard } from "~/components/settings/appearance/theme-card";
import { SettingsSidebar } from "~/components/settings/settings-sidebar";

export default async function AppearanceSettingsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    return (
        <div className="flex">
            <SettingsSidebar />
            <section className="grow flex flex-col gap-4 pt-2 md:pt-4 p-8 h-full max-w-full">
                <div>
                    <h1 className="font-clash font-bold text-3xl">Appearance</h1>
                    <p>Change the look-and-feel to your preference</p>
                </div>
                <ThemeCard />
                <AccentCard />
            </section>
        </div>
    )
}

