import {
  addPostToWishlistSchema,
  addReactionSchema,
  getPostSchema,
  removePostFromWishlistSchema,
  removeReactionSchema,
  toggleLikePostSchema,
} from "@acme/validators/post.schema";
import { getPostsSchema, paginatedSchema } from "@acme/validators/user.schema";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";
import { TRPCError } from "@trpc/server";
import { NotificationType, PostType } from "@acme/db";
import type { Prisma } from "@acme/db";
import { z } from "zod";
import webpush from 'web-push';

import { deleteImage, generatePresignedUrl } from "@acme/utils/image.util";

const sendPushNotification = async (subscription: webpush.PushSubscription, payload: string) => {
  try {
    await webpush.sendNotification(subscription, payload);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};

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

      const post = await ctx.db.post.create({
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

      await ctx.db.user.update({
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

      const post = await ctx.db.post.delete({
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

      await ctx.db.user.update({
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

      const post = await ctx.db.post.findUnique({
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
        await ctx.db.post.update({
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
        const like = ctx.db.post.update({
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

        // Only create a notification if the post is not owned by the current user
        if (post.userId !== ctx.session.user.id) {
          const notification = ctx.db.notification.create({
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

          await ctx.db.$transaction([like, notification]);

          // Send push notification
          const subscriptions = await ctx.db.subscription.findMany({
            where: { userId: post.userId },
          });

          console.log('Subscriptions found:', subscriptions.length);

          const payload = JSON.stringify({
            title: 'outfits.bio',
            body: `${ctx.session.user.username} liked your post`,
          });

          for (const subscription of subscriptions) {
            const pushSubscription: webpush.PushSubscription = {
              endpoint: subscription.endpoint,
              keys: subscription.keys as { p256dh: string; auth: string },
            };
            try {
              await sendPushNotification(pushSubscription, payload);
              console.log('Push notification sent successfully');
            } catch (error) {
              console.error('Error sending push notification:', error);
            }
          }
        } else {
          await ctx.db.$transaction([like]);
        }
      }

      return true;
    }),

  addReaction: protectedProcedure
    .input(addReactionSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, emoji } = input;

      const reaction = await ctx.db.reaction.create({
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

      const notification = await ctx.db.notification.create({
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

      const reaction = await ctx.db.reaction.delete({
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

      const post = await ctx.db.post.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      const wishlist = ctx.db.user.update({
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
        const notification = ctx.db.notification.create({
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

        await ctx.db.$transaction([wishlist, notification]);

        // Send push notification
        const subscriptions = await ctx.db.subscription.findMany({
          where: { userId: post.userId },
        });

        const payload = JSON.stringify({
          title: 'outfits.bio',
          body: `${ctx.session.user.username} added your post to their wishlist`,
        });

        subscriptions.forEach((subscription) => {
          const pushSubscription: webpush.PushSubscription = {
            endpoint: subscription.endpoint,
            keys: subscription.keys as { p256dh: string; auth: string },
          };
          sendPushNotification(pushSubscription, payload);
        });
      } else {
        await ctx.db.$transaction([wishlist]);
      }

      return true;
    }),

  removeFromWishlist: protectedProcedure
    .input(removePostFromWishlistSchema)
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      const wishlist = await ctx.db.user.update({
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

      const posts = await ctx.db.post.findMany({
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

      const posts = await ctx.db.post.findMany({
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

      const post = await ctx.db.post.findUnique({
        where: {
          id,
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

      const posts = await ctx.db.post.findMany({
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
    const posts = await ctx.db.post.findMany({
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
    const count = await ctx.db.post.count();

    const skip = Math.max(0, Math.floor(Math.random() * count) - 2);
    const orderDirection = Math.random() > 0.5 ? "asc" : "desc";

    const posts = await ctx.db.post.findMany({
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
    const count = await ctx.db.post.count();

    const skip = Math.max(0, Math.floor(Math.random() * count) - 4);
    const orderDirection = Math.random() > 0.5 ? "asc" : "desc";

    const posts = await ctx.db.post.findMany({
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