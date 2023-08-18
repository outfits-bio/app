import debounce from 'lodash.debounce';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { Layout } from '~/components/Layout';
import { api } from '~/utils/api.util';
import { formatAvatar } from '~/utils/image-src-format.util';

import {
    Camera, Hammer, Heart, MagnifyingGlass, SealCheck, SpinnerGap
} from '@phosphor-icons/react';

export const SearchPage: NextPage = () => {
    const [input, setInput] = useState('');

    const request = debounce(async () => {
        refetch();
    }, 300)

    const debounceRequest = useCallback(() => {
        request()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const { data: searchData, isFetching, refetch, isFetched } = api.user.searchProfiles.useQuery({ username: input }, {
        enabled: false
    });

    const { data: totalUsers } = api.user.getTotalUsers.useQuery(undefined);

    return <Layout title='Search'>
        <div className='flex flex-col items-center p-4 w-screen'>
            <div className='flex relative items-center font-urbanist font-medium w-full md:w-5/6 lg:w-3/4 xl:w-1/2'>
                {isFetching ? <SpinnerGap className='absolute left-4 text-gray-400 dark:text-white w-6 h-6 animate-spin' /> : <MagnifyingGlass className='absolute left-4 text-gray-400 dark:text-white w-6 h-6' />}
                <input
                    id="link"
                    type="text"
                    placeholder='Search for users'
                    className="pl-12 py-2 w-full border rounded-md border-black dark:border-white dark:text-white dark:bg-black"
                    onChange={(e) => {
                        setInput(e.target.value)
                        debounceRequest()
                    }}
                    value={input}
                />

                {input.length > 0 && <div className='absolute top-12 w-full flex flex-col gap-1'>

                    {(searchData?.length ?? 0) > 0 ? searchData?.map((user) => (
                        <Link href={`/${user.username}`} key={user.id}>
                            <div className='bg-white border border-black p-4 rounded-md hover:bg-slate-100 dark:hover:bg-slate-950 cursor-pointer flex gap-2'>
                                <div className='basis-16 w-16 h-16 grow-0 shrink-0 md:basis-auto relative'>
                                    <Image className='rounded-full object-contain' priority src={formatAvatar(user.image, user.id)} alt={user.username ?? ""} fill />
                                </div>

                                <div className='flex flex-col gap-1'>
                                    <h1 className='font-black flex gap-1 items-center'>
                                        <span>{user.username}</span>
                                        {user.admin ? <Hammer className='w-4 h-4' /> : user.verified && <SealCheck className='w-4 h-4' />}
                                    </h1>
                                    <p className='text-xs'>{user.tagline}</p>

                                    <div className='flex gap-2 items-center text-xs'>
                                        <span className='flex gap-1 items-center'>
                                            <Camera className='w-3 h-3' />
                                            <span>{user.imageCount} Shots</span>
                                        </span>
                                        <span className='flex gap-1 items-center'>
                                            <Heart className='w-3 h-3' />
                                            <span>{user.likeCount} Likes</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )) : <div className='bg-white border border-black p-4 rounded-md'>No results</div>}
                </div>
                }

            </div>
        </div>
        <p className='absolute md:bottom-4 bottom-28 left-1/2 -translate-x-1/2 text-sm text-gray-500 font-urbanist w-full text-center'>{totalUsers} users have signed up for outfits.bio!</p>
    </Layout>
}

export default SearchPage;