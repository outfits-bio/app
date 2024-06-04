"use client";

import { useTheme } from 'next-themes'

export function AccentCard() {
    const { theme, setTheme } = useTheme()

    return (
        <div className="flex flex-col items-start rounded-lg border border-stroke bg-white dark:bg-black dark:hidden">
            <div className="flex flex-col items-start flex gap-5 p-10 self-stretch">
                <div className="flex flex-col items-start gap-3 flex-1">
                    <h1 className="font-clash font-bold text-3xl">Accent colors</h1>
                    <p>Give your experience a personalized touch of your own.</p>
                </div>

                <div className="flex gap-2 max-w-full overflow-auto">
                    <div className={`flex items-start gap-10 p-3 rounded-full ${theme === 'light' ? 'border' : ''}`} onClick={() => setTheme('light')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
                            <circle cx="28" cy="28" r="28" fill="#171717" />
                        </svg>
                    </div>
                    <div className={`flex items-start gap-10 p-3 rounded-full ${theme === 'light-orange' ? 'border' : ''}`} onClick={() => setTheme('light-orange')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
                            <circle cx="28" cy="28" r="28" fill="#FF6200" />
                        </svg>
                    </div>
                    <div className={`flex items-start gap-10 p-3 rounded-full ${theme === 'light-brown' ? 'border' : ''}`} onClick={() => setTheme('light-brown')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
                            <circle cx="28" cy="28" r="28" fill="#785944" />
                        </svg>
                    </div>
                    <div className={`flex items-start gap-10 p-3 rounded-full ${theme === 'light-hot-pink' ? 'border' : ''}`} onClick={() => setTheme('light-hot-pink')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
                            <circle cx="28" cy="28" r="28" fill="#FF264D" />
                        </svg>
                    </div>
                    <div className={`flex items-start gap-10 p-3 rounded-full ${theme === 'light-pink' ? 'border' : ''}`} onClick={() => setTheme('light-pink')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
                            <circle cx="28" cy="28" r="28" fill="#FFB4C1" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}