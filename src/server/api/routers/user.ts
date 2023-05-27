import bcrypt from "bcrypt";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { Prisma, User } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const userSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  username: z.string().min(3).max(20),
  confirmPassword: z.string().min(8).max(100),
});

const getProfileSchema = z.object({
  username: z.string().min(3).max(20),
});

export const editProfileSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).max(100).optional(),
  username: z.string().min(3).max(20).optional(),
});

export type editProfileInput = ReturnType<typeof editProfileSchema.parse>;

const badUsernames = ["login", "register", "settings"];

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(userSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, email, password, username, confirmPassword } = input;

      if (badUsernames.includes(username) || username.startsWith("api/")) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username is not allowed",
        });
      }

      if (password !== confirmPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Passwords do not match",
        });
      }

      let user: User;

      try {
        user = await ctx.prisma.user.create({
          data: {
            name,
            email,
            password: await bcrypt.hash(password, 13),
            username,
          },
        });

        return {
          username: user.username,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          id: user.id,
          image: user.image,
        } as Omit<User, "password">;
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
    }),

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
      const { name, email, password, username } = input;

      let user: User;

      try {
        user = await ctx.prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            name,
            email,
            password: password ? await bcrypt.hash(password, 13) : undefined,
            username,
          },
        });

        return !!user;
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

      return false;
    }),
});
