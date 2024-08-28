"use client";

import { api } from "@/trpc/react";
import { BaseModal, BaseModalContent, BaseModalDescription, BaseModalTitle, BaseModalTrigger } from "./base-modal";
import Link from "next/link";
import { Avatar } from "../ui/Avatar";
import { PiHammer, PiSealCheck } from "react-icons/pi";
import type { ReactNode } from "react";

interface PostInfoModalProps {
    postId: string;
    children: ReactNode;
}

export const PostInfoModal = ({ postId, children }: PostInfoModalProps) => {
    const { data: postData } = api.post.getPost.useQuery({ id: postId });

    return (
        <BaseModal>
            <BaseModalTrigger>
                {children}
            </BaseModalTrigger>
            <BaseModalContent>
                <BaseModalTitle>Liked by</BaseModalTitle>
                <BaseModalDescription>
                    See who likes this post.
                </BaseModalDescription>

                <div className="flex flex-col gap-3 overflow-scroll max-h-[400px] mt-3">
                    {postData?.likes.map((profile) => (
                        <Link href={`/${profile.username}`} key={profile.id} className='flex items-center rounded-md p-2 hover:bg-hover w-full text-left border border-stroke outline-none'>
                            <Avatar image={profile.image} id={profile.id} username={profile.username} size={'xs'} className='mr-2' />
                            <p>{profile.username}</p>
                            {profile.admin ? <PiHammer className='ml-1 text-primary' /> : profile.verified ? <PiSealCheck className='ml-1 text-primary' /> : null}
                        </Link>
                    ))}
                </div>

                {postData?.likes.length === 0 && (
                    <p className="mt-4 text-center text-gray-500">No profiles yet</p>
                )}
            </BaseModalContent>
        </BaseModal>
    );
}