import { TRPCError } from "@trpc/server";
import axios from "axios";
import { NotificationType } from "database";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  getProfileSchema,
  likeProfileSchema,
  searchProfileSchema,
  SpotifyStatus,
} from "~/schemas/user.schema";

export const profileRouter = createTRPCRouter({
  profileExists: publicProcedure
    .input(getProfileSchema)
    .query(async ({ input, ctx }) => {
      const { username } = input;

      const user = await ctx.prisma.user.findUnique({
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

      const user = await ctx.prisma.user.findUnique({
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
            where: { id: ctx.session?.user.id },
            select: { id: true },
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
          (user) => user.id === ctx.session?.user.id
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
        const like = ctx.prisma.user.update({
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

        const notification = ctx.prisma.notification.create({
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

        const [res] = await ctx.prisma.$transaction([like, notification]);

        likeData = res;
      } catch (error) {
        likeData = await ctx.prisma.user.update({
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

      const users = await ctx.prisma.user.findMany({
        where: {
          username: {
            contains: username,
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
    const users = await ctx.prisma.user.count();

    return users;
  }),

  getLanyardStatus: publicProcedure
    .input(getProfileSchema)
    .query(async ({ input, ctx }) => {
      const { username } = input;

      const user = await ctx.prisma.user.findUnique({
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
        (account) => account.provider === "discord"
      )?.providerAccountId;

      try {
        const { data } = await axios.get(
          `https://api.lanyard.rest/v1/users/${discordId}`
        );

        const { spotify }: { spotify: SpotifyStatus | null } = data.data;

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
});
