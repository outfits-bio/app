"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import toast from "react-hot-toast";
import Image from "next/image";

export function PwaBanner() {
    const [isIOS, setIsIOS] = useState(true);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        const ua = window.navigator.userAgent;
        const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
        setIsIOS(iOS);
        setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
    }, []);

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
            <section className="z-50 justify-between flex-col h-screen w-screen bg-white dark:bg-black text-black dark:text-white flex py-10 items-center px-6 text-center">

                <div className="flex flex-col gap-1 items-center">
                    <Image src="/apple-touch-icon.png" alt="Outfits.bio logo" width={100} height={100} loading="eager" priority />
                    <p className="text-2xl font-semibold font-clash">Outfits.bio is better as an app!</p>
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
