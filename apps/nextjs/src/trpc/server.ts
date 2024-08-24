import { cache } from "react";
import { createHydrationHelpers } from "@trpc/react-query/rsc";

import type { AppRouter } from "@acme/api";
import { createCaller, createTRPCContext } from "@acme/api";
import { auth } from "@acme/auth";

import { createQueryClient } from "./query-client";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  let headers;
  if (typeof window === 'undefined') {
    // Server-side
    const { headers: nextHeaders } = await import('next/headers');
    headers = new Headers(nextHeaders());
    headers.set("x-trpc-source", "rsc");
  } else {
    // Client-side
    headers = new Headers();
    headers.set("x-trpc-source", "client");
  }

  return createTRPCContext({
    session: await auth(),
    headers,
  });
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);