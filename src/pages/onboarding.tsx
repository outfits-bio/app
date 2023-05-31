import 'cropperjs/dist/cropper.css';

import axios from 'axios';
import { GetServerSidePropsContext, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { ReactCropperElement } from 'react-cropper';
import { useForm } from 'react-hook-form';
import superjson from 'superjson';
import { CropModal } from '~/components/CropModal';
import { Spinner, SpinnerSmall } from '~/components/Spinner';
import { EditProfileInput, editProfileSchema } from '~/schemas/user.schema';
import { appRouter } from '~/server/api/root';
import { getServerAuthSession } from '~/server/auth';
import { prisma } from '~/server/db';
import { api } from '~/utils/api';
import { handleErrors } from '~/utils/handle-errors.util';

import { zodResolver } from '@hookform/resolvers/zod';
import { createServerSideHelpers } from '@trpc/react-query/server';

export const OnboardingPage: NextPage = () => {
    const [file, setFile] = useState<any>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState<boolean>(false);
    const [cropModalOpen, setCropModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const cropperRef = useRef<ReactCropperElement>(null);
    const ref = useRef<HTMLInputElement>(null);

    const { push } = useRouter();
    const { update } = useSession();
    const ctx = api.useContext();

    const { register, handleSubmit, setValue } = useForm({
        resolver: zodResolver(editProfileSchema),
    });

    api.user.getMe.useQuery(undefined, {
        onError: (e) => handleErrors({ e, message: "Failed to fetch you!", fn: () => push('/') }),
        onSuccess: (data) => {
            setValue('name', data.name);
            setValue('username', data.username);
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const { mutateAsync } = api.user.editProfile.useMutation({
        onSuccess: (data) => {
            update();

            push(`/${data.username}`);
        },
        onError: (e) => handleErrors({ e, message: "Failed to edit profile!" }),
    });

    const { mutateAsync: setImage } = api.user.setImage.useMutation({
        onSuccess: async (result) => {
            await axios.put(result, file);

            ctx.user.getProfile.invalidate();
            update();
        },
        onError: (e) => handleErrors({ e, message: "Failed to set image!" }),
    });

    const handleFormSubmit = async ({ username, name }: EditProfileInput) => {
        setLoading(true);

        // Handle form submission
        if ((name && name.length) || (username && username.length)) await mutateAsync({
            name,
            username
        });

        if (file) {
            await setImage();
        }

        setLoading(false);
    };

    const handleFileChange = (e: React.FormEvent<HTMLInputElement>) => {
        if (!e.currentTarget?.files?.length) return;

        setFile(e.currentTarget.files[0] ?? null);

        if (e.currentTarget.files[0])
            setFileUrl(URL.createObjectURL(e.currentTarget.files[0]));
        setCropModalOpen(true);
    }

    const handleDrag = function (e: any) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = function (e: any) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (!e.dataTransfer?.files?.length) return;

        setFile(e.dataTransfer.files[0] ?? null);

        if (e.currentTarget.files[0])
            setFileUrl(URL.createObjectURL(e.currentTarget.files[0]));
        setCropModalOpen(true);
    };

    const onCrop = () => {
        const cropper = cropperRef.current?.cropper;
        if (typeof cropper !== 'undefined') {
            cropper.getCroppedCanvas().toBlob((b) => {
                if (!b) return;

                const file = new File(
                    [b],
                    "avatar.png",
                    {
                        type: "image/png",
                        lastModified: Date.now()
                    }
                );

                setFile(file);
            });
        }
    };

    return (
        <div className='h-screen flex flex-col w-full absolute'>
            {cropModalOpen && <CropModal file={file} setFileUrl={setFileUrl} cropperRef={cropperRef} fileUrl={fileUrl} isOpen={cropModalOpen} onCrop={onCrop} setIsOpen={setCropModalOpen} />}
            <div className="bg-white text-black py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto">
                    <h2 className="text-2xl font-semibold text-black font-prompt">Let's get you set up!</h2><br></br>
                    <form onSubmit={handleSubmit(handleFormSubmit)}>
                        <div className="mb-6">
                            <div className="mb-6">
                                <label htmlFor="name" className="block font-medium mb-1">
                                    Display Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded"
                                    {...register('name')}
                                />
                            </div>

                            <label htmlFor="username" className="block font-medium mb-1">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded"
                                {...register('username')}
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="avatar" className="block font-medium mb-1">
                                Avatar
                            </label>
                            <div onClick={() => ref.current?.click()} onDragEnter={handleDrag} className="relative flex items-center justify-center h-40 border border-gray-300 rounded">
                                {dragActive && <div className='absolute w-full h-full t-0 r-0 b-0 l-0' onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
                                <input
                                    ref={ref}
                                    id="avatar"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                {file ? (
                                    <img
                                        src={fileUrl ?? ""}
                                        alt="Avatar Preview"
                                        className="h-full object-cover"
                                    />
                                ) : (
                                    <div className="cursor-pointer">
                                        Drag and drop an image or click to upload
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-3 w-full h-12 bg-gray-700 hover:bg-gray-900 text-white font-semibold rounded-md mt-4"
                        >
                            {loading && <SpinnerSmall />}
                            Continue
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

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
                }
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
            trpcState: helpers.dehydrate(),
        }
    };
}

export default OnboardingPage;