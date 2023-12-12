"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ExplorePost, ExplorePostModal } from "~/components/ExplorePostModal";
import { Layout } from "~/components/Layout";
import { Post } from "~/components/Post";
import { api } from '~/components/TRPCWrapper';
import { Session } from "next-auth";

export const Bookmarks = ({ session }: { session: Session }) => {
    const [postFromUrl, setPostFromUrl] = useState<ExplorePost | null>(null);
    const [postModalOpen, setPostModalOpen] = useState<boolean>(false);

    const params = useSearchParams();

    const { data,
        isFetching,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = api.post.getWishlist.useInfiniteQuery({}, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

    const posts = data?.pages.flatMap((page) => page.posts);

    useEffect(() => {
        if (params.has('postId')) {
            const post = posts?.find(p => p.id === params.get('postId')) ?? data?.pages.flatMap((page) => page.posts).find(p => p.id === params.get('postId'));

            if (post) {
                setPostFromUrl(post);
                setPostModalOpen(true);
            }
        } else {
            setPostFromUrl(null);
            setPostModalOpen(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params, posts]);

    const observer = useRef<IntersectionObserver>();

    const lastElementRef = useCallback(
        (node: HTMLDivElement) => {
            if (isFetchingNextPage || isFetching) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(entries => {
                if (entries[0]?.isIntersecting && hasNextPage && !isFetching) {
                    fetchNextPage();
                }
            });
            if (node) observer.current.observe(node);
        },
        [isFetchingNextPage, isFetching, hasNextPage, fetchNextPage]
    );

    return <Layout title="Bookmarks">
        {postModalOpen && <ExplorePostModal setPostModalOpen={setPostModalOpen} post={postFromUrl} />}
        <div className="w-screen h-screen -mt-20 pt-20 flex pb-24 md:pb-0 -mb-24">
            <section className="grow flex flex-col gap-4 items-center pt-2 md:pt-4">

                <div className="flex flex-col items-center gap-3 overflow-y-scroll hide-scrollbar snap-mandatory snap-y scroll-smooth">
                    {posts && posts.map((post, index) => {
                        return <div ref={posts.length === index + 1 ? lastElementRef : null} key={post.id}>
                            {index > 0 && <div className="w-full h-0.5 bg-stroke md:block hidden" />}

                            <Post post={post} user={session?.user} />
                        </div>
                    })}
                </div>
            </section>
        </div>
    </Layout>
}