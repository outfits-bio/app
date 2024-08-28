import {
  addLinkSchema,
  editProfileSchema,
  likeProfileSchema,
  removeLinkSchema,
} from "@/schemas/user.schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Prisma } from "database";

import { deleteImage, generatePresignedUrl } from "@/utils/image.util";
import { filterBadWords, validateUsername } from "@/utils/username.util";

export const userRouter = createTRPCRouter({
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

      const account = await ctx.prisma.account.delete({
        where: {
          id,
          userId: ctx.session.user.id,
        },
      });

      if (account.provider === "discord") {
        await ctx.prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            lanyardEnabled: false,
          },
        });
      }

      return true;
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
          verified: true,
        },
      });

      if (user?.verified && user?.links.length === 6) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can only have 6 links",
        });
      } else if (!user?.verified && user?.links.length === 3) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can only have 3 links",
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
      } else if (
        protocolTrimmedUrl.startsWith("twitter.com") ||
        protocolTrimmedUrl.startsWith("x.com")
      ) {
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

      await ctx.prisma.link.delete({
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

      if (username && !validateUsername(username))
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid username",
        });

      if (tagline && filterBadWords(tagline))
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Tagline contains bad words",
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

  setImage: protectedProcedure.mutation(async ({ ctx }) => {
    const { url, id } = await generatePresignedUrl(ctx.session.user.id);

    if (ctx.session.user.image && url)
      await deleteImage(ctx.session.user.id, ctx.session.user.image);

    await ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        image: id,
      },
    });

    return url;
  }),

  deleteImage: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.session.user.image)
      await deleteImage(ctx.session.user.id, ctx.session.user.image);

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

  toggleHideLanyard: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        id: true,
        hideLanyard: true,
      },
    });

    await ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        hideLanyard: !user?.hideLanyard,
      },
    });

    return true;
  }),
});
