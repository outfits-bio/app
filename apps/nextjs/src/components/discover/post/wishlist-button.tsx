import { api } from '~/trpc/react'
import { handleErrors } from '@acme/utils/handle-errors.util'
import { useSession } from 'next-auth/react'
import { PiBookmarkSimpleBold, PiBookmarkSimpleFill } from 'react-icons/pi'
import { Button } from '../../ui/Button'
import type { PostProps } from './post'
import { sendPushNotificationToUser } from '@acme/api/services/pushNotificationService'

export default function WishlistButton({ post }: PostProps) {
  const { data: session } = useSession()

  const ctx = api.useUtils()

  const { mutate: addToWishlist, isPending: addToWishlistPending } =
    api.post.addToWishlist.useMutation({
      onSuccess: () => {
        void ctx.post.getLatestPosts.refetch()
        void ctx.post.getPostsAllTypes.refetch({ id: post.user.id })
        void ctx.post.getWishlist.refetch()

        sendPushNotificationToUser(
          post.user.id,
          'outfits.bio',
          `${session?.user.username} liked your post`,
          ctx
        );
      },
      onError: (e) =>
        handleErrors({
          e,
          message: 'An error occurred while adding this post to your wishlist.',
        }),
    })

  const { mutate: removeFromWishlist, isPending: removeFromWishlistPending } =
    api.post.removeFromWishlist.useMutation({
      onSuccess: () => {
        void ctx.post.getLatestPosts.refetch()
        void ctx.post.getPostsAllTypes.refetch({ id: post.user.id })
        void ctx.post.getWishlist.refetch()
      },
      onError: (e) =>
        handleErrors({
          e,
          message:
            'An error occurred while removing this post from your wishlist.',
        }),
    })

  const handleToggleWishlist = () => {
    const wishlist = post.wishlists.find((w) => w.id === session?.user.id)

    if (wishlist) {
      removeFromWishlist({ id: post.id })
    } else {
      addToWishlist({ id: post.id })
    }
  }

  return (
    <Button
      variant={'outline-ghost'}
      centerItems
      shape={'circle'}
      className="text-white border-white/50 sm:border-stroke sm:text-black bg-black/50 sm:bg-transparent sm:dark:text-white"
      aria-label="Wishlist Button"
      iconLeft={
        !addToWishlistPending &&
        !removeFromWishlistPending &&
        (post.wishlists.find((w) => w.id === session?.user.id) ? (
          <PiBookmarkSimpleFill />
        ) : (
          <PiBookmarkSimpleBold />
        ))
      }
      onClick={handleToggleWishlist}
      isLoading={addToWishlistPending || removeFromWishlistPending}
    />
  )
}
