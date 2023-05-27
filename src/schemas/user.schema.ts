import { z } from "zod";

export const userSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  username: z.string().min(3).max(20),
  confirmPassword: z.string().min(8).max(100),
});

export const getProfileSchema = z.object({
  username: z.string().min(3).max(20),
});

export const editProfileSchema = z.object({
  name: z.string().optional(),
  username: z.string().max(20).optional(),
});
export type EditProfileInput = ReturnType<typeof editProfileSchema.parse>;
