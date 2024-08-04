import type { AddReactionInput } from '@/schemas/post.schema'
import { api } from '@/trpc/react'
import { handleErrors } from '@/utils/handle-errors.util'
import { Popover, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { PiChatCircleBold } from 'react-icons/pi'
import { Button } from '../../ui/Button'
import type { PostProps } from './post'

export default function ReactButton({ post }: PostProps) {
  const ctx = api.useUtils()

  const {
    mutate: addReaction,
    isLoading: addReactionloading,
    variables,
  } = api.post.addReaction.useMutation({
    onSuccess: () => {
      void ctx.post.getLatestPosts.refetch()
      void ctx.post.getPostsAllTypes.refetch({ id: post.user.id })
    },
    onError: (e) =>
      handleErrors({
        e,
        message: 'An error occurred while reacting to this post.',
      }),
  })

  const { mutate: removeReaction } = api.post.removeReaction.useMutation({
    onSuccess: () => {
      void ctx.post.getLatestPosts.refetch()
      void ctx.post.getPostsAllTypes.refetch({ id: post.user.id })
    },
    onError: (e) =>
      handleErrors({
        e,
        message: 'An error occurred while removing your reaction to this post.',
      }),
  })

  const reactionLoading = (content: AddReactionInput['emoji']) => {
    if (addReactionloading && variables?.emoji === content) {
      return true
    }

    return false
  }

  const handleToggleReact = (content: AddReactionInput['emoji']) => {
    const reaction = post.reactions.find((r) => r.content === content)

    if (reaction) {
      removeReaction({ id: reaction.id })
    } else {
      addReaction({ id: post.id, emoji: content })
    }
  }

  return (
    <Popover className="relative">
      <Popover.Button>
        <Button
          variant={'outline-ghost'}
          centerItems
          shape={'circle'}
          iconLeft={<PiChatCircleBold />}
          className="text-white border-white/50 sm:border-stroke sm:text-black bg-black/50 sm:bg-transparent focus:outline-none sm:dark:text-white"
        />
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute z-10 px-4 transform -translate-x-1/2 left-1/2 bottom-14 sm:px-0">
          <div className="overflow-hidden shadow-lg rounded-xl ring-1 ring-black ring-opacity-5">
            <div className="relative flex items-center justify-between gap-1 p-2 text-2xl bg-white">
              <Button
                variant={
                  post.reactions.find((p) => p.content === '🔥')
                    ? 'primary'
                    : 'outline-ghost'
                }
                isLoading={reactionLoading('🔥')}
                centerItems
                shape={'circle'}
                onClick={() => handleToggleReact('🔥')}
              >
                {reactionLoading('🔥') ? '' : '🔥'}
              </Button>
              <Button
                variant={
                  post.reactions.find((p) => p.content === '❤️')
                    ? 'primary'
                    : 'outline-ghost'
                }
                isLoading={reactionLoading('❤️')}
                centerItems
                shape={'circle'}
                onClick={() => handleToggleReact('❤️')}
              >
                {reactionLoading('❤️') ? '' : '❤️'}
              </Button>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
