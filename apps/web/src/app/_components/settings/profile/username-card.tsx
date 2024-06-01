"use client";
import { Button } from "../../ui/Button"
import { useSession } from "next-auth/react";

export function UsernameCard() {
    const { data: session } = useSession();

    return (
        <div className="flex flex-col items-start rounded-lg border bg-white">
            <div className="flex flex-col items-start flex gap-5 p-10 self-stretch">
                <div className="flex flex-col items-start gap-3 flex-1">
                    <h1 className="font-clash font-bold text-3xl">Username</h1>
                    <p>This is how you will appear everywhere on the platform. Put whatever you are comfortable with.</p>
                </div>
                <div className="flex justify-between items-center self-stretch border rounded-lg">
                    <div className="flex p-3 items-center gap-10 self-stretch bg-gray-100">outfits.bio/</div>
                    <input className="flex items-center gap-4 p-3 py-4 flex-1 self-stretch" placeholder={session?.user?.username ?? "username"} />
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 p-4 px-10 self-stretch justify-between border-t bg-gray-100">
                <p>You can only change your username every 30 days, and can only have up to 24 characters.</p>
                <div className="flex items-center gap-3">
                    <Button>Save</Button>
                </div>
            </div>
        </div>
    )
}