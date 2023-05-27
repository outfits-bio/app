import { createTRPCRouter } from "~/server/api/trpc";

import { postRouter } from "./routers/post";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
