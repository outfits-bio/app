"use server";

import { api } from "@/trpc/server";
import { DiscoverContent } from "@/components/discover/discover-content";

export default async function DiscoverPage() {
  const initialPosts = await api.post.getLatestPosts({
    category: "latest",
    types: undefined,
  });

  const popularProfiles = await api.user.getMostLikedProfiles();

  return (
    <DiscoverContent
      initialPosts={initialPosts}
      popularProfiles={popularProfiles}
    />
  );
}
