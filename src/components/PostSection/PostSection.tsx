import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useFileUpload } from '~/hooks/file-upload.hook';
import { api } from '~/utils/api.util';
import { formatImage } from '~/utils/image-src-format.util';

import { Plus, Trash } from '@phosphor-icons/react';

import { PostCropModal } from '../PostCropModal';
import { PostModal } from '../PostModal';
import { Spinner } from '../Spinner';
import {
    getPostTypeCount, getPostTypeIcon, getPostTypeName, onError, onMutate, onSettled,
    PostSectionProps
} from './post-section.util';

export const PostSection = ({ profileData, postsData, type, loading }: PostSectionProps) => {
    const { query } = useRouter();
    const { data: session } = useSession();
    const ctx = api.useContext();

    const { postId } = query;

    const { handleChange, dragActive, file, fileUrl, handleDrag, handleDrop, setFile, setFileUrl, cropModalOpen, setCropModalOpen } = useFileUpload();

    const [isCropped, setIsCropped] = useState<boolean>(false);
    const [deleteButton, setDeleteButton] = useState<string | null>(null);

    const ref = useRef<HTMLInputElement>(null);

    /**
     * This closes the crop modal and creates the post after the image has been cropped
     * The PostCropModal component sets isCropped to true when the image has been cropped
     */
    useEffect(() => {
        if (isCropped) {
            mutate({ type });
            setIsCropped(false);
        }
    }, [isCropped]);

    /**
     * This creates a presigned url for the image and then uploads the image to the presigned url
     * onMutate, onError, and onSettled are custom functions in ./post-section.util.ts that handle optimistic updates
     */
    const { mutate, isLoading } = api.post.createPost.useMutation({
        onMutate: (newPost) => onMutate(ctx, (old) => [newPost, ...old as any], profileData?.id),
        onError: (err, context) => onError(ctx, err, context, "Failed to create post!", profileData?.id),
        onSettled: () => onSettled(ctx, profileData?.username),
        onSuccess: async (result) => {
            await axios.put(result.res, file);
        }
    });

    /**
     * This deletes the post
     * The image gets removed from the s3 bucket in the backend
     * onMutate, onError, and onSettled are custom functions in ./post-section.util.ts that handle optimistic updates
     */
    const { mutate: deletePost } = api.post.deletePost.useMutation({
        onMutate: (newPost) => onMutate(ctx, (old) => old?.filter((p) => p.id !== newPost.id), profileData?.id),
        onError: (err, context) => onError(ctx, err, context, "Failed to delete post!", profileData?.id),
        onSettled: () => onSettled(ctx, profileData?.username)
    });

    const posts = postsData?.filter(p => p.type === type);
    const userIsProfileOwner = session?.user.id === profileData?.id;
    const postsExist = posts?.length !== 0;

    // There's nothing to see here and no button to upload since you aren't the owner, so don't show anything
    if (!userIsProfileOwner && !postsExist) return null;

    return (
        <div className="w-full pr-2">
            {cropModalOpen && <PostCropModal
                type={type}
                setIsCropped={setIsCropped}
                fileUrl={fileUrl}
                isOpen={cropModalOpen}
                setFile={setFile}
                setFileUrl={setFileUrl}
                setIsOpen={setCropModalOpen}
            />
            }

            {(postsExist || userIsProfileOwner) && !loading && <h2 className="pr-2 text-2xl font-bold mb-8 md:justify-end flex items-center gap-3">{getPostTypeIcon(type)}{`${getPostTypeCount(type, profileData)} ${getPostTypeName(type)}`}</h2>}

            <div className='w-full overflow-scroll mb-8'>
                <div className="flex gap-4 min-w-max md:justify-end pb-1">
                    {userIsProfileOwner && <div onDragEnter={handleDrag} className='relative'>
                        <input ref={ref} type="file" className='hidden' onChange={handleChange} />
                        {dragActive &&
                            <div
                                className='absolute w-full h-full t-0 r-0 b-0 l-0'
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            />
                        }
                        <button
                            onClick={() => ref.current?.click()}
                            type='submit'
                            className='hover:bg-gray-100 dark:hover:bg-gray-700 w-44 h-72 border border-gray-500 flex items-center justify-center font-bold flex-col text-sm rounded-md'>
                            <Plus className='w-12 h-12 text-gray-500' />
                        </button>
                    </div>}

                    {postsData?.filter(p => p.type === type).map((post, i) => (
                        <>
                            <Link
                                href={`/${profileData?.username}?postId=${post.id}`}
                                onMouseEnter={() => setDeleteButton(post.id)}
                                onMouseLeave={() => setDeleteButton(null)}
                                key={post.id ?? 'loading'}
                                className="w-44 h-72 border border-gray-500 rounded-md relative">

                                {isLoading && i === 0 ?
                                    <div className='bg-gray-100 dark:bg-gray-700 w-full h-full flex items-center justify-center'>
                                        <Spinner />
                                    </div>
                                    :
                                    post.id &&
                                    <Image
                                        // 176px is the same as w-44, the width of the container
                                        sizes="176px"
                                        src={formatImage(post.image, profileData?.id)}
                                        className="object-cover"
                                        fill
                                        alt={post.type}
                                        // Outfits and Hoodies are above the fold on most screens, so we want to prioritize them
                                        priority={post.type === 'OUTFIT' || post.type === 'HOODIE'}
                                    />
                                }

                                {userIsProfileOwner && deleteButton === post.id &&
                                    <button
                                        onClick={() => deletePost({ id: post.id })}
                                        className='flex items-center justify-center text-white text-lg absolute -top-2 -right-1 w-8 h-8 bg-red-500 rounded-full'>
                                        <Trash />
                                    </button>
                                }


                            </Link>
                            <PostModal profilePost={postsData?.filter(p => p.type === type)} user={profileData} index={i} />
                        </>
                    ))}
                </div>
            </div>
        </div>
    );
}