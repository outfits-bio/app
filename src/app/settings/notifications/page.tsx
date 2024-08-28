import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { NotificationStatusCard } from "./notification-status-card";

export default async function ConnectionsSettingsPage() {
    const session = await getServerAuthSession();

    if (!session?.user) {
        redirect('/login');
    }

    return (
        <div className="flex">
            <SettingsSidebar />
            <section className="grow flex flex-col gap-4 pt-2 md:pt-4 md:p-8 px-2 py-8 h-full max-w-full">
                <div>
                    <h1 className="font-clash font-bold text-3xl">Notifications</h1>
                    <p>Manage your notification status and preferences [BETA]</p>
                </div>

                <p className="hidden md:block text-destructive">These settings are currently only avaliable for mobile devices, please check back later.</p>
                <NotificationStatusCard />

            </section>
        </div>
    )
}

