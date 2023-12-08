import { z } from "zod";

import { editProfileSchema } from "./user.schema";

export const deleteUserSchema = z.object({
  id: z.string().cuid(),
});
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;

export const editUserSchema = z
  .object({
    id: z.string().cuid(),
  })
  .merge(editProfileSchema);
export type EditUserInput = z.infer<typeof editUserSchema>;

export const deleteUserLinkSchema = z.object({
  id: z.string().cuid(),
  linkId: z.string().cuid(),
});
export type DeleteUserLinkInput = z.infer<typeof deleteUserLinkSchema>;
