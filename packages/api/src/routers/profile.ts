import {
  getProfileSchema,
  getFollowersByIdSchema,
  likeProfileSchema,
  searchProfileSchema,
  type SpotifyStatus,
} from "@acme/validators/user.schema";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import { NotificationType } from "@acme/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { sendPushNotificationToUser } from '../services/pushNotificationService';

export const profileRouter = createTRPCRouter({
  profileExists: publicProcedure
    .input(getProfileSchema)
    .query(async ({ input, ctx }) => {
      const { username } = input;

      const user = await ctx.db.user.findUnique({
        where: {
          username,
        },
        select: {
          username: true,
        },
      });

      return !!user;
    }),
  getProfile: publicProcedure
    .input(getProfileSchema)
    .query(async ({ input, ctx }) => {
      const { username } = input;

      const user = await ctx.db.user.findUnique({
        where: {
          username,
        },
        select: {
          id: true,
          username: true,
          tagline: true,
          image: true,
          hoodiePostCount: true,
          outfitPostCount: true,
          shirtPostCount: true,
          shoesPostCount: true,
          pantsPostCount: true,
          watchPostCount: true,
          glassesPostCount: true,
          headwearPostCount: true,
          jewelryPostCount: true,
          imageCount: true,
          likeCount: true,
          verified: true,
          admin: true,
          likedBy: {
            select: { id: true, username: true, image: true },
          },
          links: true,
          lanyardEnabled: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return {
        ...user,
        authUserHasLiked: user.likedBy.some(
          (user) => user.id === ctx.session?.user.id,
        ),
      };
    }),

  getMostLikedProfiles: publicProcedure
    .query(async ({ ctx }) => {
      const users = await ctx.db.user.findMany({
        orderBy: {
          likeCount: "desc",
        },
        select: {
          id: true,
          username: true,
          tagline: true,
          admin: true,
          verified: true,
          image: true,
          imageCount: true,
          likeCount: true,
        },
        take: 4,
      });

      return users;
    }),

  getFollowersById: publicProcedure
    .input(getFollowersByIdSchema)
    .query(async ({ input, ctx }) => {
      const { id } = input;

      const user = await ctx.db.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          username: true,
          tagline: true,
          image: true,
          hoodiePostCount: true,
          outfitPostCount: true,
          shirtPostCount: true,
          shoesPostCount: true,
          pantsPostCount: true,
          watchPostCount: true,
          glassesPostCount: true,
          headwearPostCount: true,
          jewelryPostCount: true,
          imageCount: true,
          likeCount: true,
          verified: true,
          admin: true,
          likedBy: {
            select: { id: true, username: true, image: true, verified: true, admin: true },
          },
          links: true,
          lanyardEnabled: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return {
        ...user,
        authUserHasLiked: user.likedBy.some(
          (user) => user.id === ctx.session?.user.id,
        ),
      };
    }),

  likeProfile: protectedProcedure
    .input(likeProfileSchema)
    .mutation(async ({ input, ctx }) => {
      // like profile, or unlike if already liked
      const { id } = input;

      let likeData: { id: string };

      try {
        const like = ctx.db.user.update({
          where: {
            id,
            likedBy: {
              none: {
                id: ctx.session.user.id,
              },
            },
          },
          data: {
            likedBy: {
              connect: {
                id: ctx.session.user.id,
              },
            },
            likeCount: {
              increment: 1,
            },
          },
          select: {
            id: true,
          },
        });

        const notification = ctx.db.notification.create({
          data: {
            type: NotificationType.PROFILE_LIKE,
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

        const [res] = await ctx.db.$transaction([like, notification]);

        // Send push notification
        if (id !== ctx.session.user.id) {
          await sendPushNotificationToUser(
            id,
            'outfits.bio',
            `${ctx.session.user.username} liked your profile`,
            ctx
          );
        }

        likeData = res;
      } catch (error) {
        likeData = await ctx.db.user.update({
          where: {
            id,
            likedBy: {
              some: {
                id: ctx.session.user.id,
              },
            },
          },
          data: {
            likedBy: {
              disconnect: {
                id: ctx.session.user.id,
              },
            },
            likeCount: {
              decrement: 1,
            },
          },
          select: {
            id: true,
          },
        });
      }

      return likeData;
    }),

  searchProfiles: publicProcedure
    .input(searchProfileSchema)
    .query(async ({ input, ctx }) => {
      const { username, cursor, skip } = input;

      if (username.length === 0) return;

      const users = await ctx.db.user.findMany({
        where: {
          username: {
            contains: username,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          username: true,
          image: true,
          tagline: true,
          imageCount: true,
          likeCount: true,
          verified: true,
          admin: true,
        },
        take: 11,
        skip,
        cursor: cursor ? { id: cursor } : undefined,
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (users.length > 10) {
        const nextItem = users.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }

      return { users, nextCursor };
    }),
  getTotalUsers: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.count();

    return users;
  }),

  getLanyardStatus: publicProcedure
    .input(getProfileSchema)
    .query(async ({ input, ctx }) => {
      const { username } = input;

      const user = await ctx.db.user.findUnique({
        where: {
          username,
          accounts: {
            some: {
              provider: "discord",
            },
          },
          lanyardEnabled: true,
        },
        select: {
          accounts: {
            select: {
              providerAccountId: true,
              provider: true,
            },
          },
        },
      });

      if (!user) return {};

      const discordId = user.accounts.find(
        (account) => account.provider === "discord",
      )?.providerAccountId;

      try {
        const res = await axios.get(
          `https://api.lanyard.rest/v1/users/${discordId}`,
        );

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const { spotify }: { spotify: SpotifyStatus | null } = res.data.data;

        if (!spotify) return {};

        return {
          title: spotify?.song,
          artist: spotify?.artist,
          albumArt: spotify?.album_art_url,
        };
      } catch (error) {
        return null;
      }
    }),

  generateOutfit: protectedProcedure
    .mutation(async ({ ctx }) => {
      const postTypes = [
        "HOODIE",
        "SHIRT",
        "PANTS",
        "SHOES",
        "WATCH",
        "GLASSES",
        "HEADWEAR",
        "JEWELRY"
      ] as const;

      const outfitPieces = await Promise.all(
        postTypes.map(async (type) => {
          const postsCount = await ctx.db.post.count({
            where: {
              userId: ctx.session.user.id,
              type: type,
            },
          });

          if (postsCount === 0) return null;

          const randomSkip = Math.floor(Math.random() * postsCount);

          const post = await ctx.db.post.findFirst({
            where: {
              userId: ctx.session.user.id,
              type: type,
            },
            select: {
              id: true,
              image: true,
              type: true,
            },
            skip: randomSkip,
          });
          return post;
        })
      );

      return outfitPieces.filter((piece): piece is NonNullable<typeof piece> => piece !== null);
    }),

  regeneratePiece: protectedProcedure
    .input(z.object({ type: z.enum(["HOODIE", "SHIRT", "PANTS", "SHOES", "WATCH", "GLASSES", "HEADWEAR", "JEWELRY"]) }))
    .mutation(async ({ ctx, input }) => {
      const postsCount = await ctx.db.post.count({
        where: {
          userId: ctx.session.user.id,
          type: input.type,
        },
      });

      if (postsCount === 0) return null;

      const randomSkip = Math.floor(Math.random() * postsCount);

      const newPiece = await ctx.db.post.findFirst({
        where: {
          userId: ctx.session.user.id,
          type: input.type,
        },
        select: {
          id: true,
          image: true,
          type: true,
        },
        skip: randomSkip,
      });

      return newPiece;
    }),
});