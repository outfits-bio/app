import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Button } from '../_components/ui/Button';

export default async function SettingsPage() {
    const session = await getServerAuthSession();

    if (!session?.user) {
        redirect('/login');
    }

    return <>
        <div className="w-screen flex flex-col gap-2 p-4 divide-y divide-stroke">
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
    </>;
}