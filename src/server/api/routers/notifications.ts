import { deleteNotificationSchema } from "~/schemas/notification.schema";

import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const notificationsRouter = createTRPCRouter({
  getNotifications: protectedProcedure.query(async ({ ctx }) => {
    const notifications = await ctx.prisma.notification.findMany({
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

    await ctx.prisma.notification.updateMany({
      where: {
        targetUserId: ctx.session.user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return notifications;
  }),
  deleteNotification: protectedProcedure
    .input(deleteNotificationSchema)
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const notification = await ctx.prisma.notification.findUnique({
        where: {
          id,
          targetUserId: ctx.session.user.id,
        },
        select: {
          id: true,
          targetUserId: true,
        },
      });

      if (!notification) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Notification not found.",
        });
      }

      await ctx.prisma.notification.delete({
        where: {
          id,
        },
      });

      return true;
    }),
});
