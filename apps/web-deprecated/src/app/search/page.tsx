"use client";

import debounce from 'lodash.debounce';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
    PiCamera, PiHammer, PiHeart, PiMagnifyingGlass, PiSealCheck, PiSpinnerGap
} from 'react-icons/pi';
import { Avatar } from '~/components/Avatar';
import { Button } from '~/components/Button';
import { Layout } from '~/components/Layout';
import { api } from '~/components/TRPCWrapper';


export const SearchPage: NextPage = () => {
    const { query } = useRouter();

    const username = query.username?.toString();

    const [input, setInput] = useState(username ?? '');

    const request = debounce(async () => {
        refetch();
    }, 300)

    const debounceRequest = useCallback(() => {
        request()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (username) {
            debounceRequest();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username]);

    const { data: searchData, isFetching, refetch, fetchNextPage, isFetchingNextPage, hasNextPage } = api.user.searchProfiles.useInfiniteQuery({ username: input }, {
        enabled: !!username,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
    });

    const users = searchData?.pages.flatMap((page) => page?.users);

    const { data: totalUsers } = api.user.getTotalUsers.useQuery(undefined);

    return <Layout title='Search' hideSearch={true}>
        <div className='flex flex-col items-center p-4 w-screen'>

            <div className='flex relative items-center font-clash font-medium w-full md:w-5/6 lg:w-3/4 xl:w-1/2'>
                <input
                    id="link"
                    type="text"
                    placeholder='Search for users'
                    className="pl-4 py-2 w-full border rounded-md border-stroke dark:text-white dark:bg-black"
                    onChange={(e) => {
                        setInput(e.target.value)
                        debounceRequest()
                    }}
                    value={input}
                />
                <div className='absolute h-full right-14 w-[1px] bg-stroke' />

                {isFetching ? <PiSpinnerGap className='absolute right-4 text-gray-400 dark:text-white w-6 h-6 animate-spin' /> : <PiMagnifyingGlass className='absolute right-4 text-gray-400 dark:text-white w-6 h-6' />}

                {input.length > 0 && <div className='absolute top-12 w-full flex flex-col gap-1'>

                    {(users?.length ?? 0) > 0 ? users?.map((user) => (
                        <Link href={`/${user?.username}`} key={user?.id}>
                            <div className='bg-white dark:bg-black border border-stroke p-4 rounded-md hover:bg-body dark:hover:bg-body cursor-pointer flex gap-2'>
                                <Avatar image={user?.image} id={user?.id} username={user?.username} />

                                <div className='flex flex-col gap-1'>
                                    <h1 className='font-black flex gap-1 items-center'>
                                        <span>{user?.username}</span>
                                        {user?.admin ? <PiHammer className='w-4 h-4' /> : user?.verified && <PiSealCheck className='w-4 h-4' />}
                                    </h1>
                                    <p className='text-xs'>{user?.tagline}</p>

                                    <div className='flex gap-2 items-center text-xs'>
                                        <span className='flex gap-1 items-center'>
                                            <PiCamera className='w-3 h-3' />
                                            <span>{user?.imageCount} Shots</span>
                                        </span>
                                        <span className='flex gap-1 items-center'>
                                            <PiHeart className='w-3 h-3' />
                                            <span>{user?.likeCount} Likes</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )) : <div className='bg-white dark:bg-black border border-stroke p-4 rounded-md'>No results</div>}
                    {hasNextPage && <Button onClick={() => fetchNextPage()} centerItems variant={'ghost'} isLoading={isFetchingNextPage}>
                        Load More
                    </Button>}
                </div>
                }

            </div>
        </div>
        <p className='text-sm text-secondary-text font-clash w-full text-center'>{totalUsers} users have signed up for outfits.bio!</p>
    </Layout>
}

export default SearchPage;