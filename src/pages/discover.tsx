import { PostType } from "@prisma/client";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PiBackpackBold, PiBaseballCapBold, PiClockBold, PiCoatHangerBold, PiEyeglassesBold, PiFireBold, PiFolderNotchBold, PiPantsBold, PiShirtFoldedBold, PiSneakerBold, PiTShirtBold, PiWatchBold } from "react-icons/pi";
import { Button } from "~/components/Button";
import { ExplorePost, ExplorePostModal } from "~/components/ExplorePostModal";
import { Layout } from "~/components/Layout";
import { Post } from "~/components/Post";
import { api } from "~/utils/api.util";

export const DiscoverPage = () => {
    const { data: session } = useSession();

    const [activeCategory, setActiveCategory] = useState<"popular" | "latest">("latest");
    const [activePostTypes, setActivePostTypes] = useState<PostType[]>([]);

    const [postFromUrl, setPostFromUrl] = useState<ExplorePost | null>(null);
    const [postModalOpen, setPostModalOpen] = useState<boolean>(false);

    const { query } = useRouter();

    const { data,
        isFetching,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = api.post.getLatestPosts.useInfiniteQuery({
        category: activeCategory,
        types: activePostTypes.length > 0 ? activePostTypes : undefined,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

    const handleChangePostType = (type: PostType) => {
        if (activePostTypes.includes(type)) {
            setActivePostTypes(activePostTypes.filter(t => t !== type));
        } else {
            setActivePostTypes([...activePostTypes, type]);
        }
    };

    const posts = data?.pages.flatMap((page) => page.posts);

    useEffect(() => {
        if (query.postId) {
            const post = posts?.find(p => p.id === query.postId) ?? data?.pages.flatMap((page) => page.posts).find(p => p.id === query.postId);

            if (post) {
                setPostFromUrl(post);
                setPostModalOpen(true);
            }
        } else {
            setPostFromUrl(null);
            setPostModalOpen(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query.postId, posts]);

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

    return <Layout title="Discover">
        {postModalOpen && <ExplorePostModal setPostModalOpen={setPostModalOpen} post={postFromUrl} />}
        <div className="w-screen h-screen -mt-20 pt-20 flex pb-24 md:pb-0 -mb-24">
            <section className="w-80 bg-white dark:bg-black border-r border-stroke hidden md:flex flex-col justify-between p-4">
                <div className="flex flex-col gap-2 w-full">
                    <Button
                        onClick={() => handleChangePostType(PostType.OUTFIT)}
                        variant={activePostTypes.includes(PostType.OUTFIT) ? 'primary' : 'ghost'}
                        iconLeft={<PiCoatHangerBold />}
                        className="justify-start"
                    >
                        Outfits
                    </Button>
                    <Button
                        onClick={() => handleChangePostType(PostType.HOODIE)}
                        variant={activePostTypes.includes(PostType.HOODIE) ? 'primary' : 'ghost'}
                        iconLeft={<PiShirtFoldedBold />}
                        className="justify-start"
                    >
                        Outerwear
                    </Button>
                    <Button
                        onClick={() => handleChangePostType(PostType.SHIRT)}
                        variant={activePostTypes.includes(PostType.SHIRT) ? 'primary' : 'ghost'}
                        iconLeft={<PiTShirtBold />}
                        className="justify-start"
                    >
                        Tops
                    </Button>
                    <Button
                        onClick={() => handleChangePostType(PostType.PANTS)}
                        variant={activePostTypes.includes(PostType.PANTS) ? 'primary' : 'ghost'}
                        iconLeft={<PiPantsBold />}
                        className="justify-start"
                    >
                        Bottoms
                    </Button>
                    <Button
                        onClick={() => handleChangePostType(PostType.SHOES)}
                        variant={activePostTypes.includes(PostType.SHOES) ? 'primary' : 'ghost'}
                        iconLeft={<PiSneakerBold />}
                        className="justify-start"
                    >
                        Footwear
                    </Button>
                    <Button
                        onClick={() => handleChangePostType(PostType.WATCH)}
                        variant={activePostTypes.includes(PostType.WATCH) ? 'primary' : 'ghost'}
                        iconLeft={<PiBackpackBold />}
                        className="justify-start"
                    >
                        Accessories
                    </Button>
                    <Button
                        onClick={() => handleChangePostType(PostType.HEADWEAR)}
                        variant={activePostTypes.includes(PostType.HEADWEAR) ? 'primary' : 'ghost'}
                        iconLeft={<PiBaseballCapBold />}
                        className="justify-start"
                    >
                        Headwear
                    </Button>
                    <Button
                        onClick={() => handleChangePostType(PostType.JEWELRY)}
                        variant={activePostTypes.includes(PostType.JEWELRY) ? 'primary' : 'ghost'}
                        iconLeft={<PiWatchBold />}
                        className="justify-start"
                    >
                        Jewelry
                    </Button>
                    <Button
                        onClick={() => handleChangePostType(PostType.GLASSES)}
                        variant={activePostTypes.includes(PostType.GLASSES) ? 'primary' : 'ghost'}
                        iconLeft={<PiEyeglassesBold />}
                        className="justify-start"
                    >
                        Eyewear
                    </Button>
                </div>

                <Button variant={'ghost'} iconLeft={<PiFolderNotchBold />} className="justify-start">
                    Blog
                </Button>
            </section>

            <section className="grow flex flex-col gap-4 items-center pt-2 md:pt-4">

                {/* Post Type */}
                <div className="w-[350px] flex border-b-2 border-stroke pb-0.5 md:pb-2">
                    <button onClick={() => setActiveCategory('latest')} className={`${activeCategory === 'latest' ? 'text-inherit' : 'text-secondary-text'} w-1/2 py-2 font-medium font-clash flex gap-2 items-center justify-center hover:bg-stroke transition-colors duration-150 rounded-md`}>
                        <PiClockBold className="text-2xl" />
                        <p>Latest</p>
                    </button>

                    <button onClick={() => setActiveCategory('popular')} className={`${activeCategory === 'popular' ? 'text-inherit' : 'text-secondary-text'} w-1/2 py-2 font-medium font-clash flex gap-2 items-center justify-center hover:bg-stroke transition-colors duration-150 rounded-md`}>
                        <PiFireBold className="text-2xl" />
                        <p>Popular</p>
                    </button>
                </div>

                {/* Posts */}
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

export default DiscoverPage;