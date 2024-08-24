"use server";

import { PostType } from "@acme/db";
import { ServerPostSection } from "./server-post-section";

export async function Posts({ username }: { username: string }) {
    return (
        <div className='md:overflow-y-scroll w-full pl-4 md:pl-0 py-4'>
            <ServerPostSection username={username} type={PostType.OUTFIT} />
            <ServerPostSection username={username} type={PostType.HOODIE} />
            <ServerPostSection username={username} type={PostType.SHIRT} />
            <ServerPostSection username={username} type={PostType.PANTS} />
            <ServerPostSection username={username} type={PostType.SHOES} />
            <ServerPostSection username={username} type={PostType.WATCH} />
            <ServerPostSection username={username} type={PostType.JEWELRY} />
            <ServerPostSection username={username} type={PostType.HEADWEAR} />
            <ServerPostSection username={username} type={PostType.GLASSES} />
        </div>
    );
}