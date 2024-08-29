/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  BaseModal,
  BaseModalContent,
  BaseModalDescription,
  BaseModalTitle,
  BaseModalTrigger,
} from "./base-modal";
import Link from "next/link";
import { Avatar } from "../ui/Avatar";
import { PiHammer, PiSealCheck } from "react-icons/pi";

interface TaggedProfilesModalProps {
  taggedUsers: any;
  children: React.ReactNode;
}

export function TaggedProfilesModal({ taggedUsers, children }: TaggedProfilesModalProps) {
  return (
    <BaseModal>
      <BaseModalTrigger>{children}</BaseModalTrigger>
      <BaseModalContent>
        <BaseModalTitle>Tagged users</BaseModalTitle>
        <BaseModalDescription>
          People that might be seen in this post.
        </BaseModalDescription>
        <div className="flex flex-col gap-3 overflow-scroll max-h-[400px] mt-3">
          {taggedUsers.map((tag: any) => (
            <Link
              href={`/${tag}`}
              key={tag.id}
              className="flex items-center rounded-md p-2 hover:bg-hover w-full text-left border border-stroke outline-none"
            >
              <Avatar
                image={tag.image}
                id={tag.id}
                username={tag.username}
                size={"xs"}
                className="mr-2"
              />
              <p>{tag}</p>
              {tag.admin ? (
                <PiHammer className="ml-1 text-primary" />
              ) : tag.verified ? (
                <PiSealCheck className="ml-1 text-primary" />
              ) : null}
            </Link>
          ))}
        </div>
      </BaseModalContent>
    </BaseModal>
  );
}
