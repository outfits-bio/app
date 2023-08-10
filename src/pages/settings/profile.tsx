import axios from 'axios';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Button } from '~/components/Button';
import { CropModal } from '~/components/CropModal';
import { DeleteModal } from '~/components/DeleteModal';
import { SettingsLayout } from '~/components/SettingsLayout';
import { useFileUpload } from '~/hooks/file-upload.hook';
import {
  AddLinkInput, addLinkSchema, EditProfileInput, editProfileSchema
} from '~/schemas/user.schema';
import { api } from '~/utils/api.util';
import { handleErrors } from '~/utils/handle-errors.util';
import { formatAvatar } from '~/utils/image-src-format.util';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  DiscordLogo, InstagramLogo, LinkSimple, Plus, TiktokLogo, Trash, TwitterLogo, YoutubeLogo
} from '@phosphor-icons/react';
import { LinkType } from '@prisma/client';

const SettingsPage = () => {
  const { handleChange, dragActive, file, fileUrl, handleDrag, handleDrop, setFile, setFileUrl, cropModalOpen, setCropModalOpen } = useFileUpload();
  const { data: session, update } = useSession();
  const ctx = api.useContext();
  const [isOpen, setIsOpen] = useState(false);
  const { push } = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const ref = useRef<HTMLInputElement>(null);


  const { register, handleSubmit, getValues, setValue } = useForm<EditProfileInput>({
    resolver: zodResolver(editProfileSchema),
  });

  const { data: userData } = api.user.getMe.useQuery(undefined, {
    onSuccess: (data) => {
      setValue("username", data.username ?? '');
      setValue("tagline", data.tagline ?? '');
    }
  });

  const { register: registerLink, handleSubmit: handleSubmitLink } = useForm<AddLinkInput>({
    resolver: zodResolver(addLinkSchema),
  });

  useEffect(() => {
    if (!session?.user) return;

    setFileUrl(formatAvatar(session.user.image, session.user.id));
  }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [session]);


  // On success, this updates the session and returns the user to their profile
  const { mutate } = api.user.editProfile.useMutation({
    onSuccess: (data) => {
      update();
      push(`/${data.username}`);
    },
    onError: (e) => handleErrors({ e, message: "Failed to edit profile!", fn: () => setLoading(false) })
  });

  const { mutate: addLink, isLoading: linkLoading } = api.user.addLink.useMutation({
    onSuccess: () => {
      ctx.user.getMe.invalidate();
      toast.success("Link added!");
    },
    onError: (e) => handleErrors({ e, message: "Failed to add link!", fn: () => setLoading(false) })
  });

  const { mutate: removeLink, isLoading: removeLinkLoading, variables: removeLinkVariables } = api.user.removeLink.useMutation({
    onSuccess: () => {
      ctx.user.getMe.invalidate();
      toast.success("Link removed!");
    },
    onError: (e) => handleErrors({ e, message: "Failed to remove link!", fn: () => setLoading(false) })
  });

  /**
   * This creates a presigned url for the image and then uploads the image to the presigned url
   * If the user didn't change their username and username, they get sent back to their profile early,
   * otherwise the edit profile mutation will send them after it finishes
   */
  const { mutate: setImage } = api.user.setImage.useMutation({
    onSuccess: async (result) => {
      await axios.put(result, file);

      if (!getValues().username && !getValues().username) {
        update();
        push(`/${session?.user.username}`)
      }
    },
    onError: (e) => handleErrors({ e, message: "Failed to set image!", fn: () => setLoading(false) })
  });

  const { mutate: deleteImage } = api.user.deleteImage.useMutation({
    onSuccess: async () => {
      toast.success("Image deleted!");
      update();
    },
    onError: (e) => handleErrors({ e, message: "Failed to delete image!", fn: () => setLoading(false) })
  });

  const { mutate: deleteProfile, isLoading: deleteProfileLoading } = api.user.deleteProfile.useMutation({
    onSuccess: async () => {
      toast.success("Account deleted!");
      signOut({ callbackUrl: "/" });
    },
    onError: (e) => handleErrors({ e, message: "Failed to delete account!", fn: () => setLoading(false) })
  });

  const handleFormSubmit = async ({ username, tagline }: EditProfileInput) => {
    setLoading(true);

    if (file) {
      setImage();
    }

    // If the user didn't change their username and username, do nothing
    if ((username && username.length) || (tagline && tagline.length)) mutate({
      username,
      tagline
    });
    else {
      setLoading(false);
    }
  };

  const handleFormSubmitLink = ({ url }: AddLinkInput) => addLink({ url });

  return (
    <SettingsLayout>
      <div className='w-full p-4 overflow-y-scroll'>
        <div className="font-urbanist w-full md:w-[450px]">
          {cropModalOpen && <CropModal setFileUrl={setFileUrl} fileUrl={fileUrl} isOpen={cropModalOpen} setFile={setFile} setIsOpen={setCropModalOpen} />}
          {isOpen && <DeleteModal deleteAccount={deleteProfile} isOpen={isOpen} setIsOpen={setIsOpen} />}
          <h2 className="text-4xl font-black">Profile Details</h2><br></br>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <label htmlFor="avatar" className="block font-medium mb-1">
              Profile Picture
            </label>
            <div className="mb-4 flex w-full gap-4">
              <div>
                <div className='rounded-full h-44 w-44 flex items-center justify-center border border-black' onClick={() => ref.current?.click()}>
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

              <div className='grow space-y-2'>
                <Button centerItems iconLeft={<Plus />} type='button' onClick={() => ref.current?.click()}>Upload</Button>
                <Button color='outline' centerItems type='button' iconLeft={<Trash />} onClick={() => deleteImage()}>Remove</Button>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="username" className="block font-medium mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="w-full px-4 py-2 border rounded-md border-black dark:border-white dark:text-white dark:bg-black"
                {...register('username')}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="tagline" className="block font-medium mb-1">
                Tagline
              </label>
              <textarea
                id="tagline"
                className="w-full px-4 py-2 border rounded-md border-black dark:border-white dark:text-white dark:bg-black"
                placeholder='Enter your catchy tagline...'
                {...register('tagline')}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              isLoading={loading}
              centerItems
            >
              Save Changes
            </Button>
          </form>

          <form className='mt-8 w-full' onSubmit={handleSubmitLink(handleFormSubmitLink)}>
            <label htmlFor="link" className="block font-medium mb-1">
              Social Links
            </label>

            <div className='flex flex-col gap-2'>
              {userData?.links.map(link =>
                <div className='flex items-center gap-2'>
                  <p className='gap-1 py-2 grow w-full cursor-default flex px-4 items-center select-none rounded-md border border-black dark:border-white'>
                    {link.type === LinkType.TWITTER && <TwitterLogo className='w-5 h-5' />}
                    {link.type === LinkType.YOUTUBE && <YoutubeLogo className='w-5 h-5' />}
                    {link.type === LinkType.TIKTOK && <TiktokLogo className='w-5 h-5' />}
                    {link.type === LinkType.DISCORD && <DiscordLogo className='w-5 h-5' />}
                    {link.type === LinkType.INSTAGRAM && <InstagramLogo className='w-5 h-5' />}
                    {link.type === LinkType.WEBSITE && <LinkSimple className='w-5 h-5' />}
                    <span className='underline'>{link.url}</span>
                  </p>
                  <div>
                    <Button color='outline' iconLeft={<Trash />}
                      centerItems
                      isLoading={removeLinkLoading && removeLinkVariables?.id === link.id}
                      onClick={() => removeLink({ id: link.id })}
                    />
                  </div>
                </div>
              )}
            </div>

            {userData?.links && userData?.links?.length < 6 && <div className="mt-2">
              <div className='flex gap-2 w-full'>
                <input
                  id="link"
                  type="text"
                  placeholder='https://example.com'
                  className="px-4 py-2 w-full border rounded-md border-black dark:border-white dark:text-white dark:bg-black"
                  {...registerLink('url')}
                />
                <div>
                  <Button
                    type="submit"
                    disabled={linkLoading}
                    isLoading={linkLoading}
                    centerItems
                    iconLeft={<Plus />}
                  />
                </div>
              </div>
            </div>}
          </form>

          <h2 className="text-4xl font-black mt-8">Danger Zone</h2><br></br>

          <p className="mb-1">Delete Account</p>
          <Button
            color="warning"
            type="button"
            centerItems
            iconLeft={<Trash />}
            onClick={() => setIsOpen(true)}
            isLoading={deleteProfileLoading}
          >
            Delete
          </Button>
        </div>
      </div>
    </SettingsLayout>
  );
};

export default SettingsPage;
