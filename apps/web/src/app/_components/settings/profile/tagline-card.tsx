import { Button } from "../../ui/Button"

export function TaglineCard() {
    return (
        <div className="flex flex-col items-start rounded-lg border bg-white">
            <div className="flex flex-col items-start flex gap-5 p-10 self-stretch">
                <div className="flex flex-col items-start gap-3 flex-1">
                    <h1 className="font-clash font-bold text-3xl">Tagline</h1>
                    <p>Your tagline is essentially a small biograph about you, what you like or what you do.</p>
                </div>
                <div className="flex justify-between items-center self-stretch border rounded-lg">
                    <div className="flex items-center gap-4 p-3 py-5 flex-1 self-stretch">I enjoy linking my outfits.</div>
                </div>
            </div>
            <div className="flex items-center gap-24 p-4 px-10 self-stretch justify-between border-t bg-gray-100">
                <p>You can only have up to 200 characters.</p>
                <div className="flex items-center gap-3">
                    <Button>Save Changes</Button>
                </div>
            </div>
        </div>
    )
}