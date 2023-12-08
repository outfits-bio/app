"use client";

import { Listbox, Transition } from "@headlessui/react"
import axios from "axios"
import { PostType } from "database"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { Fragment, useCallback, useEffect, useRef, useState } from "react"
import Cropper, { Area } from "react-easy-crop"
import { PiCaretDown, PiPlus } from "react-icons/pi"
import { BaseModal } from "./BaseModal"
import type { BaseModalProps } from './BaseModal';
import { Button } from "../Button"
import { getPostTypeName } from "../PostSection/post-section.util"
import { useFileUpload } from "~/hooks/file-upload.hook"
import { api } from "~/utils/api.util"
import getCroppedImg from "~/utils/crop-image.util"
import { handleErrors } from "~/utils/handle-errors.util"

interface CreatePostModalProps extends BaseModalProps {
    firstPost?: boolean;
}

export const CreatePostModal = (props: CreatePostModalProps) => {
    const { data: session } = useSession();
    const { push } = useRouter();
    const ctx = api.useContext();

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [type, setType] = useState<PostType>("OUTFIT")
    const [rotation, setRotation] = useState(0)
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixelsState, setCroppedAreaPixelsState] = useState<Area | null>(null)

    const { handleChange, dragActive, file, fileUrl, handleDrag, handleDrop, setFile, setFileUrl } = useFileUpload();

    const [isCropped, setIsCropped] = useState<boolean>(false);

    const ref = useRef<HTMLInputElement>(null);

    /**
     * This closes the crop modal and creates the post after the image has been cropped
     * The PostCropModal component sets isCropped to true when the image has been cropped
     */
    useEffect(() => {
        if (isCropped) {
            mutate({ type });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCropped]);

    /**
     * This creates a presigned url for the image and then uploads the image to the presigned url
     * onMutate, onError, and onSettled are custom functions in ./post-section.util.ts that handle optimistic updates
     */
    const { mutate, isLoading } = api.post.createPost.useMutation({
        onError: (e) => handleErrors({ e, message: 'Failed to create post' }),
        onSuccess: async (result) => {
            await axios.put(result.res, file);
            await ctx.post.getPostsAllTypes.refetch();

            props.setIsOpen(false);

            push(`/${session?.user.username}?postId=${result.id}`);
        }
    });

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixelsState(croppedAreaPixels);
    }, []);

    const handleCancel = useCallback(() => {
        setFile(null);
        setFileUrl(null);
    }, [setFile, setFileUrl]);

    const handleFirstPostSkip = useCallback(() => {
        handleCancel();
        push(`/${session?.user.username}`);
        props.setIsOpen(false);
    }, [handleCancel, push, session?.user.username, props]);

    const handleSubmit = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(fileUrl ?? "", croppedAreaPixelsState);

            if (!croppedImage) return;

            setFile(croppedImage.file);
            setFileUrl(croppedImage.fileUrl);
            setIsCropped(true);
        } catch (e) {
            console.error(e)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [croppedAreaPixelsState]);

    return <BaseModal {...props}>
        <div className="flex flex-col gap-2 w-full px-12 sm:w-[400px] items-center md:justify-center">

            <h1 className="font-black text-3xl mb-4 text-center">{props.firstPost ? 'Create your first Post' : 'Create a Post'}</h1>

            <div className='relative w-[244.4px] h-[400px]'>
                {fileUrl ? <Cropper
                    image={fileUrl ?? ""}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={176 / 288}
                    cropSize={{ width: 244.4, height: 400 }}
                    classes={{ containerClassName: 'bg-hover rounded-md' }}
                    showGrid={true}
                    onCropChange={(crop) => setCrop(crop)}
                    onRotationChange={(rotation) => setRotation(rotation)}
                    onCropComplete={onCropComplete}
                    onZoomChange={(zoom) => setZoom(zoom)}
                /> : <div onDragEnter={handleDrag} className='relative w-full h-full'>
                    <input ref={ref} type="file" className='hidden' accept='image/*' onChange={handleChange} />
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
                        className='w-full h-full bg-white dark:bg-black border hover:bg-stroke border-stroke gap-2 flex items-center justify-center font-bold flex-col text-sm rounded-md'>
                        <PiPlus className='w-8 h-8 text-secondary-text' />
                        <p className='text-secondary-text font-clash'>Upload Or Drop</p>
                    </button>
                </div>
                }
            </div>

            <input
                type='range'
                value={zoom}
                step={0.1}
                min={0.4}
                max={3}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(e.target.valueAsNumber)}
                className="w-full h-2 bg-gray-200 rounded-lg mb-3 appearance-none cursor-pointer dark:bg-gray-700 accent-black dark:accent-white"
            />

            <div className='relative w-full'>
                <Listbox value={type} onChange={setType}>
                    <Listbox.Button className={"relative font-clash text-secondary-text font-semibold w-full cursor-pointer rounded-md py-3 pl-6 pr-10 text-left border border-stroke"}>
                        <span className="block truncate">{getPostTypeName(type)}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6">
                            <PiCaretDown
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </span>
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute bottom-0 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-black p-2 gap-2 shadow-lg border border-stroke font-clash font-semibold">
                            <Listbox.Option
                                key={PostType.OUTFIT}
                                value={PostType.OUTFIT}
                                className={({ active }) =>
                                    `relative cursor-pointer select-none rounded-md py-2 px-4 ${active ? 'bg-hover' : 'text-secondary-text'
                                    }`
                                }

                            >
                                {getPostTypeName("OUTFIT")}
                            </Listbox.Option>

                            <Listbox.Option
                                key={PostType.HEADWEAR}
                                value={PostType.HEADWEAR}
                                className={({ active }) =>
                                    `relative cursor-pointer select-none rounded-md py-2 px-4 ${active ? 'bg-hover' : 'text-secondary-text'
                                    }`
                                }

                            >
                                {getPostTypeName("HEADWEAR")}
                            </Listbox.Option>

                            <Listbox.Option
                                key={PostType.SHOES}
                                value={PostType.SHOES}
                                className={({ active }) =>
                                    `relative cursor-pointer select-none rounded-md py-2 px-4 ${active ? 'bg-hover' : 'text-secondary-text'
                                    }`
                                }
                            >
                                {getPostTypeName("SHOES")}
                            </Listbox.Option>

                            <Listbox.Option
                                key={PostType.HOODIE}
                                value={PostType.HOODIE}
                                className={({ active }) =>
                                    `relative cursor-pointer select-none rounded-md py-2 px-4 ${active ? 'bg-hover' : 'text-secondary-text'
                                    }`
                                }
                            >
                                {getPostTypeName("HOODIE")}
                            </Listbox.Option>

                            <Listbox.Option
                                key={PostType.PANTS}
                                value={PostType.PANTS}
                                className={({ active }) =>
                                    `relative cursor-pointer select-none rounded-md py-2 px-4 ${active ? 'bg-hover' : 'text-secondary-text'
                                    }`
                                }
                            >
                                {getPostTypeName("PANTS")}
                            </Listbox.Option>

                            <Listbox.Option
                                key={PostType.SHIRT}
                                value={PostType.SHIRT}
                                className={({ active }) =>
                                    `relative cursor-pointer select-none rounded-md py-2 px-4 ${active ? 'bg-hover' : 'text-secondary-text'
                                    }`
                                }
                            >
                                {getPostTypeName("SHIRT")}
                            </Listbox.Option>

                            <Listbox.Option
                                key={PostType.WATCH}
                                value={PostType.WATCH}
                                className={({ active }) =>
                                    `relative cursor-pointer select-none rounded-md py-2 px-4 ${active ? 'bg-hover' : 'text-secondary-text'
                                    }`
                                }
                            >
                                {getPostTypeName("WATCH")}
                            </Listbox.Option>

                            <Listbox.Option
                                key={PostType.GLASSES}
                                value={PostType.GLASSES}
                                className={({ active }) =>
                                    `relative cursor-pointer select-none rounded-md py-2 px-4 ${active ? 'bg-hover' : 'text-secondary-text'
                                    }`
                                }
                            >
                                {getPostTypeName("GLASSES")}
                            </Listbox.Option>

                            <Listbox.Option
                                key={PostType.JEWELRY}
                                value={PostType.JEWELRY}
                                className={({ active }) =>
                                    `relative cursor-pointer select-none rounded-md py-2 px-4 ${active ? 'bg-hover' : 'text-secondary-text'
                                    }`
                                }
                            >
                                {getPostTypeName("JEWELRY")}
                            </Listbox.Option>
                        </Listbox.Options>
                    </Transition>
                </Listbox>
            </div>

            <div className='w-full flex gap-2 items-center'>
                {props.firstPost ?
                    <Button centerItems variant={'outline-ghost'} onClick={handleFirstPostSkip}>
                        Skip
                    </Button> : <Button centerItems variant={'outline-ghost'} onClick={handleCancel}>
                        Clear
                    </Button>
                }

                <Button centerItems onClick={handleSubmit} disabled={!fileUrl} isLoading={isLoading}>
                    Post
                </Button>
            </div>
        </div>
    </BaseModal>
}