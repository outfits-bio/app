import { Button } from "../../ui/Button"

export function DiscordCard() {
    return (
        <div className="flex flex-col items-start rounded-lg border bg-white">
            <div className="flex items-start flex gap-24 p-10 self-stretch">
                <div className="flex flex-col items-start gap-3 flex-1">
                    <h1 className="font-clash font-bold text-3xl">Discord</h1>
                    <p>Connect discord, required for spotify.</p>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 p-4 px-10 self-stretch justify-between border-t bg-gray-100">
                <p>Connecting discord is required if you want to display your spotify status </p>
                <div className="flex items-center gap-3">
                    <Button>Connect</Button>
                </div>
            </div>
        </div>
    )
}