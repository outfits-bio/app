"use client";

import { api } from "@/trpc/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { PiCamera, PiHammer, PiHeart, PiSealCheck } from "react-icons/pi";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { SearchBar } from "./search-bar/standalone";

export function SearchList() {
    const params = useSearchParams();

    const username = params.get('username')?.toString();

    const [input, setInput] = useState<string>(username ?? "");

    const { data: searchData, isFetching, isRefetching, refetch, fetchNextPage, isFetchingNextPage, hasNextPage } = api.user.searchProfiles.useInfiniteQuery({ username: input }, {
        enabled: !!username,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
    });

    const users = searchData?.pages.flatMap((page) => page?.users);

    const isLoading = isFetching || isRefetching || isFetchingNextPage;

    return <div className="w-full md:w-5/6 lg:w-3/4 xl:w-1/2">
        <SearchBar isFetching={isLoading} refetch={refetch} input={input} setInput={setInput} />

        {input.length > 0 && <div className="flex flex-col gap-2">
            {(users?.length ?? 0) > 0 ? users?.map((user) => (
                <Link href={`/${user?.username}`} key={user?.id ?? ""}>
                    <div className='bg-white dark:bg-black border border-stroke p-4 rounded-xl hover:bg-body dark:hover:bg-body cursor-pointer flex gap-2'>
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
            )) : <div className='bg-white dark:bg-black border border-stroke p-4 rounded-xl'>No results</div>}
        </div>}
        {hasNextPage && <Button onClick={() => fetchNextPage()} centerItems variant={'ghost'} isLoading={isFetchingNextPage}>
            Load More
        </Button>}
    </div>
}