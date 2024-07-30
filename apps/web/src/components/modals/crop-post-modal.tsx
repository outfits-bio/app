"use client";

import { useFileUpload } from "@/hooks/file-upload.hook";
import { api } from "@/trpc/react";
import getCroppedImg from "@/utils/crop-image.util";
import { handleErrors } from "@/utils/handle-errors.util";
import { getPostTypeName } from "@/utils/names.util";
import { Dialog, Listbox, Transition } from '@headlessui/react';
import axios from "axios";
import { PostType } from "database";
import { type Dispatch, Fragment, type SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import type { Area } from "react-easy-crop";
import Cropper from "react-easy-crop";
import { PiCaretDown, PiPlus } from "react-icons/pi";
import { Button } from "../ui/Button";

interface Props {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    fileUrl?: string | null;
    setFileUrl: Dispatch<SetStateAction<string | null>>;
    setFile: Dispatch<SetStateAction<File | Blob | null>>;
    setIsCropped: (isCropped: boolean) => void;
    type: PostType;
}

export function CropPostModal({ isOpen, setIsOpen, fileUrl, setFile, setFileUrl, setIsCropped, type }: Props) {
    const ctx = api.useUtils();

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixelsState, setCroppedAreaPixelsState] = useState<Area | null>(null);

    const { handleChange, dragActive, file, handleDrag, handleDrop } = useFileUpload();
    const [isCropped] = useState<boolean>(false);
    const ref = useRef<HTMLInputElement>(null);

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

            setIsOpen(false);
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
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={() => setIsOpen(false)} className="fixed inset-0 z-10 flex items-center justify-center">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30" />
                </Transition.Child>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Dialog.Panel className="flex gap-5 overflow-hidden rounded-xl bg-white dark:bg-black border border-stroke p-5 text-left align-middle shadow-xl transition-all z-50">
                        <div>
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
                        <div className="flex flex-col gap-3">
                            <h1 className="font-clash font-bold text-xl pt-0">Post Details</h1>
                            <div className='relative w-full'>
                                <Listbox value={type}>
                                    <Listbox.Button className={"relative font-clash text-secondary-text font-semibold w-full cursor-pointer rounded-xl py-3 pl-6 pr-10 text-left border border-stroke"}>
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
                                    </Transition>
                                </Listbox>
                            </div>

                            <div className='w-full flex gap-2 items-center'>
                                <Button centerItems onClick={handleCancel} disabled={!fileUrl} variant={'outline-ghost'} >
                                    Clear
                                </Button>
                                <Button centerItems onClick={handleSubmit} disabled={!fileUrl}>
                                    Post
                                </Button>
                            </div>
                        </div>
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}