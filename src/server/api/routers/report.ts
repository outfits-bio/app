import { TRPCError } from "@trpc/server";
import axios from "axios";
import { env } from "~/env.mjs";
import {
  createBugReportSchema,
  createReportSchema,
  resolveReportSchema,
} from "~/schemas/user.schema";
import { formatImage } from "~/utils/image-src-format.util";


import { createTRPCRouter, protectedProcedure } from "../trpc";

export const reportRouter = createTRPCRouter({
  report: protectedProcedure
    .input(createReportSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, reason, type } = input;

      if (type === "USER") {
        const report = await ctx.prisma.user.update({
          where: { id },
          data: {
            reports: {
              create: {
                reason,
                type,
                creator: {
                  connect: {
                    id: ctx.session.user.id,
                  },
                },
              },
            },
          },
        });

        await axios.post(env.DISCORD_MOD_REPORT_WEBHOOK_URL ?? "", {
          username: "Reports Bot",
          avatar_url: "",
          content: `New report from [${
            ctx.session.user.username
          }](https://outfits.bio/${encodeURI(ctx.session.user.username)})`,
          embeds: [
            {
              title: "Report",
              description: `**Type:** ${type}\n**Reason:** ${reason}\n**Offender:** [${
                report.username
              }](https://outfits.bio/${encodeURI(report.username ?? "")})`,
              color: 0xff0000,
            },
          ],
        });
      } else if (type === "POST") {
        const report = await ctx.prisma.post.update({
          where: { id },
          data: {
            reports: {
              create: {
                reason,
                type,
                creator: {
                  connect: {
                    id: ctx.session.user.id,
                  },
                },
              },
            },
          },
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
        });

        await axios.post(env.DISCORD_MOD_REPORT_WEBHOOK_URL ?? "", {
          username: "Reports Bot",
          avatar_url: "",
          content: `New report from [${
            ctx.session.user.username
          }](https://outfits.bio/${encodeURI(ctx.session.user.username)})`,
          embeds: [
            {
              title: "Report",
              description: `**Type:** ${type}\n**Reason:** ${reason}\n**Offender:** [${
                report.user.username
              }](https://outfits.bio/${encodeURI(
                report.user.username ?? ""
              )}?postId=${id})`,
              color: 0xff0000,
              image: {
                url: formatImage(report.image, report.userId),
              },
            },
          ],
        });
      }

      return true;
    }),

  resolve: protectedProcedure
    .input(resolveReportSchema)
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const currentUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { admin: true },
      });

      if (!currentUser?.admin)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not an admin.",
        });

      await ctx.prisma.report.update({
        where: { id },
        data: {
          resolved: true,
        },
      });

      return true;
    }),

  reportBug: protectedProcedure
    .input(createBugReportSchema)
    .mutation(async ({ ctx, input }) => {
      const { description } = input;

      await axios.post(env.DISCORD_BUG_WEBHOOK_URL ?? "", {
        username: "Bug Reports Bot",
        avatar_url: "",
        content: `New bug report from [${
          ctx.session.user.username
        }](https://outfits.bio/${encodeURI(ctx.session.user.username)})`,
        embeds: [
          {
            title: "Bug Report",
            description: description,
            color: 0xff0000,
          },
        ],
      });

      return true;
    }),

  feedback: protectedProcedure
    .input(createBugReportSchema)
    .mutation(async ({ ctx, input }) => {
      const { description } = input;

      await axios.post(env.DISCORD_FEEDBACK_WEBHOOK_URL ?? "", {
        username: "Feedback Bot",
        avatar_url: "",
        content: `New feedback from [${
          ctx.session.user.username
        }](https://outfits.bio/${encodeURI(ctx.session.user.username)})`,
        embeds: [
          {
            title: "Feedback",
            description: description,
            color: 0xff0000,
          },
        ],
      });

      return true;
    }),
});
