export function HidePresenceCard() {
    return (
        <div className="flex flex-col items-start rounded-lg border border-stroke bg-white dark:bg-black">
            <div className="flex flex-wrap items-start flex gap-24 p-10 self-stretch">
                <div className="flex flex-col items-start gap-3 flex-1">
                    <h1 className="font-clash font-bold text-3xl">Hide all presences</h1>
                    <p>This hides all Spotify statuses on peoples profiles including your own even if you have it enabled.</p>
                </div>
                <div className="flex w-[96px] h-[48px] p-2 items-center gap-3 rounded-full border dark:border-stroke">
                    <div className="w-[32px] h-[32px] flex-shrink-0 bg-black rounded-full dark:bg-white" />
                </div>
            </div>
        </div>
    )
}