import { Button } from "../../ui/Button"

export function AvatarCard() {
    return (
        <div className="flex flex-col items-start rounded-lg border bg-white">
            <div className="flex items-start flex gap-24 p-10 self-stretch">
                <div className="flex flex-col items-start gap-3 flex-1">
                    <h1 className="font-clash font-bold text-3xl">Avatar</h1>
                    <p>Take your best shot because your avatar is how you will appear on most of the website.</p>
                </div>
                <div className="flex w-[88px] h-[88px] justify-center items-center bg-gray-200 border rounded-full" />
            </div>
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