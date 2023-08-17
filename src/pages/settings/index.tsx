
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '~/components/Button';
import { Layout } from '~/components/Layout';

import { DoorOpen, SquaresFour, User } from '@phosphor-icons/react';

import type { NextPage } from "next";

const SettingsPage: NextPage = ({ }) => {
    const { pathname } = useRouter();

    return <Layout title="Settings" redirectIfNotAuth showActions showSlash>
        <div className="w-screen flex flex-col gap-2 p-4">
            <Link href='/settings/profile'>
                <Button variant='ghost' disabled={pathname === '/settings/profile'} className='justify-start' iconLeft={<User />}>Profile</Button>
            </Link>

            <Link href='/settings/connections'>
                <Button variant='ghost' disabled={pathname === '/settings/connections'} className='justify-start' iconLeft={<SquaresFour />}>Connections</Button>
            </Link>

            <Button variant="warning-ghost" className='justify-start' iconLeft={<DoorOpen />} onClick={() => signOut({ callbackUrl: '/' })}>Logout</Button>
        </div>
    </Layout>;
}

export default SettingsPage;