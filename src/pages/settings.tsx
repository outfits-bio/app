import 'cropperjs/dist/cropper.css';

import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { ReactCropperElement } from 'react-cropper';
import { useForm } from 'react-hook-form';
import { CropModal } from '~/components/CropModal';
import { Layout } from '~/components/Layout';
import { SpinnerSmall } from '~/components/Spinner';
import { EditProfileInput, editProfileSchema } from '~/schemas/user.schema';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import { handleErrors } from '~/utils/handle-errors.util';

import { zodResolver } from '@hookform/resolvers/zod';

const SettingsPage = () => {
  const [file, setFile] = useState<any>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [cropModalOpen, setCropModalOpen] = useState<boolean>(false);

  const cropperRef = useRef<ReactCropperElement>(null);
  const ref = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, getValues } = useForm({
    resolver: zodResolver(editProfileSchema),
  });

  const { data: session, update } = useSession();
  const { push } = useRouter();

  const { mutate } = api.user.editProfile.useMutation({
    onSuccess: (data) => {
      update();
      push(`/${data.username}`);
    },
    onError: (e) => handleErrors({ e, message: "Failed to edit profile!", fn: () => setLoading(false) })
  });

  const { mutate: setImage } = api.user.setImage.useMutation({
    onSuccess: async (result) => {
      await axios.put(result, file);

      if (!getValues().name && !getValues().username) {
        update();
        push(`/${session?.user.username}`)
      }
    },
    onError: (e) => handleErrors({ e, message: "Failed to set image!", fn: () => setLoading(false) })
  });

  const handleFormSubmit = async ({ name, username }: EditProfileInput) => {
    setLoading(true);

    if (file) {
      setImage();
    }

    // Handle form submission
    if ((name && name.length) || (username && username.length)) mutate({
      name,
      username
    });
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
    <Layout title='settings'>
      <div className="bg-white text-black py-8 px-4 sm:px-6 lg:px-8">
        {cropModalOpen && <CropModal file={file} setFileUrl={setFileUrl} cropperRef={cropperRef} fileUrl={fileUrl} isOpen={cropModalOpen} onCrop={onCrop} setIsOpen={setCropModalOpen} />}
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-black font-prompt">Account Settings:</h2><br></br>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="mb-6">
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

            <h2 className="text-2xl font-semibold text-black font-prompt">Profile Settings:</h2><br></br>
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
              className="flex items-center justify-center gap-4 w-full h-12 bg-gray-700 hover:bg-gray-900 text-white font-semibold rounded-md mt-4"
            >
              {loading && <SpinnerSmall />}
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  } else {
    return {
      props: {}
    }
  }
}

export default SettingsPage;
