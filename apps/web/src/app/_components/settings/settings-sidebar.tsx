"use client";

import { Button } from "@/app/_components/ui/Button";
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export function SettingsSidebar() {
    return (
        <section className="w-80 bg-white dark:bg-black border-r border-stroke hidden md:flex flex-col justify-between px-4">
            <div className="flex flex-col gap-2 divide-y divide-stroke sticky top-0 pt-4">
                <div className='gap-2 flex flex-col'>
                    <Link href='/settings/profile'>
                        <Button variant='ghost' className='justify-start transition duration-300 ease-in-out'>Profile</Button>
                    </Link>

                    <Link href='/settings/connections'>
                        <Button variant='ghost' className='justify-start transition duration-300 ease-in-out'>Connections</Button>
                    </Link>

                    <Link href='/settings/appearance'>
                        <Button variant='ghost' className='justify-start transition duration-300 ease-in-out'>Appearance</Button>
                    </Link>
                </div>

                <div className='flex flex-col gap-2 pt-2'>
                    <Button variant={'ghost'} className='justify-start transition duration-300 ease-in-out' onClick={() => signOut({ callbackUrl: '/' })}>Logout</Button>
                </div>
            </div>
        </section>
    );
}