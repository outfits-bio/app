import { Button } from "../../ui/Button"

export function DeleteAccountCard() {
    return (
        <div className="flex flex-col items-start rounded-lg border bg-white">
            <div className="flex items-start flex gap-24 p-10 self-stretch">
                <div className="flex flex-col items-start gap-3 flex-1">
                    <h1 className="font-clash font-bold text-3xl">Delete account</h1>
                    <p>If you don't want to have an account on outfits.bio anymore, then you can request an account deletion.</p>
                </div>
            </div>
            <div className="flex items-center gap-24 p-4 px-10 self-stretch justify-between border-t bg-red-100">
                <p>This action is irreversible, and cannot be undone after.</p>
                <div className="flex items-center gap-3">
                    <Button className="bg-red-500 border-none">Delete Account</Button>
                </div>
            </div>
        </div>
    )
}

