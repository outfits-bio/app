/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { api } from "@/trpc/react";
import type { RouterOutputs } from "@/trpc/shared";
import { handleErrors } from "@/utils/handle-errors.util";
import { type Post, PostType } from "database";
import { PiCoatHangerBold, PiShirtFoldedBold, PiTShirtBold, PiPantsBold, PiSneakerBold, PiBackpackBold, PiEyeglassesBold, PiBaseballCapBold, PiHoodieBold } from "react-icons/pi";

type PartialPost = Omit<Omit<Post, "userId">, "updatedAt">;
type Context = ReturnType<(typeof api)["useUtils"]>;


export interface PostSectionProps {
    profileData?: RouterOutputs["user"]["getProfile"];
    postsData?: RouterOutputs["post"]["getPostsAllTypes"];
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
    profileData?: RouterOutputs["user"]["getProfile"]
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
    ctx.post.getPostsAllTypes.setData({ id: userId ?? "" }, context.prevData);
    handleErrors({ e: err, message });
};

/**
 * Refetches the posts if the mutation succeeds
 * @param ctx Context (from api.useContext)
 * @param username string
 * @returns void
 */
export const onSettled = async (ctx: Context, username?: string | null) => {
    void ctx.post.getPostsAllTypes.refetch();
    void ctx.user.getProfile.refetch({ username: username ?? "" });
};