import axios from 'axios';
import { GetServerSidePropsContext, NextPage } from 'next';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import superjson from 'superjson';
import { Button } from '~/components/Button';
import { CropModal } from '~/components/CropModal';
import { Layout } from '~/components/Layout';
import { OnboardingStartSection } from '~/components/OnboardingStart';
import { useFileUpload } from '~/hooks/file-upload.hook';
import { EditProfileInput, editProfileSchema } from '~/schemas/user.schema';
import { appRouter } from '~/server/api/root';
import { getServerAuthSession } from '~/server/auth';
import { prisma } from '~/server/db';
import { api } from '~/utils/api.util';
import { handleErrors } from '~/utils/handle-errors.util';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { createServerSideHelpers } from '@trpc/react-query/server';

export const OnboardingPage: NextPage<{ username?: string }> = ({ username }) => {
    const { handleChange, dragActive, file, fileUrl, handleDrag, handleDrop, setFile, setFileUrl, cropModalOpen, setCropModalOpen } = useFileUpload();
    const { push } = useRouter();
    const { update } = useSession();

    const [loading, setLoading] = useState<boolean>(false);
    const [onboardingStarted, setOnboardingStarted] = useState<boolean>(false);

    const ref = useRef<HTMLInputElement>(null);

    const { register, handleSubmit, setValue, getValues } = useForm({
        resolver: zodResolver(editProfileSchema),
    });



    // This fetches the user's data and sets the username and username fields to the user's current username and username
    const { data } = api.user.getMe.useQuery(undefined, {
        onError: (e) => handleErrors({ e, message: "Failed to fetch you!", fn: () => { } }),
        onSuccess: async (data) => {
            setValue('tagline', data.tagline);
            setValue('username', data.username);
            setFileUrl(data.image);
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 1,
    });

    // On success, this updates the session and returns the user to their profile
    const { mutate } = api.user.editProfile.useMutation({
        onSuccess: (data) => {
            update();

            push(`/${data.username}`);
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
                update();
                push(`/${data?.username}`)
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
            push(`/${data?.username}`);
        }

    };

    return (
        <Layout title='Onboarding' showActions={false} showSlash={false}>
            {cropModalOpen && <CropModal setFileUrl={setFileUrl} fileUrl={fileUrl} isOpen={cropModalOpen} setFile={setFile} setIsOpen={setCropModalOpen} />}
            <div className='flex flex-col lg:flex-row w-screen h-full'>
                <div className='h-full flex w-full lg:px-56 lg:w-auto flex-col py-4 sm:justify-center items-center gap-4 lg:border-r border-black dark:border-white'>
                    {onboardingStarted ? <form
                        onSubmit={handleSubmit(handleFormSubmit)}
                        className='w-full px-8 sm:px-0 sm:w-[500px] gap-6 flex flex-col sm:mb-20 justify-between sm:justify-normal h-full sm:h-auto'
                    >
                        <h1 className='hidden sm:block sm:text-5xl font-black font-urbanist'>Show the world who you really are.</h1>

                        <div className='flex gap-2 w-full flex-col sm:flex-row items-center'>
                            <div className='rounded-full h-64 w-64 sm:h-44 sm:w-44 flex items-center justify-center border border-black' onClick={() => ref.current?.click()}>
                                {dragActive &&
                                    <div
                                        className='absolute w-full h-full t-0 r-0 b-0 l-0'
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
                                />
                                {(file) ? (
                                    <img
                                        src={fileUrl ?? ""}
                                        alt="Avatar Preview"
                                        className="h-64 w-64 sm:h-44 sm:w-44 object-contain rounded-full cursor-pointer"
                                    />
                                ) : (
                                    fileUrl ? (
                                        <img
                                            src={fileUrl ?? ""}
                                            alt="Avatar Preview"
                                            className="h-64 w-64 sm:h-44 sm:w-44 object-contain rounded-full cursor-pointer"
                                        />
                                    ) : (
                                        <div className="cursor-pointer text-center p-4">
                                            Drag and drop or click to upload
                                        </div>
                                    )
                                )}
                            </div>

                            <div className='flex grow h-full flex-col gap-2 w-full sm:w-auto mt-11 sm:mt-auto'>
                                <input {...register("username")} type="text" className='border border-black dark:border-white px-3 py-2 rounded-lg placeholder:text-gray-500 dark:bg-black' placeholder='Your special @username, here' />
                                <textarea {...register("tagline")} className='border border-black dark:border-white px-3 py-2 rounded-lg grow resize-none placeholder:text-gray-500 h-20 dark:bg-black' placeholder='Your tagline, short description, bio, whatnot' />
                            </div>
                        </div>

                        <div className='w-full flex gap-2 mt-4'>
                            <Button color='outline' iconLeft={<ArrowLeft />} onClick={() => setOnboardingStarted(false)} centerItems>Back</Button>
                            <Button isLoading={loading} type='submit' iconRight={<ArrowRight />} centerItems>Continue</Button>
                        </div>
                    </form> :
                        <OnboardingStartSection username={username} setOnboardingStarted={setOnboardingStarted} />}
                </div>

                <div className='h-full shrink-0 grow hidden overflow-hidden flex-col lg:flex'>
                    <div className='flex gap-10 -mt-96'>
                        <div className='w-52 h-80 bg-black rounded-lg rotate-12'></div>
                        <div className='w-52 h-80 bg-black rounded-lg rotate-12 mt-12'></div>
                        <div className='w-52 h-80 bg-black rounded-lg rotate-12 mt-24'></div>
                        <div className='w-52 h-80 bg-black rounded-lg rotate-12 mt-36'></div>
                        <div className='w-52 h-80 bg-black rounded-lg rotate-12 mt-48'></div>
                        <div className='w-52 h-80 bg-black rounded-lg rotate-12 mt-60'></div>
                        <div className='w-52 h-80 bg-black rounded-lg rotate-12 mt-72'></div>
                    </div>
                    <div className='flex gap-10 -mt-60'>
                        <div className='w-52 h-80 bg-black rounded-lg rotate-12'></div>
                        <div className='w-52 h-80 bg-black rounded-lg rotate-12 mt-12'></div>
                        <div className='w-52 h-80 bg-black rounded-lg rotate-12 mt-24'></div>
                        <div className='w-52 h-80 bg-black rounded-lg rotate-12 mt-36'></div>
                        <div className='w-52 h-80 bg-black rounded-lg rotate-12 mt-48'></div>
                        <div className='w-52 h-80 bg-black rounded-lg rotate-12 mt-60'></div>
                        <div className='w-52 h-80 bg-black rounded-lg rotate-12 mt-72'></div>
                    </div>
                    <div className='flex gap-10 -mt-60'>
                        <div className='w-52 h-80 bg-black rounded-lg rotate-12'></div>
                        <div className='w-52 h-80 bg-black rounded-lg rotate-12 mt-12'></div>
                        <div className='w-52 h-80 bg-black rounded-lg rotate-12 mt-24'></div>
                        <div className='w-52 h-80 bg-black rounded-lg rotate-12 mt-36'></div>
                        <div className='w-52 h-80 bg-black rounded-lg rotate-12 mt-48'></div>
                        <div className='w-52 h-80 bg-black rounded-lg rotate-12 mt-60'></div>
                        <div className='w-52 h-80 bg-black rounded-lg rotate-12 mt-72'></div>
                    </div>
                    <div className='flex gap-10 -mt-60'>
                        <div className='w-52 h-80 bg-black rounded-lg rotate-12'></div>
                        <div className='w-52 h-80 bg-black rounded-lg rotate-12 mt-12'></div>
                        <div className='w-52 h-80 bg-black rounded-lg rotate-12 mt-24'></div>
                        <div className='w-52 h-80 bg-black rounded-lg rotate-12 mt-36'></div>
                        <div className='w-52 h-80 bg-black rounded-lg rotate-12 mt-48'></div>
                        <div className='w-52 h-80 bg-black rounded-lg rotate-12 mt-60'></div>
                        <div className='w-52 h-80 bg-black rounded-lg rotate-12 mt-72'></div>
                    </div>
                </div>
            </div>
        </Layout >
    );
};

// TODO: This is quite slow, not sure how to fix it
export const getServerSideProps = async (context: GetServerSidePropsContext<{ username: string }>,
) => {
    const helpers = createServerSideHelpers({
        router: appRouter,
        ctx: { prisma, session: null },
        transformer: superjson, // optional - adds superjson serialization
    });

    const session = await getServerAuthSession(context);

    if (session && session.user) {

        if (session.user.onboarded) {
            return {
                redirect: {
                    destination: `/${session.user.username}`,
                    permanent: false,
                },
            };
        }

        await helpers.user.getMe.prefetch();
    } else {
        return {
            props: {
            },
            redirect: {
                destination: '/login',
                permanent: false,
            }
        };
    }

    return {
        props: {
            username: session?.user.username,
            trpcState: helpers.dehydrate(),
        }
    };
}

export default OnboardingPage;