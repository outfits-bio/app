import { z } from "zod";
import { env } from "~/env.mjs";
import { getPostsSchema, paginatedSchema } from "~/schemas/user.schema";
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
          featured: true,
        },
        take: 20,
        orderBy: {
          createdAt: "desc",
        },
      });

      return posts;
    }),
  getLatestPosts: publicProcedure
    .input(getPostsSchema)
    .query(async ({ ctx, input }) => {
      const { cursor, skip, type } = input;

      const posts = await ctx.prisma.post.findMany({
        where: {
          type,
        },
        select: {
          id: true,
          image: true,
          type: true,
          featured: true,
          user: {
            select: {
              image: true,
              verified: true,
              username: true,
              id: true,
              admin: true,
            },
          },
        },
        take: 21,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (posts.length > 20) {
        const nextItem = posts.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }

      return {
        posts,
        nextCursor,
      };
    }),
  getLoginPosts: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      where: {},
      select: {
        id: true,
        image: true,
        type: true,
        featured: true,
        user: {
          select: {
            image: true,
            verified: true,
            username: true,
            id: true,
            admin: true,
          },
        },
      },
      take: 24,
      orderBy: {
        createdAt: "desc",
      },
    });

    return posts;
  }),
});
