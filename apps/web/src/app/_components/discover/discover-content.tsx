"use client";

import { api } from "@/trpc/react";
import { PostType } from "database";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { PiBookmarkSimpleBold, PiClockBold, PiFireBold } from "react-icons/pi";
import { PostModal } from "../modals/post-modal";
import { Button } from "../ui/Button";
import { CategoryButton } from "./category-button";
import { Post } from "./post/post";
import { RegisterBanner } from "./register-banner"

export function DiscoverContent() {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { data: session } = useSession();


    const [activePostTypes, setActivePostTypes] = useState<PostType[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(true); // Added state for filter dropdown

    const activeCategory = params.get('category') === 'popular' ? 'popular' : 'latest';

    const { data, isFetchingNextPage, isFetching, hasNextPage, fetchNextPage } = api.post.getLatestPosts.useInfiniteQuery({
        category: activeCategory,
        types: activePostTypes.length > 0 ? activePostTypes : undefined,
    }, { getNextPageParam: (lastPage) => lastPage.nextCursor, });

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

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowUp') {
                window.scrollBy(0, -100);
            } else if (event.key === 'ArrowDown') {
                window.scrollBy(0, 100);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div className="flex h-full">
            <PostModal />
            <section className="w-80 bg-white dark:bg-black border-r border-stroke hidden md:flex flex-col justify-between p-4 h-full">
                {/* Filter */}
                <div className="flex flex-col gap-2 w-full">
                    <div className="relative">
                        <Button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="mb-2 flex "
                            variant={'outline'}
                        >
                            <span>Filter</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transform ${isFilterOpen ? 'rotate-180  mb-1' : 'rotate-0  mt-1'}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3.586L3.707 9.879a1 1 0 101.414 1.414L10 6.414l4.879 4.879a1 1 0 101.414-1.414L10 3.586z" clipRule="evenodd" /></svg>
                        </Button>
                        {isFilterOpen && (
                            <div className="absolute top-full left-0 w-full bg-white dark:bg-black border border-stroke rounded-lg">
                                <div className="flex flex-col gap-2 p-4">
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
                            </div>
                        )}
                    </div>
                </div>

                {/* Wishlist */}
                {session &&
                    <div>
                        <Link href={'/wishlist'}>
                            <Button variant={'ghost'} iconLeft={<PiBookmarkSimpleBold />} className="justify-start">
                                Wishlist
                            </Button>
                        </Link>
                    </div>
                }
            </section>

            <section className="grow flex flex-col gap-4 items-center pt-2 md:pt-4">
                {/* Post Type */}
                <div className="w-[350px] flex border-b-2 border-stroke gap-1 pb-0.5 md:pb-2">
                    <button
                        onClick={() => handleChangeCategory('latest')}
                        className={`${activeCategory === 'latest' ? 'text-inherit bg-stroke' : 'text-secondary-text'} w-1/2 py-2 font-medium font-clash flex gap-2 items-center justify-center hover:bg-stroke transition-colors duration-150 rounded-xl`}
                    >
                        <PiClockBold className="text-2xl" />
                        <p>Latest</p>
                    </button>

                    <button
                        onClick={() => handleChangeCategory('popular')}
                        className={`${activeCategory === 'popular' ? 'text-inherit bg-stroke' : 'text-secondary-text'} w-1/2 py-2 font-medium font-clash flex gap-2 items-center justify-center hover:bg-stroke transition-colors duration-150 rounded-xl`}
                    >
                        <PiFireBold className="text-2xl" />
                        <p>Popular</p>
                    </button>
                </div>

                {/* Posts */}
                <div className="flex flex-col items-center gap-3 overflow-y-scroll hide-scrollbar snap-mandatory snap-y scroll-smooth">
                    {posts ? posts.map((post, index) => {
                        return (
                            <div ref={posts.length === index + 1 ? lastElementRef : null} key={post.id}>
                                <Post post={post} />
                            </div>
                        );
                    }) : null}
                </div>
                <RegisterBanner />
            </section>
        </div>
    );
}