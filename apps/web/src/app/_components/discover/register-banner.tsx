import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "../ui/Button";

export function RegisterBanner() {
    const { data: session } = useSession();

    if (!session) {
        return (
            <div className="bg-white dark:bg-black flex flex-wrap w-full h-fit justify-between items-center p-5 px-4 border-t rounded-t-lg gap-3 sm:flex fixed bottom-0 left-0 right-0">
                <div className="flex flex-col items-start gap-3">
                    <h1 className="font-clash text-2xl font-bold">Create your profile and start posting!</h1>
                    <p>Creating a profile is super easy and removes all limitations you might experience on this page right now.</p>
                </div>
                <div className="flex gap-3">
                    <Link href='/login'>
                        <Button variant='outline'>Login</Button>
                    </Link>
                    <Link href='/login'>
                        <Button variant='primary'>Create your profile</Button>
                    </Link>
                </div>
            </div>
        )
    }
}
