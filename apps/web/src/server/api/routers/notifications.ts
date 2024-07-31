import { deleteNotificationSchema } from "@/schemas/notification.schema";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const notificationsRouter = createTRPCRouter({
  getNotifications: protectedProcedure.query(async ({ ctx }) => {
    const notifications = ctx.prisma.notification.findMany({
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

    const update = ctx.prisma.notification.updateMany({
      where: {
        targetUserId: ctx.session.user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    const [res] = await ctx.prisma.$transaction([notifications, update]);

    return res;
  }),
  deleteNotification: protectedProcedure
    .input(deleteNotificationSchema)
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const notification = await ctx.prisma.notification.delete({
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
    await ctx.prisma.notification.deleteMany({
      where: {
        targetUserId: ctx.session.user.id,
      },
    });

    return true;
  }),
  getUnreadNotificationsCount: protectedProcedure.query(async ({ ctx }) => {
    const count = await ctx.prisma.notification.count({
      where: {
        targetUserId: ctx.session.user.id,
        read: false,
      },
    });

    return count;
  }),
});
