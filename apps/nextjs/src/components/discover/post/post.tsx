'use client'

import { api } from '~/trpc/react'
import { handleErrors } from '@acme/utils/handle-errors.util'
import { PostInfoModal } from '~/components/modals/post-info-modal'
import type { AppRouter } from '@acme/api'
import { formatImage } from '@acme/utils/image-src-format.util'
import { getPostTypeName } from '@acme/utils/names.util'
import type { inferRouterOutputs } from '@trpc/server'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { memo, useState } from 'react'
import toast from 'react-hot-toast'
import {
  PiDotsThreeBold,
  PiHammer,
  PiHeartStraightFill,
  PiSealCheck,
  PiShareFatBold,
} from 'react-icons/pi'
import { PostMenu } from '../../menus/post-menu'
import { Avatar } from '../../ui/Avatar'
import { Button } from '../../ui/Button'
import { LikeButton } from './like-button'
import ReactButton from './react-button'
import WishlistButton from './wishlist-button'
import { useMediaQuery } from '~/hooks/use-media-query.hook'

export interface PostProps {
  post: inferRouterOutputs<AppRouter>['post']['getLatestPosts']['posts'][number];
  ref?: React.Ref<HTMLDivElement>;
  priority?: boolean;
}

export function Post({ post, ref, priority = false }: PostProps) {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const { data: session } = useSession()

  const user = session?.user
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const handleSetParams = () => {
    if (isDesktop) {
      const currentParams = new URLSearchParams(Array.from(params.entries()))

      currentParams.set('postId', post.id)

      router.push(`${pathname}?${currentParams.toString()}`)
    } else return
  }

  const handleShare = (postId: string) => {
    const origin = window.location.origin

    const url = `${origin}${pathname}?postId=${postId}`

    if (navigator.share) {
      navigator
        .share({
          title: 'outfits.bio',
          text: 'Check out this post on outfits.bio!',
          url: url,
        })
        .catch((error) => {
          console.error('Error sharing:', error)
        })
    } else {
      void navigator.clipboard.writeText(url)
      toast.success('Copied post link to clipboard!')
    }
  }

  const [likeAnimation, setLikeAnimation] = useState<boolean>(false)
  const ctx = api.useUtils()

  const { mutate: toggleLikePost } = api.post.toggleLikePost.useMutation({
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

  const truncatedTagline =
    post.user.tagline &&
    (post.user.tagline.length > 20
      ? `${post.user.tagline.slice(0, 20)}...`
      : post.user.tagline)

  const AuthorDesc = memo(() => (
    <div
      className={`flex-col justify-center flex absolute bottom-3 left-3 z-10`}
    >
      <p className="flex items-center gap-1 font-medium text-white md:dark:text-white ">
        {post.user.username}{' '}
        {post.user.admin ? (
          <PiHammer className="w-4 h-4" />
        ) : (
          post.user.verified && <PiSealCheck className="w-4 h-4" />
        )}
      </p>

      {(post._count.likes > 0 ||
        post._count.reactions > 0 ||
        post._count.wishlists > 0) && (
          <p className="flex self-start gap-1 text-sm font-medium font-clash text-white/80">
            <PostInfoModal postId={post.id}>
              <span className="flex gap-1 cursor-pointer">
                <span className="font-bold">{post._count.likes}</span>{' '}
                {post._count.likes === 1 ? ' like' : ' likes'}
                {post._count.reactions || post._count.wishlists ? ', ' : ''}
              </span>
            </PostInfoModal>
            {post._count.reactions > 0 && (
              <span className="flex gap-1">
                <span className="font-bold">{post._count.reactions}</span>{' '}
                {post._count.reactions === 1 ? ' reaction' : ' reactions'}
                {post._count.wishlists ? ', ' : ''}
              </span>
            )}
            {post._count.wishlists > 0 && (
              <span className="flex gap-1">
                <span className="font-bold">{post._count.wishlists}</span>{' '}
                {post._count.wishlists === 1 ? ' wishlist' : ' wishlists'}
              </span>
            )}
          </p>
        )}
      <p className="inline text-sm text-stroke 2xs-h:hidden dark:text-white/75">
        {truncatedTagline && `${truncatedTagline} - `}
        {getPostTypeName(post.type).toLowerCase()}
      </p>
      <p className="hidden text-sm text-stroke 2xs-h:inline dark:text-white/75">
        {getPostTypeName(post.type).toLowerCase()}
      </p>
    </div>
  ))
  return (
    <div className="relative flex flex-col items-center w-full h-full max-w-sm max-h-[calc(100vh_-_112px)] gap-2 snap-start md:gap-4 sm:pr-[56px]" ref={ref}>
      {/*<Link
        href={`/${post.user.username}`}
        className="items-center hidden w-full gap-2 px-4 font-clash sm:flex"
      >
        <Avatar
          image={post.user.image}
          id={post.user.id}
          username={post.user.username}
          size={'sm'}
        />
          <AuthorDesc />
      </Link>*/}
      <div

        onDoubleClick={() => {
          setLikeAnimation(true)
          if (navigator.vibrate) {
            navigator.vibrate(200)
          }
          toggleLikePost({ id: post.id })
        }}
        className="md:cursor-pointer w-full aspect-[53/87] flex justify-center overflow-hidden "
      >
        <div className="relative w-auto aspect-[53/87] flex justify-center overflow-hidden flex-grow">
          {likeAnimation && (
            <div className="fixed inset-0 flex items-center justify-center text-white">
              <PiHeartStraightFill
                className="w-24 h-24 animate-like"
                onAnimationEnd={() => setLikeAnimation(false)}
              />
            </div>
          )}
          <Image
            src={formatImage(post.image, post.user.id)}
            className="object-cover !w-auto border border-stroke rounded-xl !static"
            fill
            alt={post.type}
            priority={priority}
            onClick={handleSetParams}
            onKeyDown={handleSetParams}
          />
          <div className="absolute bottom-0 w-full h-32 bg-gradient-to-b from-transparent to-black rounded-b-xl" />

          <AuthorDesc />
        </div>
      </div>

      {/*  sm:static sm:flex-row sm:w-full dbs-h:absolute*/}
      <div className="absolute flex flex-col items-center justify-between bottom-3 right-3 sm:right-0 sm:bottom-0">
        <div className="flex flex-col gap-1.5">
          <Link
            href={`/${post.user.username}`}
            className="flex items-center font-clash"
          >
            <Avatar
              image={post.user.image}
              id={post.user.id}
              username={post.user.username}
              size={'sm'}
              className="border-0"
            />
          </Link>

          <LikeButton post={post} />

          <ReactButton post={post} />

          <WishlistButton post={post} />

          <Button
            variant="outline-ghost"
            centerItems
            shape={'circle'}
            iconLeft={<PiShareFatBold />}
            className="text-white border-white/50 sm:border-stroke sm:text-black bg-black/50 sm:bg-transparent sm:dark:text-white"
            onClick={() => handleShare(post.id)}
          />
        </div>

        <div className="block">
          {user && (
            <PostMenu
              userIsProfileOwner={user.id === post?.user.id}
              button={
                <Button
                  variant="outline"
                  centerItems
                  shape={'circle'}
                  iconLeft={<PiDotsThreeBold />}
                  className="mt-1.5 flex text-white border border-white/50 bg-black/50 sm:border-stroke sm:text-black sm:bg-transparent dark:sm:text-white"
                />
              }
              postId={post.id}
            />
          )}
        </div>
      </div>
    </div>
  )
}
