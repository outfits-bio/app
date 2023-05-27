import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { AppRouter } from '~/server/api/root';
import { api } from '~/utils/api';

import { Trash } from '@phosphor-icons/react';
import { Post, PostType } from '@prisma/client';
import { inferRouterOutputs } from '@trpc/server';

import { Spinner } from './Spinner';

type RouterOutput = inferRouterOutputs<AppRouter>;

interface Props {
    profileData?: RouterOutput['user']['getProfile'];
    postsData?: RouterOutput['post']['getPostsAllTypes'];
    type: PostType;
}

const getPostTypeName = (type: PostType): string => {
    switch (type) {
        case PostType.OUTFIT:
            return 'Outfits';
        case PostType.HOODIE:
            return 'Hoodies';
        case PostType.SHIRT:
            return 'Shirts';
        case PostType.PANTS:
            return 'Pants';
        case PostType.SHOES:
            return 'Shoes';
        case PostType.WATCH:
            return 'Watches';
    }
}

const getPostTypeCount = (type: PostType, profileData?: RouterOutput['user']['getProfile']): number => {
    switch (type) {
        case PostType.OUTFIT:
            return profileData?.outfitPostCount ?? 0;
        case PostType.HOODIE:
            return profileData?.hoodiePostCount ?? 0;
        case PostType.SHIRT:
            return profileData?.shirtPostCount ?? 0;
        case PostType.PANTS:
            return profileData?.pantsPostCount ?? 0;
        case PostType.SHOES:
            return profileData?.shoesPostCount ?? 0;
        case PostType.WATCH:
            return profileData?.watchPostCount ?? 0;
    }
}

export const PostSection = ({ profileData, postsData, type }: Props) => {
    const { data: session } = useSession();

    const [file, setFile] = useState<any>(null);
    const [dragActive, setDragActive] = useState<boolean>(false);
    const [deleteButton, setDeleteButton] = useState<string | null>(null);

    const ref = useRef<HTMLInputElement>(null);

    const ctx = api.useContext();

    const { mutate, isLoading } = api.post.createPost.useMutation({
        onMutate: async (newPost) => {
            await ctx.post.getPostsAllTypes.invalidate();

            const prevData = ctx.post.getPostsAllTypes.getData();

            ctx.post.getPostsAllTypes.setData({ id: profileData?.id ?? '' }, (old) => [newPost, ...old as any]);

            return { prevData }
        },
        onError: async (_err, _newPost, context) => {
            ctx.post.getPostsAllTypes.setData({ id: profileData?.id ?? '' }, context!.prevData);
        },
        onSettled: async () => {
            ctx.post.getPostsAllTypes.invalidate();
            ctx.user.getProfile.invalidate({ username: profileData?.username ?? '' });
        },
        onSuccess: async (result) => {
            await axios.put(result.res, file);
        }
    });

    const { mutate: deletePost } = api.post.deletePost.useMutation({
        onMutate: async (newPost) => {
            await ctx.post.getPostsAllTypes.invalidate();

            const prevData = ctx.post.getPostsAllTypes.getData();

            ctx.post.getPostsAllTypes.setData({ id: profileData?.id ?? '' }, (old) => old?.filter((p) => p.id !== newPost.id));

            return { prevData }
        },
        onError: async (_err, _newPost, context) => {
            ctx.post.getPostsAllTypes.setData({ id: profileData?.id ?? '' }, context!.prevData);
        },
        onSettled: async () => {
            ctx.post.getPostsAllTypes.invalidate();
            ctx.user.getProfile.invalidate({ username: profileData?.username ?? '' });
        }
    });

    const handleFileChange = (e: React.FormEvent<HTMLInputElement>) => {
        if (!e.currentTarget?.files?.length) return;

        setFile(e.currentTarget.files[0] ?? null);

        mutate({
            type,
        });
    }

    const handleDrag = function (e: any) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = function (e: any) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (!e.dataTransfer?.files?.length) return;

        setFile(e.dataTransfer.files[0] ?? null);

        mutate({
            type,
        });
    };

    const posts = postsData?.filter(p => p.type === type);


    return session?.user.id !== profileData?.id && posts?.length === 0 ? null : (
        <div className="pt-10 pl-10 w-full">
            <h2 className="text-3xl font-bold mb-10">{getPostTypeName(type)} ({getPostTypeCount(type, profileData)})</h2>
            <div className='w-full overflow-scroll'>
                <div className="flex gap-4 min-w-max">
                    {postsData?.filter(p => p.type === type).map((post, i) => (
                        <div onMouseEnter={() => setDeleteButton(post.id)} onMouseLeave={() => setDeleteButton(null)} key={post.id ?? 'loading'} className="w-32 h-48 border border-gray-500 rounded-md relative">
                            {isLoading && i === 0 ? <div className='bg-slate-100 w-full h-full flex items-center justify-center'><Spinner /></div> : post.id && <Image sizes="128px" src={`https://pub-4bf8804d3efc464b862de36f974618d4.r2.dev/${profileData?.id}/${post.image}.png`} className="object-cover" fill alt={post.type} priority={post.type === 'OUTFIT' || post.type === 'HOODIE'} />}

                            {session?.user?.id === profileData?.id && deleteButton === post.id && <button onClick={() => deletePost({ id: post.id })} className='flex items-center justify-center text-white text-lg absolute -top-2 -right-1 w-8 h-8 bg-red-500 rounded-full'>
                                <Trash />
                            </button>}
                        </div>
                    ))}


                    {session?.user?.id === profileData?.id && <div onDragEnter={handleDrag} className='relative'>
                        <input ref={ref} type="file" className='hidden' onChange={handleFileChange} />
                        {dragActive && <div className='absolute w-full h-full t-0 r-0 b-0 l-0' onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
                        <button onClick={() => ref.current?.click()} type='submit' className='hover:bg-slate-100 w-32 h-48 border border-gray-500 flex items-center justify-center font-bold flex-col text-sm rounded-md'>
                            <div>Create new:</div>
                            <div>Drag & Drop</div>
                            <div className='text-xs text-gray-500 font-semibold mt-2'>Or click here</div>
                        </button>
                    </div>}
                </div>
            </div>
        </div>
    )
}