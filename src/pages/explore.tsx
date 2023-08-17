import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Button } from '~/components/Button';
import { Layout } from '~/components/Layout';
import { PostModal } from '~/components/PostModal';
import { api } from '~/utils/api.util';
import { formatAvatar, formatImage } from '~/utils/image-src-format.util';

import {
    CoatHanger, Hammer, Hoodie, Pants, SealCheck, Sneaker, TShirt, Watch
} from '@phosphor-icons/react';
import { PostType } from '@prisma/client';

export const ExplorePage: NextPage = () => {
    const [activePage, setActivePage] = useState<PostType>('OUTFIT');

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
    }, [activePage])

    const toShow = data?.pages.flatMap((page) => page.posts);

    return <Layout
        title="Explore"
    >
        <div className='p-4'>
            <div className='overflow-x-scroll flex gap-4 pb-1'>
                <Button onClick={() => setActivePage('OUTFIT')} variant={activePage === 'OUTFIT' ? 'primary' : 'outline'} iconLeft={<CoatHanger />} centerItems>
                    Outfits
                </Button>

                <Button onClick={() => setActivePage('HOODIE')} variant={activePage === 'HOODIE' ? 'primary' : 'outline'} iconLeft={<Hoodie />} centerItems>
                    Hoodies
                </Button>

                <Button onClick={() => setActivePage('PANTS')} variant={activePage === 'PANTS' ? 'primary' : 'outline'} iconLeft={<Pants />} centerItems>
                    Pants
                </Button>

                <Button onClick={() => setActivePage('SHIRT')} variant={activePage === 'SHIRT' ? 'primary' : 'outline'} iconLeft={<TShirt />} centerItems>
                    Shirts
                </Button>

                <Button onClick={() => setActivePage('SHOES')} variant={activePage === 'SHOES' ? 'primary' : 'outline'} iconLeft={<Sneaker />} centerItems>
                    Shoes
                </Button>

                <Button onClick={() => setActivePage('WATCH')} variant={activePage === 'WATCH' ? 'primary' : 'outline'} iconLeft={<Watch />} centerItems>
                    Accessories
                </Button>
            </div>

            <div className='flex mt-4 gap-4 overflow-x-scroll pb-1'>
                {isFetching && !isFetchingNextPage && !isRefetching ? <>
                    <div className='w-44 h-72 min-w-[176px] border border-gray-200 rounded-md relative bg-gray-200 animate-pulse' />
                    <div className='w-44 h-72 min-w-[176px] border border-gray-200 rounded-md relative bg-gray-200 animate-pulse' />
                    <div className='w-44 h-72 min-w-[176px] border border-gray-200 rounded-md relative bg-gray-200 animate-pulse' />
                    <div className='w-44 h-72 min-w-[176px] border border-gray-200 rounded-md relative bg-gray-200 animate-pulse' />
                    <div className='w-44 h-72 min-w-[176px] border border-gray-200 rounded-md relative bg-gray-200 animate-pulse' />
                </> : toShow?.map((post, i) => (
                    <>
                        <Link href={`/explore/?postId=${post.id}`} key={post.id} className='w-44 h-72 min-w-[176px] border border-gray-500 rounded-md relative'>
                            <Image
                                // 176px is the same as w-44, the width of the container
                                sizes="176px"
                                src={formatImage(post.image, post.user.id)}
                                className="object-cover"
                                fill
                                alt={post.type}
                                priority
                            />

                            <div className='flex flex-col justify-end items-center p-2 absolute inset-0 bg-gradient-to-b from-transparent to-black w-full h-full bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100'>
                                <div className='flex gap-2 w-full'>
                                    <Image className='rounded-full object-contain' src={formatAvatar(post.user.image, post.user.id)} alt={post.user.username ?? ""} width={30} height={30} />

                                    <h1 className='text-white flex gap-1 items-center text-sm w-full'>
                                        <span className='truncate'>{post.user.username}</span>
                                        {post.user.admin ? <Hammer className='w-4 h-4' /> : post.user.verified && <SealCheck className='w-4 h-4' />}
                                    </h1>
                                </div>
                            </div>

                        </Link>

                        <PostModal index={i} explorePost={toShow} key={post.id} />
                    </>
                ))}

                {hasNextPage && <div className='h-72 w-44 flex items-center'>
                    <Button onClick={handleFetchNextPage} variant='outline' centerItems>
                        Load More
                    </Button>
                </div>}
            </div>

            <h1 className='font-black text-3xl my-2 font-urbanist'>Latest Uploads</h1>

            <div className='flex mt-4 gap-4 overflow-x-scroll pb-1'>
                {allTypesIsFetching && !allTypesIsFetchingNextPage && !allTypesIsRefetching ? <>
                    <div className='w-44 h-72 min-w-[176px] border border-gray-200 rounded-md relative bg-gray-200 animate-pulse' />
                    <div className='w-44 h-72 min-w-[176px] border border-gray-200 rounded-md relative bg-gray-200 animate-pulse' />
                    <div className='w-44 h-72 min-w-[176px] border border-gray-200 rounded-md relative bg-gray-200 animate-pulse' />
                    <div className='w-44 h-72 min-w-[176px] border border-gray-200 rounded-md relative bg-gray-200 animate-pulse' />
                    <div className='w-44 h-72 min-w-[176px] border border-gray-200 rounded-md relative bg-gray-200 animate-pulse' />
                </> : allTypesData?.pages.flatMap((page) => page.posts).map((post, i) => (
                    <>
                        <Link href={`/explore?postId=${post.id}`} key={post.id} className='w-44 h-72 min-w-[176px] border border-gray-500 rounded-md relative'>
                            <Image
                                // 176px is the same as w-44, the width of the container
                                sizes="176px"
                                src={formatImage(post.image, post.user.id)}
                                className="object-cover"
                                fill
                                alt={post.type}
                                priority
                            />

                            <div className='flex flex-col justify-end items-center p-2 absolute inset-0 bg-gradient-to-b from-transparent to-black w-full h-full bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100'>
                                <div className='flex gap-2 w-full'>
                                    <Image className='rounded-full object-contain' src={formatAvatar(post.user.image, post.user.id)} alt={post.user.username ?? ""} width={30} height={30} />

                                    <h1 className='text-white flex gap-1 items-center text-sm w-full'>
                                        <span className='truncate'>{post.user.username}</span>
                                        {post.user.admin ? <Hammer className='w-4 h-4' /> : post.user.verified && <SealCheck className='w-4 h-4' />}
                                    </h1>
                                </div>
                            </div>

                        </Link>
                        <PostModal index={i} explorePost={allTypesData?.pages.flatMap((page) => page.posts)} key={post.id} />
                    </>
                ))}

                {allTypesHasNextPage && <div className='h-72 w-44 flex items-center'>
                    <Button onClick={handleFetchAllTypesNextPage} variant='outline' centerItems>
                        Load More
                    </Button>
                </div>}
            </div>
        </div>
    </Layout>
}

export default ExplorePage;