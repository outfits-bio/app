"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "../ui/Logo";
import { showSlash } from "@/utils/nav-options.util";

export function NavLogo() {
    const { data: session } = useSession();
    const pathname = usePathname()

    const title = pathname.split('/')[pathname.split('/').length - 1] ?? 'outfits.bio';
    const slash = showSlash(pathname);

    if (slash) {
        return <Link href={session ? '/discover' : '/'} className='flex items-center gap-2 hover:scale-[101%] active:scale-[99%]'>
            <Logo size={'lg'} />
            <h1 className='text-2xl font-black font-clash flex gap-4 items-center'>{title.toLowerCase()}</h1>
        </Link>
    }

    return <Link href={session ? '/discover' : '/'} className='flex items-center gap-2 hover:scale-[101%] active:scale-[99%]'>
        <Logo size={'lg'} />
        <h1 className='text-2xl font-black font-clash'>outfits.bio</h1>
    </Link>
}