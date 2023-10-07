import { createTRPCRouter, mergeRouters } from "~/server/api/trpc";

import { adminRouter } from "./routers/admin";
import { notificationsRouter } from "./routers/notifications";
import { postRouter } from "./routers/post";
import { profileRouter } from "./routers/profile";
import { reportRouter } from "./routers/report";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
const userRouters = mergeRouters(userRouter, profileRouter);

export const appRouter = createTRPCRouter({
  user: userRouters,
  post: postRouter,
  report: reportRouter,
  admin: adminRouter,
  notifications: notificationsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
