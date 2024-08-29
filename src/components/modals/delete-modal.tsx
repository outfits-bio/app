import type { ReactNode } from "react";
import { Button } from "../ui/Button";
import {
  BaseModal,
  BaseModalClose,
  BaseModalContent,
  BaseModalDescription,
  BaseModalTitle,
  BaseModalTrigger,
} from "./base-modal";
import { forwardRef } from "react";

interface DeleteModalProps {
  deleteFn: () => void;
  admin?: boolean;
  post?: boolean;
  children?: ReactNode;
}

export const DeleteModal = forwardRef<HTMLButtonElement, DeleteModalProps>(
  ({ deleteFn, admin = false, post = false, children }, ref) => {
    return (
      <BaseModal>
        <BaseModalTrigger ref={ref}>{children}</BaseModalTrigger>

        <BaseModalContent>
          <BaseModalTitle>Are you sure?</BaseModalTitle>
          <BaseModalDescription>
            You can&apos;t undo this action.
          </BaseModalDescription>

          {post ? (
            <p className="text-sm">
              You&apos;re about to delete this post, once you do it will be gone
              forever. Are you sure you would like to proceed?
            </p>
          ) : (
            <p className="w-full text-sm">
              You&apos;re about to delete {admin ? "this" : "your"} account on
              outfits.bio, once you do {admin ? "they" : "you"} will no longer
              be able to login, and all of {admin ? "their" : "your"} data will
              be erased. Are you sure you would like to proceed?
            </p>
          )}

          <div className="flex w-full gap-2">
            <BaseModalClose>
              <Button variant="outline" className="text-nowrap" centerItems>
                No, Abort
              </Button>
            </BaseModalClose>
            <Button
              className="bg-red-500 border-none"
              centerItems
              onClick={() => {
                deleteFn();
                if (
                  typeof ref === "object" &&
                  ref !== null &&
                  "current" in ref &&
                  ref.current
                ) {
                  ref.current.click();
                }
              }}
            >
              Delete {post ? "Post" : "Account"}
            </Button>
          </div>
        </BaseModalContent>
      </BaseModal>
    );
  },
);

DeleteModal.displayName = "DeleteModal";
