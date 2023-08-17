import { createTRPCRouter } from "~/server/api/trpc";

import { adminRouter } from "./routers/admin";
import { postRouter } from "./routers/post";
import { reportRouter } from "./routers/report";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  post: postRouter,
  report: reportRouter,
  admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
