"use client";

import { useFileUpload } from "~/hooks/file-upload.hook";
import { api } from "~/trpc/react";
import getCroppedImg from "@acme/utils/crop-image.util";
import { handleErrors } from "@acme/utils/handle-errors.util";
import { getPostTypeName } from "@acme/utils/names.util";
import { Dialog, Transition } from '@headlessui/react';
import axios from "axios";
import { PostType } from "@acme/db";
import { type Dispatch, Fragment, type SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import type { Area } from "react-easy-crop";
import Cropper from "react-easy-crop";
import { PiPlus } from "react-icons/pi";
import { Button } from "../ui/Button";
import * as nsfwjs from 'nsfwjs';
import toast from "react-hot-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import { UserTagInput } from '../ui/user-tag-input';
import { Input } from "../ui/input";

interface Props {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    fileUrl?: string | null;
    setFileUrl: Dispatch<SetStateAction<string | null>>;
    setFile: Dispatch<SetStateAction<File | Blob | null>>;
    setIsCropped: (isCropped: boolean) => void;
    type: PostType;
    setType: Dispatch<SetStateAction<PostType>>;
}

export function CropPostModal({ isOpen, setIsOpen, fileUrl, setFile, setFileUrl, setIsCropped, type, setType }: Props) {
    const ctx = api.useUtils();

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixelsState, setCroppedAreaPixelsState] = useState<Area | null>(null);

    const { handleChange, dragActive, file, handleDrag, handleDrop } = useFileUpload();
    const [isCropped] = useState<boolean>(false);
    const ref = useRef<HTMLInputElement>(null);

    const [isNSFW, setIsNSFW] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    const [caption, setCaption] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [productLink, setProductLink] = useState('');

    useEffect(() => {
        if (isCropped) {
            // Remove this mutation call
            // mutate({ type, caption, tags, productLink });
        }
    }, [isCropped]);

    const { mutate, isPending: isPosting } = api.post.createPost.useMutation({
        onError: (e) => handleErrors({ e, message: 'Failed to create post' }),
        onSuccess: async (result) => {
            if (file) {
                await axios.put(result.res, file);
            }
            await ctx.post.getPostsAllTypes.refetch();
            toast.success('Post created successfully');
            setIsOpen(false);  // Close the modal after successful post
        }
    });

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixelsState(croppedAreaPixels);
    }, []);

    const checkNSFW = useCallback(async (imageUrl: string): Promise<boolean> => {
        try {
            const img = new Image();
            img.src = imageUrl;
            await img.decode();

            const model = await nsfwjs.load();
            const predictions = await model.classify(img);

            const nsfwScore = predictions.find((p: { className: string; }) => p.className === 'Porn' || p.className === 'Hentai')?.probability || 0;
            return nsfwScore > 0.5; // Return true if NSFW, false otherwise
        } catch (error) {
            console.error('NSFW check failed:', error);
            return false; // Assume safe in case of error
        }
    }, []);

    const handleSubmit = useCallback(async () => {
        if (isNSFW) {
            toast.error('NSFW content detected. Please choose a different image.');
            return;
        }

        try {
            const croppedImage = await getCroppedImg(fileUrl ?? "", croppedAreaPixelsState);

            if (!croppedImage) return;

            setFile(croppedImage.file);
            setFileUrl(croppedImage.fileUrl);
            setIsCropped(true);

            // Only call mutate here
            mutate({ type, caption, tags, productLink });
        } catch (e) {
            console.error(e)
        }
    }, [croppedAreaPixelsState, isNSFW, caption, tags, productLink, type, mutate]);

    const handleCancel = useCallback(() => {
        setFile(null);
        setFileUrl(null);
    }, [setFile, setFileUrl]);

    const handleTypeChange = useCallback((value: string) => {
        if (typeof setType === 'function') {
            setType(value as PostType);
        } else {
            console.error('setType is not a function');
        }
    }, [setType]);

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
                                        <Input ref={ref} type="file" className='hidden' accept='image/*' onChange={handleChange} />
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
                            <Input
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
                                <Select value={type} onValueChange={handleTypeChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a post type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={PostType.OUTFIT}>{getPostTypeName("OUTFIT")}</SelectItem>
                                        <SelectItem value={PostType.HEADWEAR}>{getPostTypeName("HEADWEAR")}</SelectItem>
                                        <SelectItem value={PostType.SHOES}>{getPostTypeName("SHOES")}</SelectItem>
                                        <SelectItem value={PostType.HOODIE}>{getPostTypeName("HOODIE")}</SelectItem>
                                        <SelectItem value={PostType.PANTS}>{getPostTypeName("PANTS")}</SelectItem>
                                        <SelectItem value={PostType.SHIRT}>{getPostTypeName("SHIRT")}</SelectItem>
                                        <SelectItem value={PostType.WATCH}>{getPostTypeName("WATCH")}</SelectItem>
                                        <SelectItem value={PostType.GLASSES}>{getPostTypeName("GLASSES")}</SelectItem>
                                        <SelectItem value={PostType.JEWELRY}>{getPostTypeName("JEWELRY")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <textarea
                                placeholder="Write a caption..."
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                className="w-full border border-gray-300 rounded px-2 py-1"
                            />
                            <UserTagInput
                                value={tags}
                                onChange={setTags}
                                placeholder="Tag people..."
                            />
                            <Input
                                type="url"
                                placeholder="Product link (optional)"
                                value={productLink}
                                onChange={(e) => setProductLink(e.target.value)}
                                className="w-full border border-gray-300 rounded px-2 py-1"
                            />
                            <div className='w-full flex gap-2 items-center'>
                                <Button centerItems onClick={handleCancel} disabled={!fileUrl} variant={'outline-ghost'} >
                                    Clear
                                </Button>
                                <Button
                                    centerItems
                                    className="disabled:cursor-not-allowed disabled:opacity-75"
                                    onClick={handleSubmit} disabled={!fileUrl || isChecking || isNSFW}>
                                    {isChecking ? 'Checking...' : 'Post'}
                                </Button>
                            </div>
                            {isNSFW && (
                                <p className="text-red-500 mt-2">NSFW content detected. Please choose a different image.</p>
                            )}
                        </div>
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}