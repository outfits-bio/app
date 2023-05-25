import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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
            password,
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

  getProfile: publicProcedure
    .input(getProfileSchema)
    .query(async ({ input, ctx }) => {
      const { username } = input;

      const user = await ctx.prisma.user.findUnique({
        where: {
          username,
        },
        select: {
          username: true,
          name: true,
          image: true,
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
});
