/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "../../ui/Button"
import { Avatar } from "../../ui/Avatar"
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import axios from 'axios';
import { useForm } from "react-hook-form";
import { formatAvatar } from "@/utils/image-src-format.util";
import { handleErrors } from "@/utils/handle-errors.util";
import { api } from "@/trpc/react";
import { useFileUpload } from "@/hooks/file-upload.hook";
import { AvatarCropModal } from "@/components/modals/avatar-crop-modal";
import { PiSubtract } from "react-icons/pi";

export function AvatarCard() {
    const { data: session, update } = useSession();
    const { handleChange, dragActive, file, fileUrl, handleDrag, handleDrop, setFile, setFileUrl, cropModalOpen, setCropModalOpen } = useFileUpload();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loading, setLoading] = useState<boolean>(false);
    const ref = useRef<HTMLInputElement>(null);


    const { handleSubmit } = useForm();

    useEffect(() => {
        if (!session?.user) return;
        setFileUrl(formatAvatar(session.user.image, session.user.id));
    }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        , [session]);

    /**
   * This creates a presigned url for the image and then uploads the image to the presigned url
   * If the user didn't change their username and username, they get sent back to their profile early,
   * otherwise the edit profile mutation will send them after it finishes
   */
    const { mutate: setImage } = api.user.setImage.useMutation({
        onSuccess: async (result) => {
            await axios.put(result, file);

            await update();
            toast.success("Avatar Updated!");
        },
        onError: (e) => handleErrors({ e, message: "Failed to set image!", fn: () => setLoading(false) })
    });

    const { mutate: deleteImage } = api.user.deleteImage.useMutation({
        onSuccess: async () => {
            toast.success("Image deleted!");
            await update();
        },
        onError: (e) => handleErrors({ e, message: "Failed to delete image!", fn: () => setLoading(false) })
    });

    const handleFormSubmit = async () => {
        setLoading(true);
        console.log("file", file);
        if (file) {
            setImage();
        }
        setLoading(false);
    };

    const handleFormChange = async () => {
        console.log("file has changed");
        handleSubmit(handleFormSubmit);
    }

    return (
        <div className="flex flex-col items-start rounded-lg border border-stroke bg-white dark:bg-black">
            {cropModalOpen && <AvatarCropModal setFileUrl={setFileUrl} fileUrl={fileUrl} isOpen={cropModalOpen} setFile={setFile} setIsOpen={setCropModalOpen} />}
            <div className="flex-wrap items-start flex gap-24 p-10 self-stretch">
                <div className="flex flex-col items-start gap-3 flex-1">
                    <h1 className="font-clash font-bold text-3xl">Avatar</h1>
                    <p>Take your best shot because your avatar is how you will appear on most of the website.</p>
                </div>
                <form onChange={handleFormChange} onSubmit={handleSubmit(handleFormSubmit)}>
                    {session ? (
                        <div>
                            <div className='rounded-full h-44 w-44 flex items-center justify-center border dark:border-stroke' onClick={() => ref.current?.click()}>
                                {dragActive &&
                                    <div
                                        className='absolute w-full h-full inset-0'
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop} />
                                }

                                <input
                                    ref={ref}
                                    id="avatar"
                                    type="file"
                                    className="hidden"
                                    onChange={handleChange}
                                    accept='image/*'
                                />
                                {(file) ? (
                                    <img
                                        src={fileUrl ?? ""}
                                        alt="Avatar Preview"
                                        className="h-44 w-44 object-contain rounded-full cursor-pointer"
                                    />
                                ) : (
                                    fileUrl ? (
                                        <img
                                            src={fileUrl ?? ""}
                                            alt="Avatar Preview"
                                            className="h-44 w-44 object-contain rounded-full cursor-pointer"
                                        />
                                    ) : (
                                        <div className="cursor-pointer text-center p-4">
                                            Drag and drop or click to upload
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                    ) : (
                        <Avatar size={'lg'} />
                    )
                    }
                </form>
            </div>
            <div className="flex flex-wrap items-center gap-3 p-4 px-10 self-stretch justify-between rounded-b-lg border-t dark:border-stroke bg-gray-100 dark:bg-neutral-900">
                <p>Click to upload or simply drag and drop your image.</p>
                <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
                    <Button variant="ghost" onClick={() => deleteImage()}>Remove</Button>
                    <Button variant='outline' centerItems iconLeft={<PiSubtract />} type='button' onClick={() => setCropModalOpen(true)}>Edit/Crop</Button>
                    <Button onClick={handleSubmit(handleFormSubmit)}>Save</Button>
                </div>
            </div>
        </div>
    )
}