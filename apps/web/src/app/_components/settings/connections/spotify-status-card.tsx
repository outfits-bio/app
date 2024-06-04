export function SpotifyStatusCard() {
    return (
        <div className="flex flex-col items-start rounded-lg border bg-white dark:bg-black">
            <div className="flex flex-wrap items-start flex gap-24 p-10 self-stretch">
                <div className="flex flex-col items-start gap-3 flex-1">
                    <h1 className="font-clash font-bold text-3xl">Show Spotify Status</h1>
                    <p>Very nice free addition to your profile, display your spotify status as long as you are only on Discord.</p>
                </div>
                <div className="flex w-[96px] h-[48px] p-2 items-center gap-3 rounded-full border">
                    <div className="w-[32px] h-[32px] flex-shrink-0 bg-black rounded-full" />
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 p-6 px-10 self-stretch justify-between border-t bg-gray-100">
                <p>Powered by Lanyard. Learn more</p>
            </div>
        </div>
    )
}