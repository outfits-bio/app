import { api } from "@/trpc/server";
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { username: string } }) {
    try {
        const profileData = await api.user.getProfile({ username: params.username });
        const posts = await api.post.getPostsAllTypes({ id: profileData.id });

        return NextResponse.json({ profileData, posts });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch profile data' }, { status: 500 });
    }
}