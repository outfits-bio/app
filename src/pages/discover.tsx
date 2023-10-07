import { PostType } from "@prisma/client";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PiClockBold, PiFireBold } from "react-icons/pi";
import { ExplorePost, ExplorePostModal } from "~/components/ExplorePostModal";
import { Layout } from "~/components/Layout";
import { Post } from "~/components/Post";
import { api } from "~/utils/api.util";

export const DiscoverPage = () => {
    const { data: session } = useSession();

    const [activeCategory, setActiveCategory] = useState<"popular" | "latest">("popular");
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

    const _handleChangePostType = (type: PostType) => {
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
        <section className="w-screen h-screen -mt-20 pt-24 flex flex-col gap-4 items-center">

            {/* Post Type */}
            <div className="w-[350px] flex border-b-2 border-stroke pb-2">
                <button onClick={() => setActiveCategory('popular')} className={`${activeCategory === 'popular' ? 'text-inherit' : 'text-secondary-text'} w-1/2 py-2 font-medium font-clash flex gap-2 items-center justify-center hover:bg-stroke transition-colors duration-150 rounded-md`}>
                    <PiFireBold className="text-2xl" />
                    <p>Popular</p>
                </button>

                <button onClick={() => setActiveCategory('latest')} className={`${activeCategory === 'latest' ? 'text-inherit' : 'text-secondary-text'} w-1/2 py-2 font-medium font-clash flex gap-2 items-center justify-center hover:bg-stroke transition-colors duration-150 rounded-md`}>
                    <PiClockBold className="text-2xl" />
                    <p>Latest</p>
                </button>
            </div>

            {/* Posts */}
            <div className="flex flex-col items-center gap-3 overflow-y-scroll">
                {posts && posts.map((post, index) => {
                    return <div ref={posts.length === index + 1 ? lastElementRef : null} key={post.id}>
                        {index > 0 && <div className="w-full h-0.5 bg-stroke" />}

                        <Post post={post} user={session?.user} />
                    </div>
                })}
            </div>
        </section>
    </Layout>
}

export default DiscoverPage;