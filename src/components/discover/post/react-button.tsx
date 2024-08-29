import { PiChatCircleBold } from "react-icons/pi";
import { Button } from "../../ui/Button";
import type { PostProps } from "./post";
import {
  BaseModal,
  BaseModalContent,
  BaseModalTrigger,
} from "../../modals/base-modal";
import { CommentSection } from "./comment-section";

export default function ReactButton({
  post,
  children,
}: PostProps & { children?: React.ReactNode }) {
  return (
    <BaseModal>
      <BaseModalTrigger>
        <Button
          variant={"outline-ghost"}
          centerItems
          shape={"circle"}
          iconLeft={<PiChatCircleBold />}
          className="flex-col gap-0 text-white border-white/50 sm:border-stroke sm:text-black bg-black/50 sm:bg-transparent focus:outline-none sm:dark:text-white"
          aria-label="Comment Button"
        >
          {children}
        </Button>
      </BaseModalTrigger>
      <BaseModalContent>
        <CommentSection post={post} />
      </BaseModalContent>
    </BaseModal>
  );
}
