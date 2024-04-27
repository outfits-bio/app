import { Button } from "../../ui/Button"
import { Avatar } from "../../ui/Avatar"
import { useSession } from "next-auth/react";

export function AvatarCard() {
    const { data: session } = useSession();

    return (
        <div className="flex flex-col items-start rounded-lg border bg-white">
            <div className="flex items-start flex gap-24 p-10 self-stretch">
                <div className="flex flex-col items-start gap-3 flex-1">
                    <h1 className="font-clash font-bold text-3xl">Avatar</h1>
                    <p>Take your best shot because your avatar is how you will appear on most of the website.</p>
                </div>
                {session ? (
                    <Avatar
                        image={session.user.image}
                        id={session.user.id}
                        username={session.user.username}
                        size={'lg'} />
                ) : (
                    <Avatar size={'lg'} />
                )
                }            </div>
            <div className="flex flex-wrap items-center gap-3 p-4 px-10 self-stretch justify-between border-t bg-gray-100">
                <p>Click to upload or simply drag and drop your image.</p>
                <div className="flex items-center gap-3">
                    <Button variant="ghost">Remove</Button>
                    <Button>Upload</Button>
                </div>
            </div>
        </div>
    )
}