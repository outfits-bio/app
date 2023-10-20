/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Post, PostType } from '@prisma/client';
import { inferRouterOutputs } from '@trpc/server';
import React from 'react';
import {
  PiBackpackBold, PiBaseballCapBold, PiCoatHangerBold, PiEyeglassesBold, PiHoodieBold, PiPantsBold, PiShirtFoldedBold, PiSneakerBold, PiTShirtBold
} from 'react-icons/pi';
import { AppRouter } from '~/server/api/root';
import { api } from '~/utils/api.util';
import { handleErrors } from '~/utils/handle-errors.util';


type RouterOutput = inferRouterOutputs<AppRouter>;
// TODO: Find a better way to grab a type from the second param of ctx.post.getPostsAllTypes.setData
type PartialPost = Omit<Omit<Post, "userId">, "updatedAt">;
type Context = ReturnType<(typeof api)["useContext"]>;

export interface PostSectionProps {
  profileData?: RouterOutput["user"]["getProfile"];
  postsData?: RouterOutput["post"]["getPostsAllTypes"];
  type: PostType;
  loading: boolean;
}

/**
 * This isn't SOLID, I'm sorry Uncle Bob :(
 * @param type PostType
 * @returns string
 */
export const getPostTypeName = (type: PostType): string => {
  switch (type) {
    case PostType.OUTFIT:
      return "Outfits";
    case PostType.HOODIE:
      return "Outerwear";
    case PostType.SHIRT:
      return "Tops";
    case PostType.PANTS:
      return "Bottoms";
    case PostType.SHOES:
      return "Footwear";
    case PostType.WATCH:
      return "Accessories";
    case PostType.GLASSES:
      return "Glasses";
    case PostType.HEADWEAR:
      return "Headwear";
    case PostType.JEWELRY:
      return "Jewelry";
  }
};

/**
 * This isn't SOLID, I'm sorry Uncle Bob :(
 * @param type PostType
 * @param profileData RouterOutput["user"]["getProfile"]
 * @returns number
 */
export const getPostTypeCount = (
  type: PostType,
  profileData?: RouterOutput["user"]["getProfile"]
): React.ReactNode => {
  switch (type) {
    case PostType.OUTFIT:
      return profileData?.outfitPostCount ?? 0;
    case PostType.HOODIE:
      return profileData?.hoodiePostCount ?? 0;
    case PostType.SHIRT:
      return profileData?.shirtPostCount ?? 0;
    case PostType.PANTS:
      return profileData?.pantsPostCount ?? 0;
    case PostType.SHOES:
      return profileData?.shoesPostCount ?? 0;
    case PostType.WATCH:
      return profileData?.watchPostCount ?? 0;
    case PostType.GLASSES:
      return profileData?.glassesPostCount ?? 0;
    case PostType.HEADWEAR:
      return profileData?.headwearPostCount ?? 0;
    case PostType.JEWELRY:
      return profileData?.jewelryPostCount ?? 0;
  }
};

export const getPostTypeIcon = (type: PostType): React.ReactNode => {
  switch (type) {
    case PostType.OUTFIT:
      return <PiCoatHangerBold className='md:w-12 md:h-12 w-8 h-8' />
    case PostType.HOODIE:
      return <PiShirtFoldedBold className='md:w-12 md:h-12 w-8 h-8' />
    case PostType.SHIRT:
      return <PiTShirtBold className='md:w-12 md:h-12 w-8 h-8' />
    case PostType.PANTS:
      return <PiPantsBold className='md:w-12 md:h-12 w-8 h-8' />
    case PostType.SHOES:
      return <PiSneakerBold className='md:w-12 md:h-12 w-8 h-8' />
    case PostType.WATCH:
      return <PiBackpackBold className='md:w-12 md:h-12 w-8 h-8' />
    case PostType.GLASSES:
      return <PiEyeglassesBold className='md:w-12 md:h-12 w-8 h-8' />
    case PostType.HEADWEAR:
      return <PiBaseballCapBold className='md:w-12 md:h-12 w-8 h-8' />
    case PostType.JEWELRY:
      return <PiTShirtBold className='md:w-12 md:h-12 w-8 h-8' />
  }
};

export const getPostTypeIconSmall = (type: PostType): React.ReactNode => {
  switch (type) {
    case PostType.OUTFIT:
      return <PiCoatHangerBold className='w-6 h-6' />
    case PostType.HOODIE:
      return <PiHoodieBold className='w-6 h-6' />
    case PostType.SHIRT:
      return <PiTShirtBold className='w-6 h-6' />
    case PostType.PANTS:
      return <PiPantsBold className='w-6 h-6' />
    case PostType.SHOES:
      return <PiSneakerBold className='w-6 h-6' />
    case PostType.WATCH:
      return <PiTShirtBold className='w-6 h-6' />
    case PostType.GLASSES:
      return <PiEyeglassesBold className='w-6 h-6' />
    case PostType.HEADWEAR:
      return <PiBaseballCapBold className='w-6 h-6' />
    case PostType.JEWELRY:
      return <PiTShirtBold className='w-6 h-6' />
  }
}

/**
 * Optimistically updates the previously fetched array of posts using the updateData function
 * @param ctx Context (from api.useContext)
 * @param updateData (old: PartialPost[] | undefined) => PartialPost[] | undefined
 * @param userId string
 * @returns { prevData: PartialPost[] | undefined }
 */
export const onMutate = async (
  ctx: Context,
  updateData: (old: PartialPost[] | undefined) => PartialPost[] | undefined,
  userId?: string
): Promise<{ prevData: PartialPost[] | undefined }> => {
  await ctx.post.getPostsAllTypes.refetch();

  const prevData = ctx.post.getPostsAllTypes.getData();

  ctx.post.getPostsAllTypes.setData({ id: userId ?? "" }, updateData as any);

  return { prevData };
};

/**
 * Rolls back the optimistic update if the mutation fails
 * @param ctx Context (from api.useContext)
 * @param err any
 * @param context { prevData: PartialPost[] | undefined }
 * @param message string
 * @param userId string
 * @returns void
 */
export const onError = async (
  ctx: Context,
  err: any,
  context: any,
  message: string,
  userId?: string
) => {
  ctx.post.getPostsAllTypes.setData({ id: userId ?? "" }, context!.prevData);
  handleErrors({ e: err, message });
};

/**
 * Refetches the posts if the mutation succeeds
 * @param ctx Context (from api.useContext)
 * @param username string
 * @returns void
 */
export const onSettled = async (ctx: Context, username?: string | null) => {
  ctx.post.getPostsAllTypes.refetch();
  ctx.user.getProfile.refetch({ username: username ?? "" });
};
