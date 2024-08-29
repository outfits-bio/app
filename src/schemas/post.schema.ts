import { z } from "zod";

export const toggleLikePostSchema = z.object({
  id: z.string().cuid(),
});
export type ToggleLikePostInput = z.infer<typeof toggleLikePostSchema>;

export const addReactionSchema = z.object({
  id: z.string().cuid(),
  emoji: z.enum(["❤️", "🔥"]),
});
export type AddReactionInput = z.infer<typeof addReactionSchema>;

export const removeReactionSchema = z.object({
  id: z.string().cuid(),
});
export type RemoveReactionInput = z.infer<typeof removeReactionSchema>;

export const addPostToWishlistSchema = z.object({
  id: z.string().cuid(),
});
export type AddPostToWishlistInput = z.infer<typeof addPostToWishlistSchema>;

export const removePostFromWishlistSchema = z.object({
  id: z.string().cuid(),
});
export type RemovePostFromWishlistInput = z.infer<
  typeof removePostFromWishlistSchema
>;

export const getPostSchema = z.object({
  id: z.string().cuid(),
});
export type GetPostInput = z.infer<typeof getPostSchema>;
