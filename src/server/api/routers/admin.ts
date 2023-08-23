import { env } from "~/env.mjs";
import { deleteUserSchema, editUserSchema } from "~/schemas/admin.schema";

import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "../trpc";

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

      const s3 = new S3Client({
        region: env.AWS_REGION,
        endpoint: env.AWS_ENDPOINT,
      });

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

      s3.send(
        new DeleteObjectCommand({
          Bucket: "outfits",
          Key: `${post.userId}/${post.image}.png`,
        })
      );

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
      const s3 = new S3Client({
        region: env.AWS_REGION,
        endpoint: env.AWS_ENDPOINT,
      });

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

      s3.send(
        new DeleteObjectCommand({
          Bucket: "outfits",
          Key: `${id}/${oldImage.image}.png`,
        })
      );

      return true;
    }),
});
