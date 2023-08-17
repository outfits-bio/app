import { z } from "zod";

import { LinkType, PostType, ReportType } from "@prisma/client";

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  username: z.string().min(3).max(20),
  confirmPassword: z.string().min(8).max(100),
});

export const getProfileSchema = z.object({
  username: z.string().min(3).max(20),
});

export const searchProfileSchema = z.object({
  username: z.string().max(20),
});

export const likeProfileSchema = z.object({
  id: z.string().cuid(),
});

export const editProfileSchema = z.object({
  username: z.string().max(20).optional(),
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

export const paginatedSchema = z.object({
  cursor: z.string().nullish(),
  skip: z.number().int().min(0).optional(),
});

export const getPostsSchema = z
  .object({
    type: z.nativeEnum(PostType).optional(),
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
