import { api } from "@/trpc/server";
import { PostSection } from "./post-section";
import { type PostType } from "database";

interface ServerPostSectionProps {
  username: string;
  type: PostType;
}

export async function ServerPostSection({
  username,
  type,
}: ServerPostSectionProps) {
  const profileData = await api.user.getProfile({ username });
  const postsData = await api.post.getPostsAllTypes({ id: profileData.id });

  return (
    <PostSection
      profileData={profileData}
      postsData={postsData}
      type={type}
      loading={false}
    />
  );
}
