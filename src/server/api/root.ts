import { profileRouter } from "./routers/profile";
import { reportRouter } from "./routers/report";
import { userRouter } from "./routers/user";
import { adminRouter } from "./routers/admin";
import { notificationsRouter } from "./routers/notifications";
import { postRouter } from "./routers/post";
import { commentRouter } from "./routers/comment";
import { createTRPCRouter, createCallerFactory, mergeRouters } from "./trpc";

const userRouters = mergeRouters(userRouter, profileRouter);

export const appRouter = createTRPCRouter({
  user: userRouters,
  post: postRouter,
  comment: commentRouter,
  report: reportRouter,
  admin: adminRouter,
  notifications: notificationsRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
