import axios from "axios";
import { env } from "~/env.mjs";
import {
  addLinkSchema,
  editProfileSchema,
  getProfileSchema,
  likeProfileSchema,
  removeLinkSchema,
  searchProfileSchema,
  SpotifyStatus,
  userSchema,
} from "~/schemas/user.schema";
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
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const badUsernames = [
  // System
  "home",
  "login",
  "signup",
  "settings",
  "onboarding",
  "profile",
  "[username]",
  "explore",
  "notifications",
  "shoot",
  "shots",
  // Socials
  "outfitsbio",
  "outfits",
  "outfits.bio",
  "discord",
  "discordapp",
  "twitter",
  "instagram",
  "bereal",
  "tiktok",
  "tumblr",
  "patreon",
  "kofi",
  // Authentic People
  "jecta",
  // General
];

export const userRouter = createTRPCRouter({
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

  getMe: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        id: true,
        username: true,
        tagline: true,
        image: true,
        onboarded: true,
        links: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    if (!user.onboarded) {
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          onboarded: true,
        },
        select: {
          id: true,
        },
      });
    }

    return user;
  }),

  deleteProfile: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.user.delete({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),

  getAccounts: protectedProcedure.query(async ({ ctx }) => {
    const accounts = await ctx.prisma.account.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        id: true,
        provider: true,
      },
    });

    return accounts;
  }),

  unlinkAccount: protectedProcedure
    .input(likeProfileSchema)
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          id: true,
          accounts: {
            select: {
              id: true,
            },
          },
        },
      });

      if (user?.accounts.length === 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You must have at least one account linked",
        });
      }

      await ctx.prisma.account.delete({
        where: {
          id,
          userId: ctx.session.user.id,
        },
      });

      return true;
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
          imageCount: true,
          likeCount: true,
          verified: true,
          admin: true,
          likedBy: {
            where: { id: ctx.session?.user.id },
            select: { id: true },
          },
          accounts: {
            select: {
              providerAccountId: true,
              provider: true,
            },
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

  addLink: protectedProcedure
    .input(addLinkSchema)
    .mutation(async ({ input, ctx }) => {
      const { url } = input;

      const protocolTrimmedUrl = url.replace(/(^\w+:|^)\/\//, "");

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          links: true,
        },
      });

      if (user?.links.length === 6) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can only have 6 links",
        });
      }

      const data: Prisma.LinkCreateInput = {
        type: "WEBSITE",
        url,
        user: {
          connect: {
            id: ctx.session.user.id,
          },
        },
      };

      if (protocolTrimmedUrl.startsWith("discord.gg")) {
        data.type = "DISCORD";
      } else if (protocolTrimmedUrl.startsWith("twitter.com")) {
        data.type = "TWITTER";
      } else if (protocolTrimmedUrl.startsWith("instagram.com")) {
        data.type = "INSTAGRAM";
      } else if (protocolTrimmedUrl.startsWith("youtube.com")) {
        data.type = "YOUTUBE";
      } else if (protocolTrimmedUrl.startsWith("tiktok.com")) {
        data.type = "TIKTOK";
      } else if (protocolTrimmedUrl.startsWith("github.com")) {
        data.type = "GITHUB";
      }

      await ctx.prisma.link.create({
        data,
      });

      return user;
    }),

  removeLink: protectedProcedure
    .input(removeLinkSchema)
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      const link = await ctx.prisma.link.delete({
        where: {
          id,
          userId: ctx.session.user.id,
        },
      });

      return true;
    }),

  editProfile: protectedProcedure
    .input(editProfileSchema)
    .mutation(async ({ input, ctx }) => {
      const { tagline, username } = input;

      if (
        username &&
        (badUsernames.includes(username) ||
          username.startsWith("api/") ||
          username.startsWith("settings/") ||
          username.length < 3)
      )
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid username",
        });

      try {
        const user = await ctx.prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            tagline: tagline ? tagline : undefined,
            username: username ? username : undefined,
          },
          select: {
            username: true,
          },
        });

        return user;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Email or username already exists",
            });
          }
        }
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }),

  setImage: protectedProcedure.mutation(async ({ input, ctx }) => {
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

    s3.send(
      new DeleteObjectCommand({
        Bucket: "outfits",
        Key: `${ctx.session.user.id}/${ctx.session.user.image}.png`,
      })
    );

    await ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        image: imageId,
      },
    });

    return res;
  }),

  deleteImage: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        image: null,
      },
    });

    return true;
  }),

  likeProfile: protectedProcedure
    .input(likeProfileSchema)
    .mutation(async ({ input, ctx }) => {
      // like profile, or unlike if already liked
      const { id } = input;

      let like: { id: string };

      try {
        like = await ctx.prisma.user.update({
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
      } catch (error) {
        like = await ctx.prisma.user.update({
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

      return like;
    }),

  searchProfiles: publicProcedure
    .input(searchProfileSchema)
    .query(async ({ input, ctx }) => {
      const { username } = input;

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
        take: 5,
      });

      return users;
    }),

  getTotalUsers: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.count();

    return users;
  }),

  toggleEnableLanyard: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
        accounts: {
          some: {
            provider: "discord",
          },
        },
      },
      select: {
        id: true,
        lanyardEnabled: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You must have a discord account linked",
      });
    }

    await ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        lanyardEnabled: {
          set: !user.lanyardEnabled,
        },
      },
    });

    return true;
  }),

  getLanyardEnabled: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        lanyardEnabled: true,
      },
    });

    return user?.lanyardEnabled;
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
