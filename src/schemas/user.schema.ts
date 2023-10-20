import { PostType, ReportType } from "@prisma/client";
import { z } from "zod";

export const usernameRegex = /^[A-Za-z0-9!@#$%&*()_+=|<>?{}[\]~'"-]+$/;

export const paginatedSchema = z.object({
  cursor: z.string().nullish(),
  skip: z.number().int().min(0).optional(),
});

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(usernameRegex, "Invalid characters!"),
  confirmPassword: z.string().min(8).max(100),
});

export const getProfileSchema = z.object({
  username: z.string().min(3).max(20),
});

export const searchProfileSchema = z
  .object({
    username: z.string().max(20),
  })
  .merge(paginatedSchema);

export const likeProfileSchema = z.object({
  id: z.string().cuid(),
});

export const editProfileSchema = z.object({
  username: z
    .string()
    .max(20)
    .regex(usernameRegex, "Invalid characters!")
    .optional(),
  tagline: z.string().max(180).optional(),
});
export type EditProfileInput = ReturnType<typeof editProfileSchema.parse>;

export const addLinkSchema = z.object({
  url: z.string().url(),
});
export type AddLinkInput = ReturnType<typeof addLinkSchema.parse>;

export const removeLinkSchema = z.object({
  id: z.string().cuid(),
});
export type RemoveLinkInput = ReturnType<typeof removeLinkSchema.parse>;

export const getPostsSchema = z
  .object({
    types: z.array(z.nativeEnum(PostType)).optional(),
    category: z.enum(["latest", "popular"]).optional(),
  })
  .merge(paginatedSchema);
export type GetPostsInput = ReturnType<typeof getPostsSchema.parse>;

export const createReportSchema = z.object({
  id: z.string().cuid(),
  reason: z.string().max(180),
  type: z.nativeEnum(ReportType),
});
export type CreateReportInput = ReturnType<typeof createReportSchema.parse>;

export const resolveReportSchema = z.object({
  id: z.string().cuid(),
});
export type ResolveReportInput = ReturnType<typeof resolveReportSchema.parse>;

export const createBugReportSchema = z.object({
  description: z.string().max(1000),
});
export type CreateBugReportInput = ReturnType<
  typeof createBugReportSchema.parse
>;

export interface SpotifyStatus {
  track_id: string;
  timestamps: unknown;
  song: string;
  artist: string;
  album_art_url: string;
  album: string;
}
