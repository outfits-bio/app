import { AppRouter } from "~/server/api/root";
import { api } from "~/utils/api";
import { handleErrors } from "~/utils/handle-errors.util";

import { Post, PostType } from "@prisma/client";
import { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;
type PartialPost = Omit<Omit<Post, "userId">, "updatedAt">;
type Context = ReturnType<(typeof api)["useContext"]>;

export interface PostSectionProps {
  profileData?: RouterOutput["user"]["getProfile"];
  postsData?: RouterOutput["post"]["getPostsAllTypes"];
  type: PostType;
}

export const getPostTypeName = (type: PostType): string => {
  switch (type) {
    case PostType.OUTFIT:
      return "Outfits";
    case PostType.HOODIE:
      return "Hoodies";
    case PostType.SHIRT:
      return "Shirts";
    case PostType.PANTS:
      return "Pants";
    case PostType.SHOES:
      return "Shoes";
    case PostType.WATCH:
      return "Watches";
  }
};

export const getPostTypeCount = (
  type: PostType,
  profileData?: RouterOutput["user"]["getProfile"]
): number => {
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
  }
};

export const onMutate = async (
  ctx: Context,
  updateData: (old: PartialPost[] | undefined) => PartialPost[] | undefined,
  userId?: string
) => {
  await ctx.post.getPostsAllTypes.invalidate();

  const prevData = ctx.post.getPostsAllTypes.getData();

  ctx.post.getPostsAllTypes.setData({ id: userId ?? "" }, updateData);

  return { prevData };
};

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

export const onSettled = async (ctx: Context, username?: string | null) => {
  ctx.post.getPostsAllTypes.invalidate();
  ctx.user.getProfile.invalidate({ username: username ?? "" });
};
