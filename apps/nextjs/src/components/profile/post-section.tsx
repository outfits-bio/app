"use client";

import { formatImage } from '@acme/utils/image-src-format.util';
import { getPostTypeName } from '@acme/utils/names.util';
import Image from 'next/image';
import Link from 'next/link';
import { type PostSectionProps, getPostTypeCount, getPostTypeIcon } from './post-utils';
import { useSession } from 'next-auth/react';

export const PostSection = ({ profileData, postsData, type }: PostSectionProps) => {
    const { data: session } = useSession();

    const posts = postsData?.filter((p) => p.type === type);
    const userIsProfileOwner = session?.user.id === profileData?.id;
    const postsExist = posts?.length !== 0;

    if (!postsExist) return null;

    return (
        <div className="w-full pr-2" key={type}>
            <h2 className="pr-2 text-2xl md:text-4xl mb-5 flex items-center gap-3 font-clash">
                {getPostTypeIcon(type)}
                <span><span className='font-semibold'>{getPostTypeCount(type, profileData)}</span> {getPostTypeName(type)}</span>
            </h2>

            <div className='w-full overflow-scroll mb-5'>
                <div className="flex gap-3 flex-wrap pb-1 w-full">
                    {posts?.map((post, i) => (
                        <Link
                            href={`/${profileData?.username}?postId=${post.id}`}
                            key={post.id?.toString() ?? `loading_${i}`}
                            className="w-[calc(50%-6px)] md:w-[151px] aspect-[151/247] border border-border rounded-lg relative overflow-hidden dark:border-stroke"
                        >
                            <Image
                                sizes="126px"
                                src={formatImage(post.image, profileData?.id)}
                                className="object-cover"
                                fill
                                alt={post.type}
                                priority={post.type === 'OUTFIT' || post.type === 'HOODIE'}
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}