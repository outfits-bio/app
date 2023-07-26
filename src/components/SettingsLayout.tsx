import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { DoorOpen, SquaresFour, User } from '@phosphor-icons/react';

import { Button } from './Button';
import { Layout } from './Layout';

interface SettingsLayoutProps {
    children: React.ReactNode
}

export const SettingsLayout = ({ children }: SettingsLayoutProps) => {
    const { pathname } = useRouter();

    return <Layout title="Settings" redirectIfNotAuth showActions showSlash>
        <div className='flex w-screen h-full'>
            <div className='hidden md:flex flex-col h-full w-96 border-r border-black dark:border-white p-4'>
                <Link href='/settings/profile'>
                    <Button color='ghost' disabled={pathname === '/settings/profile'} itemsLeft iconLeft={<User />}>Profile</Button>
                </Link>

                <Link href='/settings/connections'>
                    <Button color='ghost' disabled={pathname === '/settings/connections'} itemsLeft iconLeft={<SquaresFour />}>Connections</Button>
                </Link>

                <Button color="warning-ghost" itemsLeft iconLeft={<DoorOpen />} onClick={() => signOut({ callbackUrl: '/' })}>Logout</Button>
            </div>
            {children}
        </div>
    </Layout>
}