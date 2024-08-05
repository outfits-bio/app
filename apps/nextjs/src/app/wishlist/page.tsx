import { auth } from "@acme/auth";
import { redirect } from "next/navigation";
import { WishlistContent } from "~/components/wishlist/wishlist-content";

export default async function BookmarksPage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    return <WishlistContent />;
}