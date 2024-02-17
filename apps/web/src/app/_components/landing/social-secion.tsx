"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Marquee from 'react-fast-marquee';
import { PiDotsThreeBold, PiHeartBold, PiHeartFill } from "react-icons/pi";
import { Button } from "../ui/Button";

export function SocialSection() {
    const [likeAnimation, setLikeAnimation] = useState(false);
    const [hasLiked, setHasLiked] = useState(false);


    return <div className='border border-stroke rounded-xl w-full py-12 flex flex-col px-4 md:px-12 gap-12 md:flex-row md:justify-between xl:w-3/4'>
        <div className='sm:w-96 md:w-[500px]'>
            <h2 className='font-bold text-3xl md:text-4xl font-clash mb-4'>Socialize through fashion</h2>
            <p className='mb-4'>Besides sharing your wardrobe you can also follow other people or like individual items to get recommended similar people or clothes you like.  </p>
            <div className='flex'>
                <Link href={'/login'}>
                    <Button variant={'outline-ghost'}>Create your profile</Button>
                </Link>
            </div>
        </div>

        <div className='flex flex-col items-end gap-2 md:w-[500px]'>
            <div className='rounded-full h-24 w-24 bg-hover border border-stroke relative overflow-hidden'>
                {/* checkered pattern */}
                <Image src={'https://pub-4bf8804d3efc464b862de36f974618d4.r2.dev/cloqayyqq0000l60fiyj33iqv/cloqayyqq0000l60fiyj33iqv-1699480994183.png'} alt='' width={512} height={512} />
            </div>

            <h3 className='font-clash text-2xl font-bold'>TheFitChecker</h3>

            <span className='inline text-sm'>
                <PiHeartBold className='text-lg mb-1 inline mr-1' />
                <span className='inline font-bold'>{hasLiked ? '10 ' : '9 '}</span>
                <span className='inline'>Likes</span>
            </span>

            <div className='w-5/6 flex gap-2'>
                <div className='relative w-6 h-6 shrink-0'>
                    <Image src={'https://upload.wikimedia.org/wikipedia/en/7/70/Graduation_%28album%29.jpg'} alt={''} fill className='rounded-xl' />
                </div>
                <Marquee pauseOnHover autoFill speed={40} className='cursor-pointer select-none'>
                    <p className='text-sm mx-4'>Listening to <span className='font-bold'>Can&apos;t Tell Me Nothing</span> by <span className='font-bold'>Kanye West</span></p>
                </Marquee>
            </div>

            <div className='flex gap-2 w-5/6 mt-2'>
                <div className='grow'>
                    <Button
                        accent
                        centerItems
                        onClick={() => {
                            setLikeAnimation(true);
                            setHasLiked(!hasLiked);
                        }}
                        iconLeft={

                            hasLiked ? (
                                <PiHeartFill
                                    onAnimationEnd={() => setLikeAnimation(false)}
                                    className={likeAnimation ? 'animate-ping text-white dark:text-black' : ''}
                                />
                            ) : (
                                <PiHeartBold
                                    onAnimationEnd={() => setLikeAnimation(false)}
                                    className={likeAnimation ? 'animate-ping text-white dark:text-black' : ''}
                                />
                            )}
                    >
                        Like{hasLiked ? 'd' : ''}
                    </Button>
                </div>
                <div>
                    <Button variant={'outline'} iconLeft={<PiDotsThreeBold />} shape={'square'} />
                </div>
            </div>
        </div>
    </div>;
}