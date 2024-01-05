"use client";

import type { AppRouter } from "@/server/api/root";
import { formatImage } from "@/utils/image-src-format.util";
import { getPostTypeName } from "@/utils/names.util";
import type { inferRouterOutputs } from "@trpc/server";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { PiDotsThreeBold, PiHammer, PiSealCheck, PiShareFatBold } from "react-icons/pi";
import { PostMenu } from "../../menus/post-menu";
import { Avatar } from "../../ui/Avatar";
import { Button } from "../../ui/Button";
import { LikeButton } from "./like-button";
import ReactButton from "./react-button";
import WishlistButton from "./wishlist-button";
import { ReportModal } from "../../modals/report-post-modal";

export interface PostProps {
    post: inferRouterOutputs<AppRouter>['post']['getLatestPosts']['posts'][number];
}

export function Post({ post }: PostProps) {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const { data: session } = useSession();

    const user = session?.user;

    const handleSetParams = () => {
        const currentParams = new URLSearchParams(Array.from(params.entries()));

        currentParams.set('postId', post.id);

        router.push(`${pathname}?${currentParams.toString()}`);
    }

    const handleShare = (postId: string) => {
        const origin = window.location.origin;

        const url = `${origin}${pathname}?postId=${postId}`;

        void navigator.clipboard.writeText(url);

        toast.success('Copied post link to clipboard!');
    }

    const truncatedTagline = post.user.tagline && (post.user.tagline.length > 20 ? `${post.user.tagline.slice(0, 20)}...` : post.user.tagline);

    return <div className="snap-start border-2 border-stroke rounded-lg 2xs-h:w-[250px] xs-h:w-[300px] sm-h:w-[320px] w-[350px] max-h-full py-4 flex flex-col items-center gap-2 md:gap-4 md:mt-3">
        <Link href={`/${post.user.username}`} className="flex gap-2 items-center w-full px-4 font-clash">
            <Avatar
                image={post.user.image}
                id={post.user.id}
                username={post.user.username}
                size={'sm'}
            />

            <div className="flex flex-col justify-center">
                <p className="font-medium flex items-center gap-1">{post.user.username} {post.user.admin ? <PiHammer className='w-4 h-4' /> : post.user.verified && <PiSealCheck className='w-4 h-4' />}</p>
                <p className="text-sm font-medium text-secondary-text 2xs-h:hidden inline">{truncatedTagline && `${truncatedTagline} - `}{getPostTypeName(post.type).toLowerCase()}</p>
                <p className="text-sm font-medium text-secondary-text 2xs-h:inline hidden">{getPostTypeName(post.type).toLowerCase()}</p>
            </div>
        </Link>

        <div onClick={handleSetParams} className="relative cursor-pointer w-[305px] 3xs-h:w-[199px] 3xs-h:h-[325px] 2xs-h:w-[214px] 2xs-h:h-[350px] xs-h:w-[244px] xs-h:h-[400px] sm-h:w-[275px] sm-h:h-[450px] h-[500px] md:w-[320px] md:h-[524px] rounded-md overflow-hidden border border-stroke">
            <Image
                src={formatImage(post.image, post.user.id)}
                className="object-cover"
                fill
                alt={post.type}
                priority
            />
        </div>

        <p className="text-sm font-clash text-secondary-text font-medium self-start pl-4 flex gap-1">
            {post._count.likes > 0 && <span className="flex gap-1"><span className="font-bold">{post._count.likes}</span> {post._count.likes === 1 ? ' like' : ' likes'}
                {post._count.reactions || post._count.wishlists ? ', ' : ''}
            </span>}
            {post._count.reactions > 0 && <span className="flex gap-1"><span className="font-bold">{post._count.reactions}</span> {post._count.reactions === 1 ? ' reaction' : ' reactions'}
                {post._count.wishlists ? ', ' : ''}
            </span>}
            {post._count.wishlists > 0 && <span className="flex gap-1"><span className="font-bold">{post._count.wishlists}</span> {post._count.wishlists === 1 ? ' wishlist' : ' wishlists'}</span>}
        </p>

        <div className="flex px-4 justify-between items-center w-full">
            <div className="flex gap-2">
                <LikeButton post={post} />

                <ReactButton post={post} />

                <WishlistButton post={post} />

                <Button variant="outline-ghost" centerItems shape={'circle'} iconLeft={<PiShareFatBold />} onClick={() => handleShare(post.id)} />
            </div>


            <div className="block sm-h:hidden">
                {user && <PostMenu
                    userIsProfileOwner={user.id === post?.user.id}
                    button={<Button variant="ghost" centerItems shape={'circle'} iconLeft={<PiDotsThreeBold />} />}
                    postId={post.id}
                />}
            </div>
        </div>
    </div>
}