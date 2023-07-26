import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  username: z.string().min(3).max(20),
  confirmPassword: z.string().min(8).max(100),
});

export const getProfileSchema = z.object({
  username: z.string().min(3).max(20),
});

export const likeProfileSchema = z.object({
  id: z.string().cuid(),
});

export const editProfileSchema = z.object({
  username: z.string().max(20).optional(),
  tagline: z.string().max(180).optional(),
});
export type EditProfileInput = ReturnType<typeof editProfileSchema.parse>;
