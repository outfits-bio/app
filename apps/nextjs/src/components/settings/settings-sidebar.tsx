import { Button } from "~/components/ui/Button";
import Link from 'next/link';
import LogoutButton from "./signout-button";

export function SettingsSidebar() {
    return (
        <section className="w-80 bg-white dark:bg-black border-r border-stroke hidden md:flex flex-col justify-between px-4 min-h-screen">
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
                    <LogoutButton />
                </div>
            </div>
        </section>
    );
}