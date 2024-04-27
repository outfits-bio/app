import { Button } from "../../ui/Button"

export function GoogleCard() {
    return (
        <div className="flex flex-col items-start rounded-lg border bg-white">
            <div className="flex items-start flex gap-24 p-10 self-stretch">
                <div className="flex flex-col items-start gap-3 flex-1">
                    <h1 className="font-clash font-bold text-3xl">Google</h1>
                    <p>Sign in with google, a classic.</p>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 p-6 px-10 self-stretch justify-end border-t bg-gray-100">
                <div className="flex items-center gap-3">
                    <Button>Connect</Button>
                </div>
            </div>
        </div>
    )
}