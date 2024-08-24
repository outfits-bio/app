"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import toast from "react-hot-toast";

export function PwaBanner() {
    const [isIOS, setIsIOS] = useState(true);
    const [isStandalone, setIsStandalone] = useState(false);

    // useEffect(() => {
    //     const ua = window.navigator.userAgent;
    //     const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    //     setIsIOS(iOS);
    //     setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
    // }, []);

    function openNavigator() {
        if (navigator.share) {
            navigator.share({
                url: window.location.href,
            })
                .catch((error) => {
                    console.error('Error sharing:', error);
                });
        } else {
            void navigator.clipboard.writeText(window.location.href)
            toast.error('This browser does not support PWA installation!')
        }
    }

    if (isIOS && !isStandalone) {
        return (
            <section className="z-50 gap-5 flex-col h-screen w-screen bg-white dark:bg-black text-black dark:text-white flex justify-center items-center px-6 text-center">

                <div className="flex flex-col gap-1">
                    <p className="text-2xl font-semibold font-clash">Install the website as an app!</p>
                    <p>Installing the website as an app will make it behave like any app you're used to.</p>
                </div>

                <div className="flex flex-col gap-1">
                    <p>1. Tap the Install button</p>
                    <p>2. Tap "Add to Home Screen"</p>
                    <p>3. Tap "Add"</p>
                </div>

                <Button className="bg-[#007AFF] border-none font-system align-end" onClick={openNavigator}>Install</Button>

            </section>
        )
    } else {
        return null;
    }
}
