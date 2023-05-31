import superjson from "superjson";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

import { createServerSideHelpers } from "@trpc/react-query/server";

export const generateSSGHelper = () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, session: null },
    transformer: superjson, // optional - adds superjson serialization
  });
