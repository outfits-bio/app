"use client";
import { type ChangeEvent, useState, useRef, useEffect, useCallback } from "react";
import { Button } from "../../ui/Button"
import { Avatar } from "../../ui/Avatar"
import { toast } from "react-hot-toast";
import type { Area } from "react-easy-crop";
import { useSession } from "next-auth/react";
import axios from 'axios';
import { useForm } from "react-hook-form";
import { formatAvatar } from "@/utils/image-src-format.util";
import { handleErrors } from "@/utils/handle-errors.util";
import getCroppedImg from "@/utils/crop-image.util";
import { api } from "@/trpc/react";
import { useFileUpload } from "@/hooks/file-upload.hook";

export function AvatarCard() {
    const { data: session, update } = useSession();
    const { handleChange, dragActive, file, fileUrl, handleDrag, handleDrop, setFile, setFileUrl, cropModalOpen, setCropModalOpen } = useFileUpload();
    const [loading, setLoading] = useState<boolean>(false);
    const [croppedAreaPixelsState, setCroppedAreaPixelsState] = useState<Area | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [isCropped, setIsCropped] = useState<boolean>(false);
    const ref = useRef<HTMLInputElement>(null);


    const { register, handleSubmit, getValues, setValue } = useForm();

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

    const handleFormChange = async (e: ChangeEvent<HTMLInputElement>) => {
        handleSubmit(handleFormSubmit);
    }

    return (
        <div className="flex flex-col items-start rounded-lg border bg-white">
            <div className="flex items-start flex gap-24 p-10 self-stretch">
                <div className="flex flex-col items-start gap-3 flex-1">
                    <h1 className="font-clash font-bold text-3xl">Avatar</h1>
                    <p>Take your best shot because your avatar is how you will appear on most of the website.</p>
                </div>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    {session ? (
                        <div>
                            <div className='rounded-full h-44 w-44 flex items-center justify-center border border' onClick={() => ref.current?.click()}>
                                {dragActive &&
                                    <div
                                        className='absolute w-full h-full inset-0'
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    />
                                }

                                <input
                                    ref={ref}
                                    id="avatar"
                                    name="avatar"
                                    type="file"
                                    className="hidden"
                                    onChange={handleChange}
                                    accept='image/*'
                                />

                                {(file) ? (
                                    <Avatar
                                        className="h-44 w-44 object-contain rounded-full cursor-pointer"
                                        image={fileUrl ?? ""}
                                        id={session.user.id}
                                        username={session.user.username}
                                        size={'lg'} />

                                ) : (
                                    fileUrl ? (
                                        <Avatar
                                            className="h-44 w-44 object-contain rounded-full cursor-pointer"
                                            image={fileUrl ?? ""}
                                            id={session.user.id}
                                            username={session.user.username}
                                            size={'lg'} />
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
            <div className="flex flex-wrap items-center gap-3 p-4 px-10 self-stretch justify-between border-t bg-gray-100">
                <p>Click to upload or simply drag and drop your image.</p>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" onClick={() => deleteImage()}>Remove</Button>
                    <Button onClick={() => ref.current?.click()}>Upload</Button>
                </div>
            </div>
        </div>
    )
}