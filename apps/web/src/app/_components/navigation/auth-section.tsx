"use client";

import { useSession } from "next-auth/react";
import { Button } from "../ui/Button";
import { PiBellSimple, PiBellSimpleFill, PiCompass, PiDiscordLogo, PiPlus } from "react-icons/pi";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { api } from "@/trpc/react";

export function AuthSection() {
    const { data: session } = useSession();
    const pathname = usePathname();

    const iconComponent = pathname === "/notifications" ? <PiBellSimpleFill /> : <PiBellSimple />;

    if (session && session.user) {
        const { data: notificationsCount } = api.notifications.getUnreadNotificationsCount.useQuery(undefined, { enabled: !!session });
        const hasNotifications = notificationsCount && notificationsCount > 0;

        return <>
            <div className="hidden md:flex items-center justify-center gap-4">
                <div>
                    <Button variant={'outline-ghost'} iconLeft={<PiPlus />}>Create</Button>
                </div>

                {pathname === '/discover' && <Link href='/discover'>
                    <Button variant={'outline-ghost'} shape={'square'} iconLeft={<PiCompass />} />
                </Link>}
            </div>

            <Link href='/notifications' className='md:hidden relative'>
                <Button variant='outline-ghost' shape={'circle'} iconLeft={iconComponent} />
                {hasNotifications ? <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-error text-white text-[9px] font-bold flex items-center justify-center">
                    {notificationsCount}
                </div> : null}
            </Link>
        </>;
    }

    return <div className='items-center gap-4 hidden md:flex'>
        {pathname !== '/discover' && <Link href='/discover'>
            <Button variant='outline-ghost'>Discover</Button>
        </Link>}

        <Link href='https://discord.gg/f4KEs5TVz2'>
            <Button variant='outline-ghost' iconLeft={<PiDiscordLogo />}></Button>
        </Link>

        <Link href='/login'>
            <Button variant='outline'>Login</Button>
        </Link>
        <Link href='/login'>
            <Button variant='primary'>Create your profile</Button>
        </Link>
    </div>;
}