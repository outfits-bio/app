/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import { GetServerSidePropsContext, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import superjson from 'superjson';
import { Button } from '~/components/Button';
import { CropModal } from '~/components/CropModal';
import { Layout } from '~/components/Layout';
import { OnboardingStartSection } from '~/components/OnboardingStart';
import { PostSkeleton } from '~/components/Skeletons/PostSkeleton';
import { useFileUpload } from '~/hooks/file-upload.hook';
import { EditProfileInput, editProfileSchema } from '~/schemas/user.schema';
import { appRouter } from '~/server/api/root';
import { getServerAuthSession } from '~/server/auth';
import { prisma } from '~/server/db';
import { api } from '~/utils/api.util';
import { handleErrors } from '~/utils/handle-errors.util';
import { formatAvatar, formatImage } from '~/utils/image-src-format.util';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Hammer, SealCheck } from '@phosphor-icons/react';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { OnboardingAppearance } from '~/components/OnboardingAppearance';

export const OnboardingPage: NextPage<{ username?: string }> = ({ username }) => {
    const { handleChange, dragActive, file, fileUrl, handleDrag, handleDrop, setFile, setFileUrl, cropModalOpen, setCropModalOpen } = useFileUpload();
    const { update, data: session } = useSession();

    const [loading, setLoading] = useState<boolean>(false);
    const [onboardingStarted, setOnboardingStarted] = useState<number>(0);

    const ref = useRef<HTMLInputElement>(null);

    const { register, handleSubmit, setValue, getValues } = useForm({
        resolver: zodResolver(editProfileSchema),
    });

    const { data: posts, isLoading } = api.post.getLoginPosts.useQuery(undefined, {});

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
                update();
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
        <Layout title='Onboarding' showActions={false} showSlash={false} hideSearch={true}>
            {cropModalOpen && <CropModal setFileUrl={setFileUrl} fileUrl={fileUrl} isOpen={cropModalOpen} setFile={setFile} setIsOpen={setCropModalOpen} />}
            <div className='flex flex-col lg:flex-row w-screen h-full'>
                <div className='h-full flex w-full lg:px-56 lg:w-auto flex-col py-4 sm:justify-center items-center gap-4 lg:border-r border-stroke'>
                    {onboardingStarted === 1 ? <form
                        onSubmit={handleSubmit(handleFormSubmit)}
                        className='w-full px-8 sm:px-0 sm:w-[500px] gap-6 flex flex-col sm:mb-20 justify-between sm:justify-normal h-full sm:h-auto'
                    >
                        <h1 className='hidden sm:block sm:text-5xl font-black font-clash'>Show the world who you really are.</h1>

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
                                    accept='image/*'
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
                                <input {...register("username")} type="text" className='border border-stroke px-3 py-2 rounded-lg placeholder:text-gray-500 dark:bg-black' placeholder='Your special @username, here' />
                                <textarea {...register("tagline")} className='border border-stroke px-3 py-2 rounded-lg grow resize-none placeholder:text-gray-500 h-20 dark:bg-black' placeholder='Your tagline, short description, bio, whatnot' />
                            </div>
                        </div>

                        <div className='w-full flex gap-2 mt-4'>
                            <Button variant='outline' iconLeft={<ArrowLeft />} onClick={() => setOnboardingStarted(0)} centerItems>Back</Button>
                            <Button isLoading={loading} type='submit' iconRight={<ArrowRight />} centerItems>Continue</Button>
                        </div>
                    </form> :
                        onboardingStarted === 2 ? <OnboardingAppearance username={session?.user.username ?? username} setOnboardingStarted={setOnboardingStarted} onboardingStarted={onboardingStarted} />
                            :
                            <OnboardingStartSection username={username} setOnboardingStarted={setOnboardingStarted} />}
                </div>

                <div className='h-full shrink-0 grow hidden overflow-hidden flex-col lg:flex'>
                    {isLoading && <>
                        <div className='flex gap-8 -mt-72'>
                            <PostSkeleton className='rotate-12 mt-12' />
                            <PostSkeleton className='rotate-12 mt-24' />
                            <PostSkeleton className='rotate-12 mt-36' />
                            <PostSkeleton className='rotate-12 mt-48' />
                            <PostSkeleton className='rotate-12 mt-60' />
                            <PostSkeleton className='rotate-12 mt-72' />
                            <PostSkeleton className='rotate-12 mt-[336px]' />
                            <PostSkeleton className='rotate-12 mt-[384px]' />
                        </div>

                        <div className='flex gap-8 -mt-[336px]'>
                            <PostSkeleton className='rotate-12 mt-12' />
                            <PostSkeleton className='rotate-12 mt-24' />
                            <PostSkeleton className='rotate-12 mt-36' />
                            <PostSkeleton className='rotate-12 mt-48' />
                            <PostSkeleton className='rotate-12 mt-60' />
                            <PostSkeleton className='rotate-12 mt-72' />
                            <PostSkeleton className='rotate-12 mt-[336px]' />
                            <PostSkeleton className='rotate-12 mt-[384px]' />
                        </div>

                        <div className='flex gap-8 -mt-[336px]'>
                            <PostSkeleton className='rotate-12 mt-12' />
                            <PostSkeleton className='rotate-12 mt-24' />
                            <PostSkeleton className='rotate-12 mt-36' />
                            <PostSkeleton className='rotate-12 mt-48' />
                            <PostSkeleton className='rotate-12 mt-60' />
                            <PostSkeleton className='rotate-12 mt-72' />
                            <PostSkeleton className='rotate-12 mt-[336px]' />
                            <PostSkeleton className='rotate-12 mt-[384px]' />
                        </div>

                        <div className='flex gap-8 -mt-[336px]'>
                            <PostSkeleton className='rotate-12 mt-12' />
                            <PostSkeleton className='rotate-12 mt-24' />
                            <PostSkeleton className='rotate-12 mt-36' />
                            <PostSkeleton className='rotate-12 mt-48' />
                            <PostSkeleton className='rotate-12 mt-60' />
                            <PostSkeleton className='rotate-12 mt-72' />
                            <PostSkeleton className='rotate-12 mt-[336px]' />
                            <PostSkeleton className='rotate-12 mt-[384px]' />
                        </div>
                    </>}


                    <div className='flex gap-8 -mt-72'>
                        {posts && posts.slice(0, 7).map((post, i) =>
                            <Link style={{ marginTop: `${48 * i}px` }} href={`/explore/?postId=${post.id}`} key={post.id} className={`w-44 h-72 rotate-12 min-w-[176px] border border-gray-500 rounded-md relative`}>
                                <Image
                                    // 176px is the same as w-44, the width of the container
                                    sizes="176px"
                                    src={formatImage(post.image, post.user.id)}
                                    className="object-cover"
                                    fill
                                    alt={post.type}
                                    priority
                                />

                                <div className='flex flex-col justify-end items-center p-2 absolute inset-0 bg-gradient-to-b from-transparent to-black w-full h-full bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100'>
                                    <div className='flex gap-2 w-full'>
                                        <Image className='rounded-full object-contain' src={formatAvatar(post.user.image, post.user.id)} alt={post.user.username ?? ""} width={30} height={30} />

                                        <h1 className='text-white flex gap-1 items-center text-sm w-full'>
                                            <span className='truncate'>{post.user.username}</span>
                                            {post.user.admin ? <Hammer className='w-4 h-4' /> : post.user.verified && <SealCheck className='w-4 h-4' />}
                                        </h1>
                                    </div>
                                </div>

                            </Link>
                        )}
                    </div>

                    <div className='flex gap-8 -mt-60'>
                        {posts && posts.slice(8, 15).map((post, i) =>
                            <Link style={{ marginTop: `${48 * i}px` }} href={`/explore/?postId=${post.id}`} key={post.id} className={`w-44 h-72 rotate-12 min-w-[176px] border border-gray-500 rounded-md relative mt-[${48 * i}px]`}>
                                <Image
                                    // 176px is the same as w-44, the width of the container
                                    sizes="176px"
                                    src={formatImage(post.image, post.user.id)}
                                    className="object-cover"
                                    fill
                                    alt={post.type}
                                    priority
                                />

                                <div className='flex flex-col justify-end items-center p-2 absolute inset-0 bg-gradient-to-b from-transparent to-black w-full h-full bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100'>
                                    <div className='flex gap-2 w-full'>
                                        <Image className='rounded-full object-contain' src={formatAvatar(post.user.image, post.user.id)} alt={post.user.username ?? ""} width={30} height={30} />

                                        <h1 className='text-white flex gap-1 items-center text-sm w-full'>
                                            <span className='truncate'>{post.user.username}</span>
                                            {post.user.admin ? <Hammer className='w-4 h-4' /> : post.user.verified && <SealCheck className='w-4 h-4' />}
                                        </h1>
                                    </div>
                                </div>

                            </Link>
                        )}
                    </div>

                    <div className='flex gap-8 -mt-60'>
                        {posts && posts.slice(16, 23).map((post, i) =>
                            <Link style={{ marginTop: `${48 * i}px` }} href={`/explore/?postId=${post.id}`} key={post.id} className={`w-44 h-72 rotate-12 min-w-[176px] border border-gray-500 rounded-md relative mt-[${48 * i}px]`}>
                                <Image
                                    // 176px is the same as w-44, the width of the container
                                    sizes="176px"
                                    src={formatImage(post.image, post.user.id)}
                                    className="object-cover"
                                    fill
                                    alt={post.type}
                                    priority
                                />

                                <div className='flex flex-col justify-end items-center p-2 absolute inset-0 bg-gradient-to-b from-transparent to-black w-full h-full bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100'>
                                    <div className='flex gap-2 w-full'>
                                        <Image className='rounded-full object-contain' src={formatAvatar(post.user.image, post.user.id)} alt={post.user.username ?? ""} width={30} height={30} />

                                        <h1 className='text-white flex gap-1 items-center text-sm w-full'>
                                            <span className='truncate'>{post.user.username}</span>
                                            {post.user.admin ? <Hammer className='w-4 h-4' /> : post.user.verified && <SealCheck className='w-4 h-4' />}
                                        </h1>
                                    </div>
                                </div>

                            </Link>
                        )}
                    </div>

                    <div className='flex gap-8 -mt-60'>
                        {posts && posts.slice(24, 31).map((post, i) =>
                            <Link style={{ marginTop: `${48 * i}px` }} href={`/explore/?postId=${post.id}`} key={post.id} className={`w-44 h-72 rotate-12 min-w-[176px] border border-gray-500 rounded-md relative mt-[${48 * i}px]`}>
                                <Image
                                    // 176px is the same as w-44, the width of the container
                                    sizes="176px"
                                    src={formatImage(post.image, post.user.id)}
                                    className="object-cover"
                                    fill
                                    alt={post.type}
                                    priority
                                />

                                <div className='flex flex-col justify-end items-center p-2 absolute inset-0 bg-gradient-to-b from-transparent to-black w-full h-full bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100'>
                                    <div className='flex gap-2 w-full'>
                                        <Image className='rounded-full object-contain' src={formatAvatar(post.user.image, post.user.id)} alt={post.user.username ?? ""} width={30} height={30} />

                                        <h1 className='text-white flex gap-1 items-center text-sm w-full'>
                                            <span className='truncate'>{post.user.username}</span>
                                            {post.user.admin ? <Hammer className='w-4 h-4' /> : post.user.verified && <SealCheck className='w-4 h-4' />}
                                        </h1>
                                    </div>
                                </div>

                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
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