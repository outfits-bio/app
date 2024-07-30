import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";
import { DiscoverPostModal } from "./discover-post-modal";

export function PostModal() {
    const params = useSearchParams();

    const { data: queryPost } = api.post.getPost.useQuery({
        id: params.get('postId') ?? '',
    }, {
        enabled: params.has('postId'),
    });

    if (queryPost && params.has('postId')) return <DiscoverPostModal post={queryPost} />
}