"use client";

import { Dialog, Transition } from '@headlessui/react';
import { useSession } from 'next-auth/react';
import localFont from 'next/font/local';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';
import { PiHammer, PiSealCheck, PiX } from 'react-icons/pi';


import { useParamsModal } from '@/hooks/params-modal.hook';
import type { RouterOutputs } from '@/trpc/shared';
import { formatAvatar, formatImage } from '@/utils/image-src-format.util';
import { getPostTypeName } from '@/utils/names.util';
import { LikeButton } from '../discover/post/like-button';
import { PostMenu } from '../menus/post-menu';


export type DiscoverPost = RouterOutputs['post']['getLatestPosts']['posts'][0];

interface DiscoverPostModalProps {
    post: DiscoverPost | null;
}

const clash = localFont({
    src: '../../../../public/fonts/ClashDisplay-Variable.woff2',
    display: 'swap',
    variable: '--font-clash',
});

const satoshi = localFont({
    src: '../../../../public/fonts/Satoshi-Variable.woff2',
    display: 'swap',
    variable: '--font-satoshi',
});

export const DiscoverPostModal = ({ post }: DiscoverPostModalProps) => {
    const { data } = useSession();
    const { close } = useParamsModal('postId');

    const userIsProfileOwner = data?.user.id === post?.user.id;

    if (!post) return null;

    return <Transition appear show={true} as={Fragment}>
        <Dialog as="div" className={`relative z-10 ${clash.variable} ${satoshi.variable} font-clash`} onClose={close}>
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-100"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center text-center gap-12">

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-100"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-100"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className={`relative overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all w-[400px] h-[654px]`}>
                            <Image src={formatImage(post.image, post.user.id)} alt={post.type ?? ''} fill className='rounded-xl border border-stroke object-cover' />
                            <button className='absolute left-4 top-4 text-white' onClick={close}>
                                <PiX className='w-5 h-4' />
                            </button>

                            <div className='flex flex-col justify-end items-center p-4 absolute bottom-0 bg-gradient-to-b from-transparent to-black w-full h-1/4 bg-fixed'>
                                <div className='text-white flex w-full gap-2 mb-2 pl-0.5'>
                                    {/* {getPostTypeIconSmall(post.type)} */}
                                    <h1 className='font-clash'>{getPostTypeName(post.type)}</h1>
                                </div>

                                <div className='flex justify-between items-center w-full'>
                                    <Link href={`/${post.user.username}`} className='flex gap-2'>
                                        <Image className='rounded-full object-cover' src={formatAvatar(post.user.image, post.user.id)} alt={post.user.username ?? ""} width={30} height={30} />

                                        <h1 className='text-white flex gap-1 items-center text-sm w-full'>
                                            <span className='truncate'>{post.user.username}</span>
                                            {post.user.admin ? <PiHammer className='w-4 h-4' /> : post.user.verified && <PiSealCheck className='w-4 h-4' />}
                                        </h1>
                                    </Link>

                                    <div className='flex items-center gap-4'>
                                        {data?.user && <LikeButton variant='ghost' post={post} />}

                                        {data?.user && <PostMenu
                                            userIsProfileOwner={userIsProfileOwner}
                                            postId={post.id}
                                        />}
                                    </div>
                                </div>
                            </div>
                        </Dialog.Panel>

                    </Transition.Child>
                </div>
            </div>
        </Dialog>
    </Transition>
}