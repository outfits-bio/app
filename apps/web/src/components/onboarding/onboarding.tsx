/* eslint-disable @next/next/no-img-element */
"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import type { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PiArrowLeft, PiArrowRight } from 'react-icons/pi';
import { Button } from '@/components/ui/Button';
import { AvatarCropModal } from '@/components/modals/avatar-crop-modal';
import { OnboardingAppearance } from '@/components/onboarding/onboarding-appearance';
import { OnboardingStartSection } from '@/components/onboarding/onboarding-start';
import { api } from '@/trpc/react';
import { useFileUpload } from '@/hooks/file-upload.hook';
import { type EditProfileInput, editProfileSchema } from '@/schemas/user.schema';
import { handleErrors } from '@/utils/handle-errors.util';
import Image from 'next/image';

export const Onboarding = ({ session, username }: { username: string, session: Session }) => {
    const { handleChange, dragActive, file, fileUrl, handleDrag, handleDrop, setFile, setFileUrl, cropModalOpen, setCropModalOpen } = useFileUpload();
    const { update } = useSession();

    const [loading, setLoading] = useState<boolean>(false);
    const [onboardingStarted, setOnboardingStarted] = useState<number>(0);

    const ref = useRef<HTMLInputElement>(null);

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            username: "",
            tagline: "",
        },
        resolver: zodResolver(editProfileSchema),
    });

    // This fetches the user's data and sets the username and username fields to the user's current username and username
    const { data } = api.user.getMe.useQuery(undefined, {
        onError: (e) => handleErrors({ e, message: "Failed to fetch you!" }),
        onSuccess: (data) => {
            if (data.tagline) setValue('tagline', data.tagline);
            if (data.username) setValue('username', data.username);
            setFileUrl(data.image);
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 1,
    });

    // On success, this updates the session and returns the user to their profile
    const { mutate } = api.user.editProfile.useMutation({
        onSuccess: async () => {
            await update();
            setLoading(false);
            setOnboardingStarted(2);
        },
        onError: (e) => handleErrors({ e, message: "Failed to edit profile!", fn: () => setLoading(false) }),
    });

    /**
     * This creates a presigned url for the image and then uploads the image to the presigned url
     * If the user didn't change their tagline and username from the original data, they get sent back to their profile early,
     * otherwise the edit profile mutation will send them after it finishes
     */
    const { mutate: setImage } = api.user.setImage.useMutation({
        onSuccess: async (result) => {
            await axios.put(result, file);

            if ((getValues('tagline') === data?.tagline) && (getValues('username') === data?.username)) {
                await update();
                setOnboardingStarted(2);
            }
        },
        onError: (e) => handleErrors({ e, message: "Failed to set image!", fn: () => setLoading(false) }),
    });

    const handleFormSubmit = async ({ username, tagline }: EditProfileInput) => {
        setLoading(true);

        if (file) {
            setImage();
        }

        // If the user didn't change their tagline or username from the original data, do nothing
        if ((tagline !== data?.tagline) || (username !== data?.username)) {
            mutate({
                tagline,
                username
            });
        }
        else {
            setLoading(false);
            setOnboardingStarted(2);
        }

    };

    return (
        <>
            {cropModalOpen && <AvatarCropModal setFileUrl={setFileUrl} fileUrl={fileUrl} isOpen={cropModalOpen} setFile={setFile} setIsOpen={setCropModalOpen} />}
            <div className='w-full h-full flex lg:px-56 lg:w-auto flex-col py-4 sm:justify-center items-center gap-4'>
                {onboardingStarted === 1 ? <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className='w-full px-8 sm:px-0 sm:w-[500px] gap-6 flex flex-col sm:mb-20 justify-between sm:justify-normal h-full sm:h-auto'
                >
                    <h1 className='hidden sm:block sm:text-5xl font-black font-clash'>Show the world who you really are.</h1>

                    <div className='flex gap-2 w-full flex-col sm:flex-row items-center'>
                        <div className='rounded-full h-64 w-64 sm:h-44 sm:w-44 flex items-center justify-center border' onClick={() => ref.current?.click()}>
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
                                <Image
                                    src={fileUrl ?? ""}
                                    alt="Avatar Preview"
                                    className="h-64 w-64 sm:h-44 sm:w-44 object-contain rounded-full cursor-pointer"
                                    width={256}
                                    height={256}
                                />
                            ) : (
                                fileUrl ? (
                                    <Image
                                        src={fileUrl ?? ""}
                                        alt="Avatar Preview"
                                        className="h-64 w-64 sm:h-44 sm:w-44 object-contain rounded-full cursor-pointer"
                                        width={256}
                                        height={256}
                                    />
                                ) : (
                                    <div className="cursor-pointer text-center p-4">
                                        Drag and drop or click to upload
                                    </div>
                                )
                            )}
                        </div>

                        <div className='flex grow h-full flex-col gap-2 w-full sm:w-auto mt-11 sm:mt-auto'>
                            {(errors.tagline && errors.username) && <p className='text-error text-sm'>{!!errors.username ? errors.username.message : errors.tagline?.message}</p>}
                            <input {...register("username")} type="text" className='border border-stroke px-3 py-2 rounded-lg placeholder:text-gray-500 dark:bg-black' placeholder='Your special @username, here' />
                            <textarea {...register("tagline")} className='border border-stroke px-3 py-2 rounded-lg grow resize-none placeholder:text-gray-500 h-20 dark:bg-black' placeholder='Your tagline, short description, bio, whatnot' />
                        </div>
                    </div>

                    <div className='w-full flex gap-2 mt-4'>
                        <Button variant='outline' iconLeft={<PiArrowLeft />} onClick={() => setOnboardingStarted(0)} centerItems>Back</Button>
                        <Button isLoading={loading} type='submit' iconRight={<PiArrowRight />} centerItems>Continue</Button>
                    </div>
                </form> :
                    onboardingStarted === 2 ? <OnboardingAppearance username={session?.user.username ?? username} setOnboardingStarted={setOnboardingStarted} onboardingStarted={onboardingStarted} />
                        :
                        <OnboardingStartSection username={username} setOnboardingStarted={setOnboardingStarted} />}
            </div>
        </>
    );
};