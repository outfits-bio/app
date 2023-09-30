import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from '~/components/Button';
import { ExplorePost, ExplorePostModal } from '~/components/ExplorePostModal';
import { Layout } from '~/components/Layout';
import {
    getPostTypeIconSmall, getPostTypeName
} from '~/components/PostSection/post-section.util';
import { PostSkeleton } from '~/components/Skeletons/PostSkeleton';
import { api } from '~/utils/api.util';
import { formatAvatar, formatImage } from '~/utils/image-src-format.util';

import {
    PiHammer, PiSealCheck
} from 'react-icons/pi';
import { PostType } from '@prisma/client';
import { getSortedPostsData } from '~/utils/blog.util';

export const ExplorePage = ({ blogPosts }: InferGetStaticPropsType<typeof getStaticProps>) => {
    const [activePage, setActivePage] = useState<PostType>('OUTFIT');
    const [post, setPost] = useState<ExplorePost | null>(null);
    const [postModalOpen, setPostModalOpen] = useState<boolean>(false);

    const { query } = useRouter();

    const { data, refetch, fetchNextPage, isFetching, hasNextPage, isFetchingNextPage, isRefetching } = api.post.getLatestPosts.useInfiniteQuery({ type: activePage }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

    const { data: allTypesData,
        isFetching: allTypesIsFetching,
        hasNextPage: allTypesHasNextPage,
        isFetchingNextPage: allTypesIsFetchingNextPage,
        isRefetching: allTypesIsRefetching,
        fetchNextPage: allTypesFetchNextPage
    } = api.post.getLatestPosts.useInfiniteQuery({}, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

    const handleFetchNextPage = () => {
        fetchNextPage();
    };

    const handleFetchAllTypesNextPage = () => {
        allTypesFetchNextPage();
    };

    useEffect(() => {
        refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activePage])

    const toShow = data?.pages.flatMap((page) => page.posts);

    useEffect(() => {
        if (query.postId) {
            const post = toShow?.find(p => p.id === query.postId) ?? allTypesData?.pages.flatMap((page) => page.posts).find(p => p.id === query.postId);

            if (post) {
                setPost(post);
                setPostModalOpen(true);
            }
        } else {
            setPost(null);
            setPostModalOpen(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query.postId, toShow]);


    return <Layout
        title="Explore"
    >
        <div className='p-4'>
            {postModalOpen && <ExplorePostModal setPostModalOpen={setPostModalOpen} post={post} />}

            <h1 className='font-clash text-5xl font-black mb-6 hidden lg:inline-block'>Seek fashion inspiration from the best!</h1>

            <div className='overflow-x-scroll flex gap-4 pb-1'>
                <Button onClick={() => setActivePage('OUTFIT')} variant={activePage === 'OUTFIT' ? 'primary' : 'outline'} iconLeft={getPostTypeIconSmall('OUTFIT')} centerItems>
                    {getPostTypeName('OUTFIT')}
                </Button>

                <Button onClick={() => setActivePage('HOODIE')} variant={activePage === 'HOODIE' ? 'primary' : 'outline'} iconLeft={getPostTypeIconSmall('HOODIE')} centerItems>
                    {getPostTypeName('HOODIE')}
                </Button>

                <Button onClick={() => setActivePage('PANTS')} variant={activePage === 'PANTS' ? 'primary' : 'outline'} iconLeft={getPostTypeIconSmall('PANTS')} centerItems>
                    {getPostTypeName('PANTS')}
                </Button>

                <Button onClick={() => setActivePage('SHIRT')} variant={activePage === 'SHIRT' ? 'primary' : 'outline'} iconLeft={getPostTypeIconSmall('SHIRT')} centerItems>
                    {getPostTypeName('SHIRT')}
                </Button>

                <Button onClick={() => setActivePage('SHOES')} variant={activePage === 'SHOES' ? 'primary' : 'outline'} iconLeft={getPostTypeIconSmall('SHOES')} centerItems>
                    {getPostTypeName('SHOES')}
                </Button>

                <Button onClick={() => setActivePage('WATCH')} variant={activePage === 'WATCH' ? 'primary' : 'outline'} iconLeft={getPostTypeIconSmall('WATCH')} centerItems>
                    {getPostTypeName('WATCH')}
                </Button>

                <Button onClick={() => setActivePage('HEADWEAR')} variant={activePage === 'HEADWEAR' ? 'primary' : 'outline'} iconLeft={getPostTypeIconSmall('HEADWEAR')} centerItems>
                    {getPostTypeName('HEADWEAR')}
                </Button>

                <Button onClick={() => setActivePage('JEWELRY')} variant={activePage === 'JEWELRY' ? 'primary' : 'outline'} iconLeft={getPostTypeIconSmall('JEWELRY')} centerItems>
                    {getPostTypeName('JEWELRY')}
                </Button>

                <Button onClick={() => setActivePage('GLASSES')} variant={activePage === 'GLASSES' ? 'primary' : 'outline'} iconLeft={getPostTypeIconSmall('GLASSES')} centerItems>
                    {getPostTypeName('GLASSES')}
                </Button>
            </div>

            <div className='flex mt-4 gap-4 overflow-x-scroll pb-1'>
                {isFetching && !isFetchingNextPage && !isRefetching ? <>
                    <PostSkeleton size={'sm'} />
                    <PostSkeleton size={'sm'} />
                    <PostSkeleton size={'sm'} />
                    <PostSkeleton size={'sm'} />
                    <PostSkeleton size={'sm'} />
                </> : toShow?.map((post) => (
                    <>
                        <Link href={`/explore/?postId=${post.id}`} key={post.id} className='w-[126px] h-[206px] min-w-[126px] border border-stroke rounded-md relative overflow-hidden'>
                            <Image
                                // 176px is the same as w-44, the width of the container
                                sizes="126px"
                                src={formatImage(post.image, post.user.id)}
                                className="object-cover"
                                fill
                                alt={post.type}
                                priority
                            />

                            <div className='flex flex-col justify-end items-center p-2 absolute inset-0 bg-gradient-to-b from-transparent to-black w-full h-full bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100'>
                                <div className='flex gap-2 w-full'>
                                    <Image className='rounded-full object-contain' src={formatAvatar(post.user.image, post.user.id)} alt={post.user.username ?? ""} width={24} height={24} />

                                    <h1 className='text-white flex gap-1 items-center text-sm w-full'>
                                        <span className='truncate'>{post.user.username}</span>
                                        {post.user.admin ? <PiHammer className='w-4 h-4' /> : post.user.verified && <PiSealCheck className='w-4 h-4' />}
                                    </h1>
                                </div>
                            </div>

                        </Link>
                    </>
                ))}

                {hasNextPage && <div className='w-[126px] h-[206px] flex items-center'>
                    <Button onClick={handleFetchNextPage} variant='outline' centerItems>
                        Load More
                    </Button>
                </div>}
            </div>

            <p className='hidden md:inline-block font-clash font-semibold text-secondary-text mb-2'>Pro tip: You can scroll by holding Shift + Mouse Scroll!</p>

            <h1 className='font-black text-3xl my-2 font-clash'>Latest Uploads</h1>

            <div className='flex mt-4 gap-4 overflow-x-scroll pb-1'>
                {allTypesIsFetching && !allTypesIsFetchingNextPage && !allTypesIsRefetching ? <>
                    <PostSkeleton size={'sm'} />
                    <PostSkeleton size={'sm'} />
                    <PostSkeleton size={'sm'} />
                    <PostSkeleton size={'sm'} />
                    <PostSkeleton size={'sm'} />
                </> : allTypesData?.pages.flatMap((page) => page.posts).map((post, i) => (
                    <>
                        <Link href={`/explore?postId=${post.id}`} key={post.id} className='w-[126px] h-[206px] min-w-[126px] border border-stroke rounded-md relative overflow-hidden'>
                            <Image
                                // 176px is the same as w-44, the width of the container
                                sizes="126px"
                                src={formatImage(post.image, post.user.id)}
                                className="object-cover"
                                fill
                                alt={post.type}
                                priority
                            />

                            <div className='flex flex-col justify-end items-center p-2 absolute inset-0 bg-gradient-to-b from-transparent to-black w-full h-full bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100'>
                                <div className='flex gap-2 w-full'>
                                    <Image className='rounded-full object-contain' src={formatAvatar(post.user.image, post.user.id)} alt={post.user.username ?? ""} width={24} height={24} />

                                    <h1 className='text-white flex gap-1 items-center text-sm w-full'>
                                        <span className='truncate'>{post.user.username}</span>
                                        {post.user.admin ? <PiHammer className='w-4 h-4' /> : post.user.verified && <PiSealCheck className='w-4 h-4' />}
                                    </h1>
                                </div>
                            </div>

                        </Link>
                    </>
                ))}

                {allTypesHasNextPage && <div className='w-[126px] h-[206px] flex items-center'>
                    <Button onClick={handleFetchAllTypesNextPage} variant='outline' centerItems>
                        Load More
                    </Button>
                </div>}
            </div>

            <h1 className='font-black text-3xl mb-2 mt-5 font-clash'>Blog Posts</h1>
            <div className='flex mt-4 gap-4 overflow-x-scroll pb-1 w-full'>
                {blogPosts.map((post) => (
                    <Link href={`/blog/${post.id}`} key={post.id} className='w-72 h-44 min-w-[288px] p-4 flex flex-col items-start justify-end border border-stroke rounded-md hover:shadow-lg transition-all duration-200'>
                        <h1 className='font-clash font-bold text-3xl'>{post.title}</h1>
                        {post.date}
                    </Link>
                ))}
            </div>
        </div>
    </Layout>
}

export const getStaticProps: GetStaticProps<{
    blogPosts: {
        date: string;
        title: string;
        id: string;
    }[]
}> = async () => {
    const blogPosts = getSortedPostsData();
    return {
        props: {
            blogPosts,
        },
    };
}

export default ExplorePage;