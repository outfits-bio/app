import { z } from "zod";

export const deleteNotificationSchema = z.object({
  id: z.string(),
});
export type DeleteNotificationInput = z.infer<typeof deleteNotificationSchema>;
