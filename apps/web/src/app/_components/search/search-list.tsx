"use client";

import { api } from "@/trpc/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PiCamera, PiHammer, PiHeart, PiSealCheck } from "react-icons/pi";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { SearchBar } from "./search-bar/standalone";

interface SearchListProps {
    searchParams: { username: string };
}

export function SearchList({ searchParams }: SearchListProps) {
    const params = useSearchParams();
    const [input, setInput] = useState(searchParams.username);

    const { data: searchData, isFetching, refetch, fetchNextPage, isFetchingNextPage, hasNextPage } = api.user.searchProfiles.useInfiniteQuery({ username: input }, {
        enabled: false,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
    });

    const users = input.length > 0 ? searchData?.pages.flatMap((page) => page?.users) : [];

    useEffect(() => {
        setInput(params.get('username') ?? '');
        void refetch();
    }, [params.get('username')]);

    return <div className="w-full md:w-5/6 lg:w-3/4 xl:w-1/2">
        <SearchBar isFetching={isFetching} refetch={refetch} input={input} setInput={setInput} />

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
        )) : !isFetching && <div className='bg-white dark:bg-black border border-stroke p-4 rounded-md'>No results</div>}
        {hasNextPage && <Button onClick={() => fetchNextPage()} centerItems variant={'ghost'} isLoading={isFetchingNextPage}>
            Load More
        </Button>}
    </div>
}