import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { WishlistContent } from "../_components/wishlist/wishlist-content";

export default async function BookmarksPage() {
    const session = await getServerAuthSession();

    if (!session?.user) {
        redirect('/login');
    }

    return <WishlistContent />;
}