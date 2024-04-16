export function AccentCard() {
    return (
        <div className="flex flex-col items-start rounded-lg border bg-white">
            <div className="flex flex-col items-start flex gap-5 p-10 self-stretch">
                <div className="flex flex-col items-start gap-3 flex-1">
                    <h1 className="font-clash font-bold text-3xl">Accent colors</h1>
                    <p>Give your experience a personalized touch of your own.</p>
                </div>

                <div className="flex gap-2">
                    <div className="flex items-start gap-10 p-3 rounded-full border">
                        <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
                            <circle cx="28" cy="28" r="28" fill="#171717" />
                        </svg>
                    </div>
                    <div className="flex items-start gap-10 p-3 rounded-full active:border">
                        <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
                            <circle cx="28" cy="28" r="28" fill="#FF6200" />
                        </svg>
                    </div>
                    <div className="flex items-start gap-10 p-3 rounded-full active:border">
                        <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
                            <circle cx="28" cy="28" r="28" fill="#FF264D" />
                        </svg>
                    </div>
                    <div className="flex items-start gap-10 p-3 rounded-full active:border">
                        <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
                            <circle cx="28" cy="28" r="28" fill="#FFB4C1" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

