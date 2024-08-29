import { api } from "@/trpc/react";
import { handleErrors } from "@/utils/handle-errors.util";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { PiHeartBold, PiHeartFill } from "react-icons/pi";
import { Button } from "../../ui/Button";
import type { PostProps } from "./post";

export interface LikeButtonProps extends PostProps {
  variant?: "default" | "ghost";
}

export function LikeButton({
  post,
  children,
}: LikeButtonProps & { children?: React.ReactNode }) {
  const { data: session } = useSession();

  const [likeAnimation, setLikeAnimation] = useState<boolean>(false);

  const ctx = api.useUtils();
  const { mutate: sendPushNotification } =
    api.notifications.sendPushNotification.useMutation();

  const { mutate: toggleLikePost } = api.post.toggleLikePost.useMutation({
    onSuccess: () => {
      void ctx.post.getLatestPosts.refetch();
      void ctx.post.getPostsAllTypes.refetch({ id: post.user.id });

      sendPushNotification({
        userId: post.user.id,
        body: `${session?.user.username} liked your post`,
      });
    },
    onError: (e) =>
      handleErrors({
        e,
        message: `An error occurred while liking this post: ${e.message}`,
      }),
  });

  const isLiked = post.authUserHasLiked && session?.user;

  const handleLike = () => {
    setLikeAnimation(true);
    toggleLikePost({ id: post.id });
  };

  return (
    <Button
      variant={"outline-ghost"}
      centerItems
      shape={"circle"}
      iconLeft={
        isLiked ? (
          <PiHeartFill className={likeAnimation ? "animate-like" : ""} />
        ) : (
          <PiHeartBold />
        )
      }
      className="text-white flex-col gap-0 border-white/50 sm:border-stroke sm:text-black bg-black/50 sm:bg-transparent focus:outline-none sm:dark:text-white"
      onClick={handleLike}
      aria-label="Like Button"
    >
      {children}
    </Button>
  );
}
