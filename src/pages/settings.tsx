import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { set, useForm } from 'react-hook-form';
import { Button } from '~/components/Button';
import { CropModal } from '~/components/CropModal';
import { Layout } from '~/components/Layout';
import { SpinnerSmall } from '~/components/Spinner';
import { useDragAndDrop } from '~/hooks/drag-and-drop.hook';
import { EditProfileInput, editProfileSchema } from '~/schemas/user.schema';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api.util';
import { handleErrors } from '~/utils/handle-errors.util';

import { zodResolver } from '@hookform/resolvers/zod';

const SettingsPage = () => {
  const { dragActive, file, fileUrl, handleDrag, handleDrop, setFile, setFileUrl, cropModalOpen, setCropModalOpen } = useDragAndDrop();
  const { data: session, update } = useSession();
  const { push } = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const ref = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, getValues } = useForm({
    resolver: zodResolver(editProfileSchema),
  });

  // On success, this updates the session and returns the user to their profile
  const { mutate } = api.user.editProfile.useMutation({
    onSuccess: (data) => {
      update();
      push(`/${data.username}`);
    },
    onError: (e) => handleErrors({ e, message: "Failed to edit profile!", fn: () => setLoading(false) })
  });

  /**
   * This creates a presigned url for the image and then uploads the image to the presigned url
   * If the user didn't change their name and username, they get sent back to their profile early,
   * otherwise the edit profile mutation will send them after it finishes
   */
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

    // If the user didn't change their name and username, do nothing
    if ((name && name.length) || (username && username.length)) mutate({
      name,
      username
    });
    else {
      setLoading(false);
    }

  };

  /**
   * This opens the crop modal and sets the file and fileUrl
   * This only fires when the user clicks on the "Create new" button, not when the user drags and drops
   */
  const handleFileChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (!e.currentTarget?.files?.length) return;

    setFile(e.currentTarget.files[0] ?? null);

    if (e.currentTarget.files[0])
      setFileUrl(URL.createObjectURL(e.currentTarget.files[0]));
    setCropModalOpen(true);
  }

  return (
    <Layout title='settings'>
      <div className="bg-white dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
        {cropModalOpen && <CropModal setFileUrl={setFileUrl} fileUrl={fileUrl} isOpen={cropModalOpen} setFile={setFile} setIsOpen={setCropModalOpen} />}
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-semibold font-prompt">Account Settings:</h2><br></br>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="mb-6">
              <label htmlFor="username" className="block font-medium mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded dark:bg-slate-950 dark:text-white"
                {...register('username')}
              />
            </div>

            <h2 className="text-2xl font-semibold font-prompt">Profile Settings:</h2><br></br>
            <div className="mb-6">
              <label htmlFor="name" className="block font-medium mb-1">
                Display Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded dark:bg-slate-950 dark:text-white"
                {...register('name')}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="avatar" className="block font-medium mb-1">
                Avatar
              </label>
              <div
                onClick={() => ref.current?.click()}
                onDragEnter={handleDrag}
                className="relative flex items-center justify-center h-40 border border-slate-300 rounded"
              >
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

            <Button
              type="submit"
              disabled={loading}
              size='lg'
              color='secondary'
            >
              {loading && <SpinnerSmall />}
              Save Changes
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

// TODO: Possibly change to client side, this is sort of slow
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
