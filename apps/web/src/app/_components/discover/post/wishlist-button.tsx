import { api } from "@/trpc/react";
import { handleErrors } from "@/utils/handle-errors.util";
import { useSession } from "next-auth/react";
import { PiBookmarkSimpleBold, PiBookmarkSimpleFill } from "react-icons/pi";
import { Button } from "../../ui/Button";
import type { PostProps } from "./post";

export default function WishlistButton({ post }: PostProps) {

    const { data: session } = useSession();

    const ctx = api.useUtils();

    const { mutate: addToWishlist, isLoading: addToWishlistloading } = api.post.addToWishlist.useMutation({
        onSuccess: () => {
            void ctx.post.getLatestPosts.refetch();
            void ctx.post.getPostsAllTypes.refetch({ id: post.user.id });
            void ctx.post.getWishlist.refetch();
        },
        onError: (e) => handleErrors({ e, message: 'An error occurred while adding this post to your wishlist.' })
    });

    const { mutate: removeFromWishlist, isLoading: removeFromWishlistLoading } = api.post.removeFromWishlist.useMutation({
        onSuccess: () => {
            void ctx.post.getLatestPosts.refetch();
            void ctx.post.getPostsAllTypes.refetch({ id: post.user.id });
            void ctx.post.getWishlist.refetch();
        },
        onError: (e) => handleErrors({ e, message: 'An error occurred while removing this post from your wishlist.' })
    });

    const handleToggleWishlist = () => {
        const wishlist = post.wishlists.find(w => w.id === session?.user.id);

        if (wishlist) {
            removeFromWishlist({ id: post.id });
        } else {
            addToWishlist({ id: post.id });
        }
    }

    return <Button
        variant={'outline-ghost'}
        centerItems
        shape={'circle'}
        iconLeft={(!addToWishlistloading && !removeFromWishlistLoading) && (post.wishlists.find(w => w.id === session?.user.id) ? <PiBookmarkSimpleFill /> : <PiBookmarkSimpleBold />)}
        onClick={handleToggleWishlist}
        isLoading={addToWishlistloading || removeFromWishlistLoading}
    />
}