import { NotificationType, PostType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  addPostToWishlistSchema,
  addReactionSchema,
  removePostFromWishlistSchema,
  removeReactionSchema,
  toggleLikePostSchema,
} from "~/schemas/post.schema";
import { getPostsSchema } from "~/schemas/user.schema";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { deleteImage, generatePresignedUrl } from "~/server/utils/image.util";

export const postTypeSchema = z.object({
  type: z.nativeEnum(PostType),
});

export const idSchema = z.object({
  id: z.string(),
});

export const postSchema = postTypeSchema.merge(idSchema);

export const postRouter = createTRPCRouter({
  createPost: protectedProcedure
    .input(postTypeSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, url } = await generatePresignedUrl(ctx.session.user.id);

      const post = await ctx.prisma.post.create({
        data: {
          type: input.type,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          image: id,
        },
        select: {
          createdAt: true,
          type: true,
          id: true,
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
        res: url,
      };
    }),

  deletePost: protectedProcedure
    .input(idSchema)
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

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

      if (post.image) await deleteImage(ctx.session.user.id, post.image);

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

  toggleLikePost: protectedProcedure
    .input(toggleLikePostSchema)
    .mutation(async ({ input, ctx }) => {
      // like profile, or unlike if already liked
      const { id } = input;

      const post = await ctx.prisma.post.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          userId: true,
          likes: {
            where: {
              id: ctx.session.user.id,
            },
            select: {
              id: true,
            },
          },
        },
      });

      if (!post)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid post!",
        });

      if (post.likes.length) {
        await ctx.prisma.post.update({
          where: {
            id,
          },
          data: {
            likeCount: {
              decrement: 1,
            },
            likes: {
              disconnect: {
                id: ctx.session.user.id,
              },
            },
          },
          select: {
            id: true,
          },
        });
      } else {
        const like = ctx.prisma.post.update({
          where: {
            id,
          },
          data: {
            likeCount: {
              increment: 1,
            },
            likes: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          },
          select: {
            userId: true,
          },
        });

        if (post.userId === ctx.session.user.id) {
          const notification = ctx.prisma.notification.create({
            data: {
              type: NotificationType.POST_LIKE,
              targetUser: {
                connect: {
                  id: post.userId,
                },
              },
              post: {
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

          await ctx.prisma.$transaction([like, notification]);
        } else {
          await ctx.prisma.$transaction([like]);
        }
      }

      return true;
    }),

  addReaction: protectedProcedure
    .input(addReactionSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, emoji } = input;

      const reaction = ctx.prisma.reaction.create({
        data: {
          content: emoji,
          post: {
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
        select: {
          id: true,
        },
      });

      const notification = ctx.prisma.notification.create({
        data: {
          type: NotificationType.POST_REACTION,
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

      const [res] = await ctx.prisma.$transaction([reaction, notification]);

      return res;
    }),

  removeReaction: protectedProcedure
    .input(removeReactionSchema)
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      const reaction = await ctx.prisma.reaction.delete({
        where: {
          id,
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
        },
      });

      return reaction;
    }),

  addToWishlist: protectedProcedure
    .input(addPostToWishlistSchema)
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      const wishlist = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          wishlistedPosts: {
            connect: {
              id,
            },
          },
        },
        select: {
          id: true,
        },
      });

      return wishlist;
    }),

  removeFromWishlist: protectedProcedure
    .input(removePostFromWishlistSchema)
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      const wishlist = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          wishlistedPosts: {
            disconnect: {
              id,
            },
          },
        },
        select: {
          id: true,
        },
      });

      return wishlist;
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
          likeCount: true,
          likes: {
            where: {
              id: ctx.session?.user.id,
            },
            select: {
              id: true,
            },
          },
        },
        take: 20,
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        posts: posts.map((post) => {
          return {
            ...post,
            authUserHasLiked: post.likes.length > 0,
          };
        }),
      };
    }),

  getLatestPosts: publicProcedure
    .input(getPostsSchema)
    .query(async ({ ctx, input }) => {
      const { cursor, skip, types, category: _category } = input;

      const posts = await ctx.prisma.post.findMany({
        where: {
          type: {
            in: types,
          },
        },
        select: {
          id: true,
          image: true,
          type: true,
          featured: true,
          likeCount: true,
          user: {
            select: {
              image: true,
              verified: true,
              username: true,
              id: true,
              admin: true,
              tagline: true,
            },
          },
          likes: {
            where: {
              id: ctx.session?.user.id,
            },
            select: {
              id: true,
            },
          },
        },
        take: 6,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (posts.length > 5) {
        const nextItem = posts.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }

      return {
        posts: posts.map((post) => {
          return {
            ...post,
            authUserHasLiked: post.likes.length > 0,
          };
        }),
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
      take: 25,
      orderBy: {
        createdAt: "desc",
      },
    });

    return posts;
  }),

  getTwoRandomPosts: publicProcedure.query(async ({ ctx }) => {
    const count = await ctx.prisma.post.count();

    const skip = Math.max(0, Math.floor(Math.random() * count) - 2);
    const orderDirection = Math.random() > 0.5 ? "asc" : "desc";

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
      take: 2,
      skip,
      orderBy: {
        createdAt: orderDirection,
      },
    });

    return posts;
  }),
});
