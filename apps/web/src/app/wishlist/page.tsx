import { getServerAuthSession } from "@/server/auth";
import { WishlistContent } from "../_components/wishlist/wishlist-content";
import { redirect } from "next/navigation";

export default async function BookmarksPage() {
    const session = await getServerAuthSession();

    if (!session?.user) {
        redirect('/login');
    }

    return <WishlistContent />;
}