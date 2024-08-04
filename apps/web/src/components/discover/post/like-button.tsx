import { api } from '@/trpc/react'
import { handleErrors } from '@/utils/handle-errors.util'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { PiHeartBold, PiHeartFill } from 'react-icons/pi'
import { Button } from '../../ui/Button'
import type { PostProps } from './post'

export interface LikeButtonProps extends PostProps {
  variant?: 'default' | 'ghost'
}

export function LikeButton({ post, variant = 'default' }: LikeButtonProps) {
  const { data: session } = useSession()

  const [likeAnimation, setLikeAnimation] = useState<boolean>(false)

  const ctx = api.useUtils()

  const { mutate: toggleLikePost, isLoading: toggleLikePostLoading } =
    api.post.toggleLikePost.useMutation({
      onSuccess: () => {
        void ctx.post.getLatestPosts.refetch()
        void ctx.post.getPostsAllTypes.refetch({ id: post.user.id })
      },
      onError: (e) =>
        handleErrors({
          e,
          message: 'An error occurred while liking this post.',
        }),
    })

  if (variant === 'default')
    return (
      <Button
        variant="outline-ghost"
        centerItems
        shape={'circle'}
        className="text-white border-white/50 sm:border-stroke sm:text-black bg-black/50 sm:bg-transparent sm:dark:text-white"
        onClick={() => {
          setLikeAnimation(true)
          toggleLikePost({ id: post.id })
        }}
        iconLeft={
          post.authUserHasLiked && session?.user ? (
            <PiHeartFill
              onAnimationEnd={() => setLikeAnimation(false)}
              className={
                likeAnimation ? 'animate-like fill-black dark:fill-white' : ''
              }
            />
          ) : (
            <PiHeartBold
              onAnimationEnd={() => setLikeAnimation(false)}
              className={
                likeAnimation
                  ? 'animate-like-end fill-black dark:fill-white'
                  : ''
              }
            />
          )
        }
        disabled={toggleLikePostLoading}
      />
    )

  return (
    <button
      onClick={() => {
        setLikeAnimation(true)
        toggleLikePost({ id: post.id })
      }}
      className="text-xl text-white"
      type="button"
    >
      {post.authUserHasLiked ? (
        <PiHeartFill
          onAnimationEnd={() => setLikeAnimation(false)}
          className={likeAnimation ? 'animate-unlike fill-white' : ''}
        />
      ) : (
        <PiHeartBold
          onAnimationEnd={() => setLikeAnimation(false)}
          className={likeAnimation ? 'animate-unlike-end fill-white' : ''}
        />
      )}
    </button>
  )
}
