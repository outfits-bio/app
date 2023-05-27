import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PostType } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const postTypeSchema = z.object({
  type: z.enum([
    PostType.HOODIE,
    PostType.OUTFIT,
    PostType.PANTS,
    PostType.SHIRT,
    PostType.SHOES,
    PostType.WATCH,
  ]),
});

export const idSchema = z.object({
  id: z.string(),
});

export const postSchema = postTypeSchema.merge(idSchema);

export const postRouter = createTRPCRouter({
  createPost: protectedProcedure
    .input(postTypeSchema)
    .mutation(async ({ input, ctx }) => {
      const s3 = new S3Client({
        region: env.AWS_REGION,
        endpoint: env.AWS_ENDPOINT,
      });

      const imageId = `${ctx.session.user.id}-${Date.now()}`;

      let res: string;

      try {
        res = await getSignedUrl(
          s3,
          new PutObjectCommand({
            Bucket: "outfits",
            Key: `${ctx.session.user.id}/${imageId}.png`,
            ContentType: "image/png",
          }),
          {
            expiresIn: 30,
          }
        );
      } catch (error) {
        console.error(error);

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid image!",
        });
      }

      const post = await ctx.prisma.post.create({
        data: {
          type: input.type,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          image: imageId,
        },
        select: {
          createdAt: true,
          type: true,
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create post!",
        });
      }

      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          [`${input.type.toLowerCase()}PostCount`]: {
            increment: 1,
          },
          imageCount: {
            increment: 1,
          },
        },
      });

      return {
        ...post,
        res,
      };
    }),

  deletePost: protectedProcedure
    .input(idSchema)
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      const s3 = new S3Client({
        region: env.AWS_REGION,
        endpoint: env.AWS_ENDPOINT,
      });

      const post = await ctx.prisma.post.delete({
        where: {
          id,
          userId: ctx.session.user.id,
        },
        select: {
          type: true,
          image: true,
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
          Key: `${ctx.session.user.id}/${post.image}.png`,
        })
      );

      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
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

  getPostsAllTypes: publicProcedure
    .input(idSchema)
    .query(async ({ ctx, input }) => {
      const { id } = input;

      const posts = await ctx.prisma.post.findMany({
        where: {
          userId: id,
        },
        select: {
          id: true,
          type: true,
          image: true,
          createdAt: true,
        },
        take: 20,
        orderBy: {
          createdAt: "desc",
        },
      });

      return posts;
    }),
});
