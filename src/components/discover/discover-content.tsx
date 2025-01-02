"use client";

import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { PostModal } from "../modals/post-modal";
import { Post } from "./post/post";

export function DiscoverContent({ initialPosts }: { initialPosts: never }) {
  const params = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<"latest" | "popular">(
    params?.get("category") === "popular" ? "popular" : "latest",
  );

  useEffect(() => {
    const category = params?.get("category");
    setActiveCategory(category === "popular" ? "popular" : "latest");
  }, [params]);

  const {
    data,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = api.post.getLatestPosts.useInfiniteQuery(
    {
      category: activeCategory,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: { pages: [initialPosts], pageParams: [undefined] },
    },
  );

  useEffect(() => {
    void refetch();
  }, [activeCategory, refetch]);

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        window.scrollBy(0, -100);
      } else if (event.key === "ArrowDown") {
        window.scrollBy(0, 100);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex h-full">
      <PostModal />


      <section className="relative flex flex-col items-center gap-4 px-1 pt-1 grow">
        <div className="flex w-full h-full overflow-hidden">
          <div className="flex flex-col items-center w-full gap-3 pb-[69px] overflow-y-scroll hide-scrollbar snap-mandatory snap-y scroll-smooth md:pb-0 md:first:mt-4">
            {posts
              ? posts.map((post, index) => {
                return (
                  <div
                    ref={posts.length === index + 1 ? lastElementRef : null}
                    key={post.id}
                    className="flex justify-center w-full"
                  >
                    <Post post={post} priority={index < 3} />
                  </div>
                );
              })
              : null}
          </div>
        </div>
      </section>
    </div>
  );
}
