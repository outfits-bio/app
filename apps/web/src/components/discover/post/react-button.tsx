import type { AddReactionInput } from "@/schemas/post.schema";
import { api } from "@/trpc/react";
import { handleErrors } from "@/utils/handle-errors.util";
import { PiChatCircleBold } from "react-icons/pi";
import { Button } from "../../ui/Button";
import type { PostProps } from "./post";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function ReactButton({ post }: PostProps) {

    const ctx = api.useUtils();

    const { mutate: addReaction, isLoading: addReactionloading, variables } = api.post.addReaction.useMutation({
        onSuccess: () => {
            void ctx.post.getLatestPosts.refetch();
            void ctx.post.getPostsAllTypes.refetch({ id: post.user.id });
        },
        onError: (e) => handleErrors({ e, message: 'An error occurred while reacting to this post.' })
    });

    const { mutate: removeReaction } = api.post.removeReaction.useMutation({
        onSuccess: () => {
            void ctx.post.getLatestPosts.refetch();
            void ctx.post.getPostsAllTypes.refetch({ id: post.user.id });
        },
        onError: (e) => handleErrors({ e, message: 'An error occurred while removing your reaction to this post.' })
    });

    const reactionLoading = (content: AddReactionInput['emoji']) => {
        if (addReactionloading && variables?.emoji === content) {
            return true;
        }

        return false;
    };

    const handleToggleReact = (content: AddReactionInput['emoji']) => {
        const reaction = post.reactions.find(r => r.content === content);

        if (reaction) {
            removeReaction({ id: reaction.id });
        } else {
            addReaction({ id: post.id, emoji: content });
        }
    }

    return <Popover>
        <PopoverTrigger>
            <Button className="focus:outline-none" variant={'outline-ghost'} centerItems shape={'circle'} iconLeft={<PiChatCircleBold />} />
        </PopoverTrigger>
        <PopoverContent className="w-fit  flex justify-between items-center gap-1 bg-white p-2 text-2xl">
            <Button variant={post.reactions.find(p => p.content === '🔥') ? 'primary' : 'outline-ghost'} isLoading={reactionLoading('🔥')} centerItems shape={'circle'} onClick={() => handleToggleReact('🔥')}>
                {reactionLoading('🔥') ? '' : '🔥'}
            </Button>
            <Button variant={post.reactions.find(p => p.content === '❤️') ? 'primary' : 'outline-ghost'} isLoading={reactionLoading('❤️')} centerItems shape={'circle'} onClick={() => handleToggleReact('❤️')}>
                {reactionLoading('❤️') ? '' : '❤️'}
            </Button>
        </PopoverContent>
    </Popover>
}