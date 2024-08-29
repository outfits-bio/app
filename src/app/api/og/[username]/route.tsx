import { ImageResponse } from 'next/og';
import { formatAvatar, formatImage } from '@/utils/image-src-format.util';
import { type Key } from 'react';

export const runtime = 'edge';

const getClashDisplay = async () => {
    const response = await fetch(
        new URL('../../../../../public/fonts/ClashDisplay-OG.ttf', import.meta.url)
    );
    const ClashDisplay = await response.arrayBuffer();

    return ClashDisplay;
}

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
                        paddingTop: '25px',
                        paddingLeft: '25px',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        backgroundColor: 'white',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <img
                            width="300"
                            height="300"
                            src={formatAvatar(profileData.image, profileData.id)}
                            style={{
                                borderRadius: "100%",
                                border: '2px solid #eeeeee',
                            }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', margin: '0px' }}>
                            <p style={{ fontFamily: 'Clash', fontSize: '36px' }}>{profileData.username}</p>
                            {/* <p style={{ fontFamily: 'sans-serif' }}>{profileData.tagline}</p> */}
                        </div>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'flex-end',
                            maxWidth: '800px',
                            paddingRight: '25px',
                            gap: '10px',
                            overflow: 'hidden',
                        }}
                    >
                        {posts.slice(0, 8).map((post: { image: string | undefined; }, index: Key | null | undefined) => (
                            <img
                                key={index}
                                width="149"
                                height="245"
                                src={formatImage(post.image, profileData.id)}
                                style={{
                                    objectFit: 'cover',
                                    borderRadius: '10px',
                                    border: '1px solid #eeeeee',
                                }}
                            />
                        ))}
                    </div>
                </div>
            ),
            {
                fonts: [
                    {
                        name: 'Clash',
                        data: await getClashDisplay(),
                        weight: 600,
                    },
                ],
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