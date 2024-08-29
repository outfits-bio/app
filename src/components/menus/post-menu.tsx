/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useParamsModal } from "@/hooks/params-modal.hook";
import { api } from "@/trpc/react";
import { handleErrors } from "@/utils/handle-errors.util";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { forwardRef, useRef } from "react";
import { ReportModal } from "../modals/report-modal";
import { Button } from "../ui/Button";
import { DeleteModal } from "../modals/delete-modal";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { PiDotsThree } from "react-icons/pi";

interface PostMenuProps {
  userIsProfileOwner: boolean;
  button?: JSX.Element;
  postId?: string;
}

// Create a forwardRef wrapper for the PiDotsThree icon
const ForwardedPiDotsThree = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof PiDotsThree>
>((props, ref) => (
  <button ref={ref} onClick={(e) => e.stopPropagation()}>
    <PiDotsThree {...props} />
  </button>
));

ForwardedPiDotsThree.displayName = "ForwardedPiDotsThree";

export const PostMenu = ({
  userIsProfileOwner,
  button,
  postId,
  ...props
}: PostMenuProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const { data: session } = useSession();
  const { close } = useParamsModal("postId");

  const user = session?.user;

  const ctx = api.useUtils();

  const { mutate } = api.admin.deletePost.useMutation({
    onSuccess: () => {
      toast.success("Post deleted successfully!");
      void ctx.post.getLatestPosts.refetch();
      void ctx.post.getPostsAllTypes.refetch();
      close();
    },
    onError: (e) =>
      handleErrors({
        e,
        message: "An error occurred while deleting this post.",
      }),
  });

  /**
   * This deletes the post
   * The image gets removed from the s3 bucket in the backend
   * onMutate, onError, and onSettled are custom functions in ./post-section.util.ts that handle optimistic updates
   */
  const { mutate: deletePost } = api.post.deletePost.useMutation({
    onSuccess: () => {
      toast.success("Post deleted successfully!");
      void ctx.post.getLatestPosts.refetch();
      void ctx.post.getPostsAllTypes.refetch();
      close();
    },
    onError: (e) =>
      handleErrors({
        e,
        message: "An error occurred while deleting this post.",
      }),
  });

  return (
    <Popover {...props}>
      <PopoverTrigger asChild>
        {button ?? (
          <ForwardedPiDotsThree className="w-5 h-5 text-white mt-1.5" />
        )}
      </PopoverTrigger>
      <PopoverContent
        className="space-y-1 w-fit mr-2 md:mr-0"
        onClick={(e) => e.stopPropagation()}
      >
        {user && (
          <div>
            <ReportModal type="POST" id={postId} />
          </div>
        )}
        {userIsProfileOwner && !user?.admin && (
          <div>
            <DeleteModal
              ref={ref}
              post
              deleteFn={() => {
                deletePost({ id: postId?.toString() ?? "" });
              }}
            >
              <Button variant={"ghost"}>
                <p>Delete</p>
              </Button>
            </DeleteModal>
          </div>
        )}
        {user?.admin && (
          <div>
            <DeleteModal
              ref={ref}
              post
              admin
              deleteFn={() => {
                mutate({ id: postId?.toString() ?? "" });
                router.push("/");
              }}
            >
              <Button variant={"ghost"}>Delete</Button>
            </DeleteModal>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
