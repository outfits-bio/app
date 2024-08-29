"use client";

import { api } from "@/trpc/react";
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
import type { ReactNode } from "react";

interface FollowersModalProps {
  profileId: string;
  children: ReactNode;
}

export const FollowersModal = ({
  profileId,
  ...props
}: FollowersModalProps) => {
  const { data: profileData } = api.user.getFollowersById.useQuery({
    id: profileId,
  });

  return (
    <BaseModal className="min-w-[400px]">
      <BaseModalTrigger>{props.children}</BaseModalTrigger>
      <BaseModalContent>
        <BaseModalTitle>
          {profileData?.username}&apos;s Followers
        </BaseModalTitle>
        <BaseModalDescription>
          See who follows {profileData?.username}.
        </BaseModalDescription>

        <div className="flex flex-col gap-3 overflow-scroll max-h-[400px] mt-3">
          {profileData?.likedBy.map((follower) => (
            <Link
              href={`/${follower.username}`}
              key={follower.id}
              className="flex items-center rounded-md p-2 hover:bg-hover w-full text-left border border-stroke outline-none"
            >
              <Avatar
                image={follower.image}
                id={follower.id}
                username={follower.username}
                size={"xs"}
                className="mr-2"
              />
              <p>{follower.username}</p>
              {follower.admin ? (
                <PiHammer className="ml-1 text-primary" />
              ) : follower.verified ? (
                <PiSealCheck className="ml-1 text-primary" />
              ) : null}
            </Link>
          ))}
        </div>

        {profileData?.likedBy.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No followers yet</p>
        )}
      </BaseModalContent>
    </BaseModal>
  );
};
