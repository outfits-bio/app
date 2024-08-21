import { ImageResponse } from 'next/og';
import { formatAvatar, formatImage } from '@acme/utils/image-src-format.util';
import { Key } from 'react';

export const runtime = 'edge';

export async function GET(request: Request, { params }: { params: { username: string } }) {
    try {
        const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://outfits.bio';
        const res = await fetch(`${baseUrl}/api/profile/${params.username}`);
        const { profileData, posts } = await res.json();

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#ff6200',
                    }}
                >
                    <img
                        width="200"
                        height="200"
                        src={formatAvatar(profileData.image, profileData.id)}
                        style={{
                            borderRadius: 100,
                            border: '1px solid #eeeeee',
                            boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.15)',
                        }}
                    />
                </div>
            ),
            {
                width: 1200,
                height: 630,
            },
        );
    } catch (e) {
        console.log(`${e}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}