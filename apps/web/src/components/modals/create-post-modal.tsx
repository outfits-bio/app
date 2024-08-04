"use client";

import { useFileUpload } from "@/hooks/file-upload.hook";
import { api } from "@/trpc/react";
import getCroppedImg from "@/utils/crop-image.util";
import { handleErrors } from "@/utils/handle-errors.util";
import { getPostTypeName } from "@/utils/names.util";
import { Listbox } from '@headlessui/react';
import axios from "axios";
import { PostType } from "database";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Area } from "react-easy-crop";
import Cropper from "react-easy-crop";
import { PiCaretDown, PiPlus } from "react-icons/pi";
import { Button } from "../ui/Button";
import { BaseModal, BaseModalContent, BaseModalDescription, BaseModalTitle, BaseModalTrigger } from "./base-modal";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function CreatePostModal() {
    const ctx = api.useUtils();
    const router = useRouter();

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [type, setType] = useState<PostType>("OUTFIT")
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixelsState, setCroppedAreaPixelsState] = useState<Area | null>(null);

    const { handleChange, dragActive, file, fileUrl, handleDrag, handleDrop, setFile, setFileUrl } = useFileUpload();
    const [isCropped, setIsCropped] = useState<boolean>(false);

    const ref = useRef<HTMLInputElement>(null);
    const ref2 = useRef<HTMLButtonElement>(null);


    useEffect(() => {
        if (isCropped) {
            mutate({ type });
        }
    }, [isCropped]);

    const { mutate } = api.post.createPost.useMutation({
        onError: (e) => handleErrors({ e, message: 'Failed to create post' }),
        onSuccess: async (result) => {
            await axios.put(result.res, file);
            await ctx.post.getPostsAllTypes.refetch();
            ref2.current?.click();
            toast.success('Post created successfully');
            router.push(`/profile`);
            handleCancel();
        }
    });

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixelsState(croppedAreaPixels);
    }, []);

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
    }, [croppedAreaPixelsState]);

    const handleCancel = useCallback(() => {
        setFile(null);
        setFileUrl(null);
    }, [setFile, setFileUrl]);

    return (
        <BaseModal>
            <BaseModalTrigger ref={ref2}>
                <Button className="px-3 md:px-6" iconLeft={<PiPlus />}><span className="hidden sm:inline">Post</span></Button>
            </BaseModalTrigger>
            <BaseModalContent>
                <BaseModalTitle>Create Post</BaseModalTitle>
                <BaseModalDescription>
                    Upload an image of your clothes to share with the community.
                </BaseModalDescription>

                <div className="flex flex-wrap gap-3 justify-center mt-1 md:mt-0 mb-3">
                    <div className="flex flex-col gap-3">
                        <div className='relative w-[244.4px] h-[400px]'>
                            {fileUrl ? (
                                <Cropper
                                    image={fileUrl}
                                    crop={crop}
                                    zoom={zoom}
                                    rotation={rotation}
                                    aspect={176 / 288}
                                    cropSize={{ width: 244.4, height: 400 }}
                                    classes={{ containerClassName: 'bg-hover rounded-xl' }}
                                    showGrid={true}
                                    onCropChange={setCrop}
                                    onRotationChange={setRotation}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            ) : (
                                <div onDragEnter={handleDrag} className='relative w-full h-full'>
                                    <input ref={ref} type="file" className='hidden' accept='image/*' onChange={handleChange} />
                                    {dragActive && (
                                        <div
                                            className='absolute w-full h-full t-0 r-0 b-0 l-0'
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                        />
                                    )}
                                    <button
                                        onClick={() => ref.current?.click()}
                                        type='button'
                                        className='w-full h-full bg-white dark:bg-black border hover:bg-stroke border-stroke gap-2 flex items-center justify-center font-bold flex-col text-sm rounded-xl'
                                    >
                                        <PiPlus className='w-8 h-8 text-secondary-text' />
                                        <p className='text-secondary-text font-clash'>Upload Or Drop</p>
                                    </button>
                                </div>
                            )}
                        </div>
                        <input
                            type='range'
                            value={zoom}
                            step={0.1}
                            min={0.4}
                            max={3}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(e.target.valueAsNumber)}
                            className="w-full h-2 bg-gray-200 rounded-xl mb-3 appearance-none cursor-pointer dark:bg-gray-700 accent-black dark:accent-white"
                        />
                    </div>

                    <div className="flex flex-col gap-3 w-full md:w-fit">
                        <h1 className="font-clash font-bold text-xl pt-0">Post Details</h1>
                        <div className='relative w-full'>
                            <Listbox value={type} onChange={setType}>
                                <Listbox.Button className={"relative font-clash text-secondary-text font-semibold w-full cursor-pointer rounded-xl py-3 pl-6 pr-10 text-left border border-stroke"}>
                                    <span className="block truncate">{getPostTypeName(type)}</span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6">
                                        <PiCaretDown
                                            className="h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </span>
                                </Listbox.Button>
                                <Listbox.Options className="absolute mt-2 bg-white dark:bg-black max-h-60 w-full overflow-auto rounded-xl p-2 gap-2 shadow-lg border border-stroke font-clash font-semibold z-50">
                                    <Listbox.Option
                                        key={PostType.OUTFIT}
                                        value={PostType.OUTFIT}
                                        className={({ active }) =>
                                            `relative cursor-pointer select-none rounded-xl py-2 px-4 ${active ? 'bg-hover' : 'text-secondary-text'
                                            }`
                                        }

                                    >
                                        {getPostTypeName("OUTFIT")}
                                    </Listbox.Option>

                                    <Listbox.Option
                                        key={PostType.HEADWEAR}
                                        value={PostType.HEADWEAR}
                                        className={({ active }) =>
                                            `relative cursor-pointer select-none rounded-xl py-2 px-4 ${active ? 'bg-hover' : 'text-secondary-text'
                                            }`
                                        }

                                    >
                                        {getPostTypeName("HEADWEAR")}
                                    </Listbox.Option>

                                    <Listbox.Option
                                        key={PostType.SHOES}
                                        value={PostType.SHOES}
                                        className={({ active }) =>
                                            `relative cursor-pointer select-none rounded-xl py-2 px-4 ${active ? 'bg-hover' : 'text-secondary-text'
                                            }`
                                        }
                                    >
                                        {getPostTypeName("SHOES")}
                                    </Listbox.Option>

                                    <Listbox.Option
                                        key={PostType.HOODIE}
                                        value={PostType.HOODIE}
                                        className={({ active }) =>
                                            `relative cursor-pointer select-none rounded-xl py-2 px-4 ${active ? 'bg-hover' : 'text-secondary-text'
                                            }`
                                        }
                                    >
                                        {getPostTypeName("HOODIE")}
                                    </Listbox.Option>

                                    <Listbox.Option
                                        key={PostType.PANTS}
                                        value={PostType.PANTS}
                                        className={({ active }) =>
                                            `relative cursor-pointer select-none rounded-xl py-2 px-4 ${active ? 'bg-hover' : 'text-secondary-text'
                                            }`
                                        }
                                    >
                                        {getPostTypeName("PANTS")}
                                    </Listbox.Option>

                                    <Listbox.Option
                                        key={PostType.SHIRT}
                                        value={PostType.SHIRT}
                                        className={({ active }) =>
                                            `relative cursor-pointer select-none rounded-xl py-2 px-4 ${active ? 'bg-hover' : 'text-secondary-text'
                                            }`
                                        }
                                    >
                                        {getPostTypeName("SHIRT")}
                                    </Listbox.Option>

                                    <Listbox.Option
                                        key={PostType.WATCH}
                                        value={PostType.WATCH}
                                        className={({ active }) =>
                                            `relative cursor-pointer select-none rounded-xl py-2 px-4 ${active ? 'bg-hover' : 'text-secondary-text'
                                            }`
                                        }
                                    >
                                        {getPostTypeName("WATCH")}
                                    </Listbox.Option>

                                    <Listbox.Option
                                        key={PostType.GLASSES}
                                        value={PostType.GLASSES}
                                        className={({ active }) =>
                                            `relative cursor-pointer select-none rounded-xl py-2 px-4 ${active ? 'bg-hover' : 'text-secondary-text'
                                            }`
                                        }
                                    >
                                        {getPostTypeName("GLASSES")}
                                    </Listbox.Option>

                                    <Listbox.Option
                                        key={PostType.JEWELRY}
                                        value={PostType.JEWELRY}
                                        className={({ active }) =>
                                            `relative cursor-pointer select-none rounded-xl py-2 px-4 ${active ? 'bg-hover' : 'text-secondary-text'
                                            }`
                                        }
                                    >
                                        {getPostTypeName("JEWELRY")}
                                    </Listbox.Option>
                                </Listbox.Options>
                            </Listbox>
                        </div>
                    </div>
                </div>

                <div className='w-full flex gap-2 items-center'>
                    <Button centerItems onClick={handleCancel} disabled={!fileUrl} variant={'outline-ghost'} >
                        Clear
                    </Button>
                    <Button centerItems onClick={handleSubmit} disabled={!fileUrl}>
                        Post
                    </Button>
                </div>
            </BaseModalContent>
        </BaseModal>
    );
}