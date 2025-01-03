"use client";

import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";
import { Post } from "../discover/post/post";
import { DiscoverPostModal } from "../modals/discover-post-modal";

export function WishlistContent() {
  const params = useSearchParams();

  const { data, isFetchingNextPage, isFetching, hasNextPage, fetchNextPage } =
    api.post.getWishlist.useInfiniteQuery(
      {},
      { getNextPageParam: (lastPage) => lastPage.nextCursor },
    );

  const { data: queryPost } = api.post.getPost.useQuery(
    {
      id: params.get("postId") ?? "",
    },
    {
      enabled: params.has("postId"),
    },
  );

  const posts = data?.pages.flatMap((page) => page.posts);

  const observer = useRef<IntersectionObserver>();

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetchingNextPage || isFetching) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetching) {
          void fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, isFetching, hasNextPage, fetchNextPage],
  );

  return (
    <div className="flex h-full w-full">
      {queryPost && params.has("postId") && (
        <DiscoverPostModal post={queryPost} />
      )}
      <section className="grow flex flex-col gap-4 items-center pt-2 md:pt-4 px-2">
        {/* Posts */}
        <div className="flex flex-col items-center gap-3 overflow-y-scroll hide-scrollbar snap-mandatory snap-y scroll-smooth w-full">
          {posts
            ? posts.map((post, index) => {
                return (
                  <Post
                    post={post}
                    ref={posts.length === index + 1 ? lastElementRef : null}
                    key={post.id}
                    priority={index < 3}
                  />
                );
              })
            : null}
          {posts?.length === 0 && (
            <div className="flex flex-col items-center justify-center font-clash py-2">
              <h3 className="text-center">
                You don&apos;t have any posts in your wishlist yet.
              </h3>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
