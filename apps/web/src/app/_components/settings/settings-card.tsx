import { Button } from "../ui/Button"

export function SettingsCard() {
    return (
        <div className="flex flex-col items-start rounded-lg border bg-white">
            <div className="flex items-start flex gap-24 p-10 self-stretch">
                <div className="flex flex-col items-start gap-3 flex-1">
                    <h1 className="font-clash font-bold text-3xl">Content</h1>
                    <p>Descriptive summary of this content box. It can be long, it can be short. It can span and wrap across multiple lines.</p>
                </div>
            </div>
            <div className="flex items-center gap-24 p-4 self-stretch justify-end border-t bg-gray-100">
                <div className="flex items-center gap-3">
                    <Button variant="outline">button</Button>
                    <Button>button</Button>
                </div>
            </div>
        </div>
    )
}

