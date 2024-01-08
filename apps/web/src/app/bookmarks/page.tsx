import { getServerAuthSession } from "@/server/auth";
import { BookmarksContent } from "../_components/bookmarks/bookmarks-content";
import { redirect } from "next/navigation";

export default async function BookmarksPage() {
    const session = await getServerAuthSession();

    if (!session?.user) {
        redirect('/login');
    }

    return <BookmarksContent />;
}