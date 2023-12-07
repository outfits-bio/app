import { TRPCError } from "@trpc/server";
import { NotificationType } from "database";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  deleteUserLinkSchema,
  deleteUserSchema,
  editUserSchema,
} from "~/schemas/admin.schema";

import { deleteImage } from "~/server/utils/image.util";

export const adminRouter = createTRPCRouter({
  deleteUser: protectedProcedure
    .input(deleteUserSchema)
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const currentUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { admin: true },
      });

      if (!currentUser?.admin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to delete users.",
        });
      }

      await ctx.prisma.user.delete({ where: { id } });

      return true;
    }),
  deletePost: protectedProcedure
    .input(deleteUserSchema)
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const currentUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { admin: true },
      });

      if (!currentUser?.admin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to delete posts.",
        });
      }

      const post = await ctx.prisma.post.delete({
        where: {
          id,
        },
        select: {
          type: true,
          image: true,
          userId: true,
        },
      });

      if (!post)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid post!",
        });

      if (post.image) await deleteImage(post.userId, post.image);

      await ctx.prisma.user.update({
        where: {
          id: post.userId,
        },
        data: {
          [`${post.type.toLowerCase()}PostCount`]: {
            decrement: 1,
          },
          imageCount: {
            decrement: 1,
          },
        },
        select: {
          id: true,
        },
      });

      return true;
    }),
  editUser: protectedProcedure
    .input(editUserSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const currentUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { admin: true },
      });

      if (!currentUser?.admin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to edit users.",
        });
      }

      await ctx.prisma.user.update({
        where: { id },
        data,
      });

      return true;
    }),
  removeUserAvatar: protectedProcedure
    .input(deleteUserSchema)
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const currentUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { admin: true },
      });

      if (!currentUser?.admin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to remove user avatars.",
        });
      }

      const oldImage = await ctx.prisma.user.findUnique({
        where: { id },
        select: { image: true },
      });

      if (!oldImage?.image) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found!",
        });
      }

      await ctx.prisma.user.update({
        where: { id },
        data: {
          image: null,
        },
      });

      await deleteImage(id, oldImage.image);

      return true;
    }),
  removeUserLink: protectedProcedure
    .input(deleteUserLinkSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, linkId } = input;

      const currentUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { admin: true },
      });

      if (!currentUser?.admin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to remove user links.",
        });
      }

      const link = await ctx.prisma.link.delete({
        where: { id: linkId, userId: id },
      });

      if (link) return true;

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Link not found!",
      });
    }),
  toggleUserVerified: protectedProcedure
    .input(deleteUserSchema)
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const currentUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { admin: true },
      });

      if (!currentUser?.admin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to give users verified.",
        });
      }

      try {
        const user = ctx.prisma.user.update({
          where: {
            id,
            verified: false,
          },
          data: {
            verified: true,
          },
          select: {
            id: true,
          },
        });

        const notification = ctx.prisma.notification.create({
          data: {
            type: NotificationType.OTHER,
            message: "You have been given verified!",
            targetUser: {
              connect: {
                id,
              },
            },
            user: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          },
        });

        await ctx.prisma.$transaction([user, notification]);
      } catch (error) {
        await ctx.prisma.user.update({
          where: {
            id,
            verified: true,
          },
          data: {
            verified: false,
          },
          select: {
            id: true,
          },
        });
      }

      return true;
    }),
});
