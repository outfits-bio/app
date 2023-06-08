import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useDragAndDrop } from '~/hooks/drag-and-drop.hook';
import { api } from '~/utils/api.util';
import { formatImage } from '~/utils/image-src-format.util';

import { Trash } from '@phosphor-icons/react';

import { PostCropModal } from '../PostCropModal';
import { Spinner } from '../Spinner';
import {
    getPostTypeCount, getPostTypeName, onError, onMutate, onSettled, PostSectionProps
} from './post-section.util';

export const PostSection = ({ profileData, postsData, type }: PostSectionProps) => {
    const { data: session } = useSession();
    const ctx = api.useContext();

    const { dragActive, file, fileUrl, handleDrag, handleDrop, setFile, setFileUrl, cropModalOpen, setCropModalOpen } = useDragAndDrop();

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

    /**
     * This opens the crop modal and sets the file and fileUrl
     * This only fires when the user clicks on the "Create new" button, not when the user drags and drops
     */
    const handleFileChange = (e: React.FormEvent<HTMLInputElement>) => {
        if (!e.currentTarget?.files?.length) return;

        setFile(e.currentTarget.files[0] ?? null);

        if (e.currentTarget.files[0])
            setFileUrl(URL.createObjectURL(e.currentTarget.files[0]));

        setCropModalOpen(true);
    }

    const posts = postsData?.filter(p => p.type === type);
    const userIsProfileOwner = session?.user.id === profileData?.id;
    const postsExist = posts?.length !== 0;

    // There's nothing to see here and no button to upload since you aren't the owner, so don't show anything
    if (!userIsProfileOwner && !postsExist) return null;

    return (
        <div className="pt-10 pl-10 w-full">
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

            {(postsExist || userIsProfileOwner) && <h2 className="text-2xl font-bold mb-10">{getPostTypeName(type)} ({getPostTypeCount(type, profileData)})</h2>}

            <div className='w-full overflow-scroll'>
                <div className="flex gap-4 min-w-max">
                    {postsData?.filter(p => p.type === type).map((post, i) => (
                        <div
                            onMouseEnter={() => setDeleteButton(post.id)}
                            onMouseLeave={() => setDeleteButton(null)}
                            key={post.id ?? 'loading'}
                            className="w-32 h-48 border border-gray-500 rounded-md relative">

                            {isLoading && i === 0 ?
                                <div className='bg-slate-100 dark:bg-slate-700 w-full h-full flex items-center justify-center'>
                                    <Spinner />
                                </div>
                                :
                                post.id &&
                                <Image
                                    // 128px is the same as w-32, the width of the container
                                    sizes="128px"
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
                        </div>
                    ))}


                    {userIsProfileOwner && <div onDragEnter={handleDrag} className='relative'>
                        <input ref={ref} type="file" className='hidden' onChange={handleFileChange} />
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
                            className='hover:bg-slate-100 dark:hover:bg-slate-700 w-32 h-48 border border-gray-500 flex items-center justify-center font-bold flex-col text-sm rounded-md'>
                            <div>Create new:</div>
                            <div>Drag & Drop</div>
                            <div className='text-xs text-gray-500 font-semibold mt-2'>Or click here</div>
                        </button>
                    </div>}
                </div>
            </div>
        </div>
    );
}