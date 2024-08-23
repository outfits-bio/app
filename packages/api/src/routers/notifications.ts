import { deleteNotificationSchema } from "@acme/validators/notification.schema";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from 'zod';
import { sendPushNotificationToUser } from '../services/pushNotificationService';

export const notificationsRouter = createTRPCRouter({
  getNotifications: protectedProcedure.query(async ({ ctx }) => {
    const notifications = ctx.db.notification.findMany({
      where: {
        targetUserId: ctx.session.user.id,
      },
      select: {
        id: true,
        type: true,
        read: true,
        createdAt: true,
        message: true,
        link: true,
        post: {
          select: {
            id: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const update = ctx.db.notification.updateMany({
      where: {
        targetUserId: ctx.session.user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    const [res] = await ctx.db.$transaction([notifications, update]);

    // Send push notifications
    await sendPushNotificationToUser(ctx.session.user.id, 'outfits.bio', 'You have a new notification', ctx);

    return res;
  }),
  deleteNotification: protectedProcedure
    .input(deleteNotificationSchema)
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const notification = await ctx.db.notification.delete({
        where: {
          id,
          targetUserId: ctx.session.user.id,
        },
      });

      if (!notification) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Notification not found.",
        });
      }

      return true;
    }),
  deleteAllNotifications: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.notification.deleteMany({
      where: {
        targetUserId: ctx.session.user.id,
      },
    });

    return true;
  }),
  getUnreadNotificationsCount: protectedProcedure.query(async ({ ctx }) => {
    const count = await ctx.db.notification.count({
      where: {
        targetUserId: ctx.session.user.id,
        read: false,
      },
    });

    return count;
  }),
  subscribeToPushNotifications: protectedProcedure
    .input(z.object({
      subscription: z.object({
        endpoint: z.string(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string(),
        }),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.subscription.create({
        data: {
          userId: ctx.session.user.id,
          endpoint: input.subscription.endpoint,
          keys: input.subscription.keys,
        },
      });

      return true;
    }),
  getSubscriptions: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const subscriptions = await ctx.db.subscription.findMany({
        where: { userId: input.userId },
      });
      return subscriptions;
    }),
  sendPushNotification: protectedProcedure
    .input(z.object({
      userId: z.string(),
      title: z.string(),
      body: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      await sendPushNotificationToUser(input.userId, input.title, input.body, ctx);
      return true;
    }),
});