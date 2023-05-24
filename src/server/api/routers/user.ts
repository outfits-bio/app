import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { Prisma, User } from "@prisma/client";
import { TRPCError } from "@trpc/server";

// display name, email, password, username, confirm password
const userSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  username: z.string().min(3).max(20),
  confirmPassword: z.string().min(8).max(100),
});

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(userSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, email, password, username, confirmPassword } = input;

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
});
