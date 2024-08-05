import { auth } from "@acme/auth";
import { redirect } from "next/navigation";
import Link from 'next/link';
import { Button } from '~/components/ui/Button';
import LogoutButton from '~/components/settings/signout-button';

export default async function SettingsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    return (
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
                <LogoutButton />
            </div>
        </div>
    );
}