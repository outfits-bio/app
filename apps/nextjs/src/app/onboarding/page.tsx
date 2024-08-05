import { redirect } from "next/navigation";
import { Onboarding } from "~/components/onboarding/onboarding";
import { auth } from "@acme/auth";

export default async function OnboardingPage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    } else {
        if (session.user.onboarded) {
            redirect(`/${session.user.username}`);
        }
        return <Onboarding session={session} username={session.user.username} />;
    }

    return null;
};