
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import { Bookmarks } from "~/components/Bookmarks";

export async function DiscoverPage() {
    const session = await getServerAuthSession();

    if (!session?.user) {
        redirect('/login');
    } else {
        return <Bookmarks session={session} />;
    }
}