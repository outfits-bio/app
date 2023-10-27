import { PostType } from "@prisma/client";
import { GetStaticProps, NextPage } from "next";
import Head from 'next/head';
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Layout } from "~/components/Layout";
import { PostSection } from "~/components/PostSection";
import { ProfileCard } from "~/components/ProfileCard";
import { ProfilePost, ProfilePostModal } from "~/components/ProfilePostModal";
import { generateSSGHelper } from "~/server/utils/ssg.util";
import { api } from "~/utils/api.util";
import { handleErrors } from "~/utils/handle-errors.util";

export const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { push, query } = useRouter();
  const { data, status } = useSession();

  const [postModalOpen, setPostModalOpen] = useState<boolean>(false);
  const [post, setPost] = useState<ProfilePost | null>(null);

  const { data: profileData, isLoading } = api.user.getProfile.useQuery(
    { username },
    {
      onError: (e) =>
        handleErrors({
          e,
          message: "Failed to get user!",
          fn: () => push(`/${username}/not-found`),
        }),
      retry: 0,
    }
  );

  const { data: postsData, isLoading: postsLoading } =
    api.post.getPostsAllTypes.useQuery(
      {
        id: profileData?.id ?? "",
      },
      {
        retry: 0,
        enabled: !!profileData?.id,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        onError: (e) =>
          handleErrors({
            e,
            message: "Failed to get posts!",
            fn: () => push("/"),
          }),
      }
    );

  useEffect(() => {
    if (query.postId) {
      const post = postsData?.find((p) => p.id === query.postId);

      if (post) {
        setPost(post);
        setPostModalOpen(true);
      }
    } else {
      setPost(null);
      setPostModalOpen(false);
    }
  }, [query.postId, postsData]);

  const isCurrentUser = data?.user.username === username ?? false;

  const pageTitle = isCurrentUser ? `profile` : username ?? "profile";

  return (
    <Layout title={pageTitle}>
      <Head>
        <meta property="og:title" content={`Outfits.bio - (${username})`} key="title" />
        <meta property="og:image" content={profileData?.image ?? ""} />
      </Head>
      {postModalOpen && (
        <ProfilePostModal
          setPostModalOpen={setPostModalOpen}
          post={post}
          user={profileData ?? null}
        />
      )}
      <div className="flex h-full w-screen flex-col gap-4 overflow-y-scroll pr-4 md:flex-row md:gap-20  md:overflow-y-auto lg:gap-36">
        <ProfileCard
          loading={isLoading}
          authStatus={status}
          currentUser={data?.user ?? null}
          profileData={profileData}
          username={username}
          isCurrentUser={isCurrentUser}
        />

        <div className="w-full py-4 pl-4 md:overflow-y-scroll md:pl-0">
          <PostSection
            loading={postsLoading}
            profileData={profileData}
            postsData={postsData}
            type={PostType.OUTFIT}
          />
          <PostSection
            loading={postsLoading}
            profileData={profileData}
            postsData={postsData}
            type={PostType.HOODIE}
          />
          <PostSection
            loading={postsLoading}
            profileData={profileData}
            postsData={postsData}
            type={PostType.SHIRT}
          />
          <PostSection
            loading={postsLoading}
            profileData={profileData}
            postsData={postsData}
            type={PostType.PANTS}
          />
          <PostSection
            loading={postsLoading}
            profileData={profileData}
            postsData={postsData}
            type={PostType.SHOES}
          />
          <PostSection
            loading={postsLoading}
            profileData={profileData}
            postsData={postsData}
            type={PostType.WATCH}
          />
          <PostSection
            loading={postsLoading}
            profileData={profileData}
            postsData={postsData}
            type={PostType.JEWELRY}
          />
          <PostSection
            loading={postsLoading}
            profileData={profileData}
            postsData={postsData}
            type={PostType.HEADWEAR}
          />
          <PostSection
            loading={postsLoading}
            profileData={profileData}
            postsData={postsData}
            type={PostType.GLASSES}
          />
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const username = context.params?.username?.toString();

  if (!username)
    return {
      notFound: true,
      props: {},
    };

  try {
    await ssg.user.getProfile.prefetch({ username });

    return {
      props: {
        username,
        trpcState: ssg.dehydrate(),
      },
    };
  } catch (error) {
    return {
      props: {
        username,
      },
    };
  }
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
