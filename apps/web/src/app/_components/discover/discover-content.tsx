"use client";

import { api } from "@/trpc/react";
import { PostType } from "database";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "../ui/Button";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { CategoryButton } from "./category-button";
import { PiFolderNotchBold, PiBookmarkSimpleBold, PiClockBold, PiFireBold } from "react-icons/pi";
import { Post } from "./post/post";
import { DiscoverPostModal } from "../modals/discover-post-modal";

export function DiscoverContent() {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [activePostTypes, setActivePostTypes] = useState<PostType[]>([]);

    const activeCategory = params.get('category') === 'popular' ? 'popular' : 'latest';

    const { data, isFetchingNextPage, isFetching, hasNextPage, fetchNextPage } = api.post.getLatestPosts.useInfiniteQuery({
        category: activeCategory,
        types: activePostTypes.length > 0 ? activePostTypes : undefined,
    });

    const { data: queryPost } = api.post.getPost.useQuery({
        id: params.get('postId') ?? '',
    }, {
        enabled: params.has('postId'),
    });

    const handleChangePostType = (type: PostType) => {
        if (activePostTypes.includes(type)) {
            setActivePostTypes(activePostTypes.filter(t => t !== type));
        } else {
            setActivePostTypes([...activePostTypes, type]);
        }
    };

    const handleChangeCategory = (category: 'latest' | 'popular') => {
        const currentParams = new URLSearchParams(Array.from(params.entries()));

        currentParams.set('category', category);

        router.push(`${pathname}?${currentParams.toString()}`);
    };

    const posts = data?.pages.flatMap((page) => page.posts);

    const observer = useRef<IntersectionObserver>();

    const lastElementRef = useCallback(
        (node: HTMLDivElement) => {
            if (isFetchingNextPage || isFetching) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(entries => {
                if (entries[0]?.isIntersecting && hasNextPage && !isFetching) {
                    void fetchNextPage();
                }
            });
            if (node) observer.current.observe(node);
        },
        [isFetchingNextPage, isFetching, hasNextPage, fetchNextPage]
    );

    return <div className="flex h-full">
        {(queryPost && params.has('postId')) && <DiscoverPostModal post={queryPost} />}
        <section className="w-80 bg-white dark:bg-black border-r border-stroke hidden md:flex flex-col justify-between p-4 h-full">
            <div className="flex flex-col gap-2 w-full">
                <CategoryButton activePostTypes={activePostTypes} handleChangePostType={handleChangePostType} type={PostType.OUTFIT} />
                <CategoryButton activePostTypes={activePostTypes} handleChangePostType={handleChangePostType} type={PostType.HOODIE} />
                <CategoryButton activePostTypes={activePostTypes} handleChangePostType={handleChangePostType} type={PostType.SHIRT} />
                <CategoryButton activePostTypes={activePostTypes} handleChangePostType={handleChangePostType} type={PostType.PANTS} />
                <CategoryButton activePostTypes={activePostTypes} handleChangePostType={handleChangePostType} type={PostType.SHOES} />
                <CategoryButton activePostTypes={activePostTypes} handleChangePostType={handleChangePostType} type={PostType.WATCH} />
                <CategoryButton activePostTypes={activePostTypes} handleChangePostType={handleChangePostType} type={PostType.HEADWEAR} />
                <CategoryButton activePostTypes={activePostTypes} handleChangePostType={handleChangePostType} type={PostType.JEWELRY} />
                <CategoryButton activePostTypes={activePostTypes} handleChangePostType={handleChangePostType} type={PostType.GLASSES} />
            </div>

            <div>
                <Button variant={'ghost'} iconLeft={<PiFolderNotchBold />} className="justify-start">
                    Blog
                </Button>
                <Link href={'/bookmarks'}>
                    <Button variant={'ghost'} iconLeft={<PiBookmarkSimpleBold />} className="justify-start">
                        Bookmarks
                    </Button>
                </Link>
            </div>
        </section>

        <section className="grow flex flex-col gap-4 items-center pt-2 md:pt-4">

            {/* Post Type */}
            <div className="w-[350px] flex border-b-2 border-stroke pb-0.5 md:pb-2">
                <button onClick={() => handleChangeCategory('latest')} className={`${activeCategory === 'latest' ? 'text-inherit' : 'text-secondary-text'} w-1/2 py-2 font-medium font-clash flex gap-2 items-center justify-center hover:bg-stroke transition-colors duration-150 rounded-md`}>
                    <PiClockBold className="text-2xl" />
                    <p>Latest</p>
                </button>

                <button onClick={() => handleChangeCategory('popular')} className={`${activeCategory === 'popular' ? 'text-inherit' : 'text-secondary-text'} w-1/2 py-2 font-medium font-clash flex gap-2 items-center justify-center hover:bg-stroke transition-colors duration-150 rounded-md`}>
                    <PiFireBold className="text-2xl" />
                    <p>Popular</p>
                </button>
            </div>

            {/* Posts */}
            <div className="flex flex-col items-center gap-3 overflow-y-scroll hide-scrollbar snap-mandatory snap-y scroll-smooth">
                {posts ? posts.map((post, index) => {
                    return <div ref={posts.length === index + 1 ? lastElementRef : null} key={post.id}>
                        {index > 0 && <div className="w-full h-0.5 bg-stroke md:block hidden" />}

                        <Post post={post} />
                    </div>
                }) : null}
            </div>
        </section>
    </div>;
}