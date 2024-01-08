"use client";

import { useSearchParams } from "next/navigation";

export function ProfileNotFoundUsername() {
    const params = useSearchParams();

    return <h1 className='text-center text-5xl font-black font-clash'>{params.get('username')}</h1>
}