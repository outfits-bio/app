import { env } from "~/env.mjs";
import {
  editProfileSchema,
  getProfileSchema,
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
  "login",
  "settings",
  "onboarding",
  "profile",
  "[username]",
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
        name: true,
        image: true,
        onboarded: true,
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
          name: true,
          image: true,
          hoodiePostCount: true,
          outfitPostCount: true,
          shirtPostCount: true,
          shoesPostCount: true,
          pantsPostCount: true,
          watchPostCount: true,
          imageCount: true,
          likeCount: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return user;
    }),

  editProfile: protectedProcedure
    .input(editProfileSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, username } = input;

      if (
        username &&
        (badUsernames.includes(username) ||
          username.startsWith("api/") ||
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
            name: name ? name : undefined,
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
});
