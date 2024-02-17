import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { PiPlus } from 'react-icons/pi';

import {
    getPostTypeCount, getPostTypeIcon, getPostTypeName, onError, onMutate, onSettled,
    PostSectionProps
} from './post-section.util';
import { Button } from '../Button';
import { PostCropModal } from '../PostCropModal';
import { Spinner } from '../Spinner';

import { useFileUpload } from '~/hooks/file-upload.hook';
import { api } from '~/utils/api.util';
import { formatImage } from '~/utils/image-src-format.util';


export const PostSection = ({ profileData, postsData, type, loading }: PostSectionProps) => {

    const { data: session } = useSession();
    const ctx = api.useContext();


    const { handleChange, dragActive, file, fileUrl, handleDrag, handleDrop, setFile, setFileUrl, cropModalOpen, setCropModalOpen } = useFileUpload();

    const [isCropped, setIsCropped] = useState<boolean>(false);
    const [, setDeleteButton] = useState<string | null>(null);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCropped]);

    /**
     * This creates a presigned url for the image and then uploads the image to the presigned url
     * onMutate, onError, and onSettled are custom functions in ./post-section.util.ts that handle optimistic updates
     */
    const { mutate, isLoading } = api.post.createPost.useMutation({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onMutate: (newPost) => onMutate(ctx, (old) => [newPost, ...old as any], profileData?.id),
        onError: (err, context) => onError(ctx, err, context, "Failed to create post!", profileData?.id),
        onSettled: () => onSettled(ctx, profileData?.username),
        onSuccess: async (result) => {
            await axios.put(result.res, file);
        }
    });

    const posts = postsData?.filter(p => p.type === type);
    const userIsProfileOwner = session?.user.id === profileData?.id;
    const postsExist = posts?.length !== 0;

    // There's nothing to see here and no button to upload since you aren't the owner, so don't show anything
    if (!userIsProfileOwner && !postsExist) return null;

    return (
        <div className="w-full pr-2" key={type}>
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

            {(postsExist || userIsProfileOwner) && !loading && <h2 className={postsExist ? "pr-2 text-2xl md:text-4xl mb-5 flex items-center gap-3 font-clash" : "pr-2 text-2xl md:text-4xl md:mb-5 items-center gap-3 font-clash hidden md:flex"}>
                {getPostTypeIcon(type)}
                <span><span className='font-semibold'>{getPostTypeCount(type, profileData)}</span> {getPostTypeName(type)}</span>

                <div>
                    {(userIsProfileOwner && !postsExist) &&
                        <Button className='hidden md:block' onClick={() => ref.current?.click()} type='submit' variant={'ghost'} shape={'square'}>
                            <div className='flex items-center justify-center'>
                                <PiPlus className='text-2xl' />
                            </div>
                        </Button>
                    }
                </div>
            </h2>}

            <div className={postsExist ? 'w-full overflow-scroll-auto mb-5' : 'w-full overflow-scroll-auto md:mb-5'}>
                <div className="flex gap-4 min-w-max pb-1">
                    {posts?.map((post, i) => (
                        <>
                            <Link
                                href={`/${profileData?.username}?postId=${post.id}`}
                                onMouseEnter={() => setDeleteButton(post.id)}
                                onMouseLeave={() => setDeleteButton(null)}
                                key={post.id ?? `loading_${i}`}
                                className="w-[126px] h-[206px] border border rounded-md relative overflow-hidden">

                                {isLoading && i === 0 ?
                                    <div className='bg-hover w-full h-full flex items-center justify-center'>
                                        <Spinner />
                                    </div>
                                    :
                                    post.id &&
                                    <Image
                                        sizes="126px"
                                        src={formatImage(post.image, profileData?.id)}
                                        className="object-cover"
                                        fill
                                        alt={post.type}
                                        // Outfits and Hoodies are above the fold on most screens, so we want to prioritize them
                                        priority={post.type === 'OUTFIT' || post.type === 'HOODIE'}
                                    />
                                }
                            </Link>
                        </>
                    ))}
                    {(userIsProfileOwner) && <div onDragEnter={handleDrag} className='relative hidden md:block'>
                        <input ref={ref} type="file" className='hidden' accept='image/*' onChange={handleChange} />
                        {postsExist && <>
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
                                className='w-[126px] h-[206px] border hover:bg-hover border flex items-center justify-center font-bold flex-col text-sm rounded-md'>
                                <PiPlus className='w-12 h-12 text-secondary-text' />
                            </button>
                        </>}
                    </div>}
                </div>
            </div>
        </div>
    );
}
