import debounce from 'lodash.debounce';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Avatar } from '~/components/Avatar';
import { Layout } from '~/components/Layout';
import { api } from '~/utils/api.util';

import {
    Camera, Hammer, Heart, MagnifyingGlass, SealCheck, SpinnerGap
} from '@phosphor-icons/react';

export const SearchPage: NextPage = ({ username }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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

    const { data: searchData, isFetching, refetch } = api.user.searchProfiles.useQuery({ username: input }, {
        enabled: false,
        refetchOnMount: true,
    });

    const { data: totalUsers } = api.user.getTotalUsers.useQuery(undefined);

    return <Layout title='Search' hideSearch={true}>
        <div className='flex flex-col items-center p-4 w-screen'>

            <div className='flex relative items-center font-clash font-medium w-full md:w-5/6 lg:w-3/4 xl:w-1/2'>
                {isFetching ? <SpinnerGap className='absolute left-4 text-gray-400 dark:text-white w-6 h-6 animate-spin' /> : <MagnifyingGlass className='absolute left-4 text-gray-400 dark:text-white w-6 h-6' />}
                <input
                    id="link"
                    type="text"
                    placeholder='Search for users'
                    className="pl-12 py-2 w-full border rounded-md border-stroke dark:text-white dark:bg-black"
                    onChange={(e) => {
                        setInput(e.target.value)
                        debounceRequest()
                    }}
                    value={input}
                />

                {input.length > 0 && <div className='absolute top-12 w-full flex flex-col gap-1'>

                    {(searchData?.length ?? 0) > 0 ? searchData?.map((user) => (
                        <Link href={`/${user.username}`} key={user.id}>
                            <div className='bg-white dark:bg-black border border-stroke p-4 rounded-md hover:bg-body dark:hover:bg-body cursor-pointer flex gap-2'>
                                <Avatar image={user.image} id={user.id} username={user.username} />

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
                    )) : <div className='bg-white dark:bg-black border border-stroke p-4 rounded-md'>No results</div>}
                </div>
                }

            </div>
        </div>
        <p className='absolute md:bottom-4 bottom-28 left-1/2 -translate-x-1/2 text-sm text-secondary-text font-clash w-full text-center'>{totalUsers} users have signed up for outfits.bio!</p>
    </Layout>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { username } = ctx.query;

    return {
        props: {
            username
        }
    }
}

export default SearchPage;