import {
  addPostToWishlistSchema,
  addReactionSchema,
  getPostSchema,
  removePostFromWishlistSchema,
  removeReactionSchema,
  toggleLikePostSchema,
} from "@/schemas/post.schema";
import { getPostsSchema, paginatedSchema } from "@/schemas/user.schema";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";
import { TRPCError } from "@trpc/server";
import { NotificationType, PostType } from "database";
import type { Prisma } from "database";
import { z } from "zod";

import { deleteImage, generatePresignedUrl } from "@/utils/image.util";
import { filterBadWords } from "@/utils/username.util";

export const postTypeSchema = z.object({
  type: z.nativeEnum(PostType),
  tags: z.array(z.string()),
  caption: z.string().max(40),
  productLink: z.string(),
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

      if (input.caption && filterBadWords(input.caption))
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Caption contains bad words",
        });

      const post = await ctx.prisma.post.create({
        data: {
          tags: input.tags,
          caption: input.caption,
          productLink: input.productLink,
          type: input.type,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          image: id,
        },
        select: {
          tags: true,
          caption: true,
          productLink: true,
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

      // First, delete all comments and their replies
      const comments = await ctx.prisma.comment.findMany({
        where: { postId: id },
        include: { replies: true },
      });

      for (const comment of comments) {
        // Delete replies recursively
        const deleteReplies = async (replyId: string) => {
          const replies = await ctx.prisma.comment.findMany({
            where: { parentId: replyId },
            include: { replies: true },
          });

          for (const reply of replies) {
            await deleteReplies(reply.id);
          }

          // Use deleteMany instead of delete to avoid errors if the comment was already deleted
          await ctx.prisma.comment.deleteMany({ where: { id: replyId } });
        };

        // Delete all replies of the comment
        for (const reply of comment.replies) {
          await deleteReplies(reply.id);
        }

        // Delete the comment itself
        await ctx.prisma.comment.deleteMany({ where: { id: comment.id } });
      }

      // Now delete the post
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

      let isLiked = false;

      if (post.likes.length) {
        // Unlike
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
        });
      } else {
        // Like
        await ctx.prisma.post.update({
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
        });

        isLiked = true;

        // Only create notification and send push notification when liking
        if (post.userId !== ctx.session.user.id) {
          await ctx.prisma.notification.create({
            data: {
              type: NotificationType.POST_LIKE,
              targetUser: {
                connect: {
                  id: post.userId,
                },
              },
              user: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
              post: {
                connect: {
                  id: post.id,
                },
              },
            },
          });
        }
      }

      return {
        success: true,
        isLiked,
      };
    }),

  addReaction: protectedProcedure
    .input(addReactionSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, emoji } = input;

      const reaction = await ctx.prisma.reaction.create({
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
          post: {
            select: {
              userId: true,
            },
          },
        },
      });

      const notification = await ctx.prisma.notification.create({
        data: {
          type: NotificationType.POST_REACTION,
          targetUser: {
            connect: {
              id: reaction.post.userId,
            },
          },
          message: emoji,
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

      return !!notification.id;
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

      const post = await ctx.prisma.post.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      const wishlist = ctx.prisma.user.update({
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

      // Only create a notification if the post is not owned by the current user
      if (post.userId !== ctx.session.user.id) {
        const notification = ctx.prisma.notification.create({
          data: {
            type: NotificationType.POST_WISHLIST,
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

        await ctx.prisma.$transaction([wishlist, notification]);

      } else {
        await ctx.prisma.$transaction([wishlist]);
      }

      return true;
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

      return posts.map((post) => {
        return {
          ...post,
          authUserHasLiked: post.likes.length > 0,
        };
      });
    }),

  getWishlist: protectedProcedure
    .input(paginatedSchema)
    .query(async ({ ctx, input }) => {
      const { cursor, skip } = input;

      const posts = await ctx.prisma.post.findMany({
        where: {
          wishlists: {
            some: {
              id: ctx.session.user.id,
            },
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
          _count: {
            select: {
              reactions: true,
              likes: true,
              wishlists: true,
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
          wishlists: {
            where: {
              id: ctx.session?.user.id,
            },
            select: {
              id: true,
            },
          },
          reactions: {
            where: {
              userId: ctx.session?.user.id,
            },
            select: {
              id: true,
              content: true,
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

  getPost: publicProcedure
    .input(getPostSchema)
    .query(async ({ ctx, input }) => {
      const { id } = input;

      const post = await ctx.prisma.post.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          image: true,
          type: true,
          featured: true,
          likeCount: true,
          createdAt: true,
          caption: true,
          tags: true,
          productLink: true,
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
          _count: {
            select: {
              reactions: true,
              likes: true,
              wishlists: true,
            },
          },
          likes: {
            select: { id: true, username: true, image: true, verified: true, admin: true },
          },
          wishlists: {
            where: {
              id: ctx.session?.user.id,
            },
            select: {
              id: true,
            },
          },
          reactions: {
            where: {
              userId: ctx.session?.user.id,
            },
            select: {
              id: true,
              content: true,
            },
          },
        },
      });

      if (!post)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid post!",
        });

      return {
        ...post,
        authUserHasLiked: post.likes.length > 0,
      };
    }),

  getLatestPosts: publicProcedure
    .input(getPostsSchema)
    .query(async ({ ctx, input }) => {
      const { cursor, skip, types, category } = input;

      const orderBy: Prisma.PostFindManyArgs["orderBy"] = {};

      if (category === "popular") {
        orderBy.likeCount = "desc";
      } else {
        orderBy.createdAt = "desc";
      }

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
          createdAt: true,
          tags: true,
          caption: true,
          productLink: true,
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
          _count: {
            select: {
              Comment: true,
              likes: true,
              wishlists: true,
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
          wishlists: {
            where: {
              id: ctx.session?.user.id,
            },
            select: {
              id: true,
            },
          },
          Comment: {
            where: {
              userId: ctx.session?.user.id,
            },
            select: {
              id: true,
              content: true,
            },
          },
        },
        take: 6,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy,
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

  getFourRandomPosts: publicProcedure.query(async ({ ctx }) => {
    const count = await ctx.prisma.post.count();

    const skip = Math.max(0, Math.floor(Math.random() * count) - 4);
    const orderDirection = Math.random() > 0.5 ? "asc" : "desc";

    const posts = await ctx.prisma.post.findMany({
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
      take: 4,
      skip,
      orderBy: {
        createdAt: orderDirection,
      },
    });

    const uniquePosts = Array.from(new Set(posts.map(post => post.id))).map(id => posts.find(post => post.id === id));

    return uniquePosts;
  }),
});