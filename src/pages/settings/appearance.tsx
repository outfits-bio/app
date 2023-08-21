import type { NextPage } from "next";
import { SettingsLayout } from '~/components/SettingsLayout';

export const AppearanceSettingsPage: NextPage = () => {
    return <SettingsLayout>
        <div className="w-full h-full items-center justify-center p-4 font-urbanist">
            <h1 className="text-4xl font-black">Coming Soon!</h1>
        </div>
    </SettingsLayout>
}

export default AppearanceSettingsPage;