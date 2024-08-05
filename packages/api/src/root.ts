import { profileRouter } from "./routers/profile";
import { reportRouter } from "./routers/report";
import { userRouter } from "./routers/user";
import { authRouter } from "./routers/auth";
import { adminRouter } from "./routers/admin";
import { notificationsRouter } from "./routers/notifications";
import { postRouter } from "./routers/post";
import { createTRPCRouter, mergeRouters } from "./trpc";

const userRouters = mergeRouters(userRouter, profileRouter);

export const appRouter = createTRPCRouter({
  user: userRouters,
  auth: authRouter,
  post: postRouter,
  report: reportRouter,
  admin: adminRouter,
  notifications: notificationsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
