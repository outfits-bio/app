"use client";

import Link from "next/link";
import { Avatar } from "../ui/Avatar";
import { api } from "@/trpc/react";

export function PopularProfiles({ popularProfiles }: { popularProfiles?: any }) {

    const { data: popularProfilesData } = api.user.getMostLikedProfiles.useQuery(undefined, {
        initialData: popularProfiles,
    })

    return (
        <div className="flex-col gap-3 pt-[1rem] h-fit">
            <h2 className="text-sm font-semibold text-secondary-text mb-3">
                Suggested for you
            </h2>
            <div className="flex flex-col gap-3">
                {popularProfilesData?.map((user) => (
                    <div key={user?.id ?? ''} className="flex items-center justify-between">
                        <Link href={`/${user?.username}`} className="flex items-center gap-3">
                            <Avatar
                                size={'sm'}
                                image={user?.image}
                                id={user?.id}
                                username={user?.username}
                            />
                            <div className="flex flex-col">
                                <span className="font-semibold text-sm text-black dark:text-white">{user?.username}</span>
                                <span className="text-xs text-secondary-text text-nowrap">
                                    {user?.imageCount} Shots · {user?.likeCount} Likes
                                </span>
                            </div>
                        </Link>
                        <Link
                            href={`/${user?.username}`}
                            className="text-sm font-semibold text-orange-accent text-center p-0 ml-5 cursor-pointer"
                        >
                            View
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}