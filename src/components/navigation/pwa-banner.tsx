"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { PiCaretDownBold } from "react-icons/pi";
import { Share } from "lucide-react";

export function PwaBanner() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = window.navigator.userAgent;
      const iOS = /iPad|iPhone/i.test(ua);
      setIsIOS(iOS);
      setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

      const bannerHidden = localStorage.getItem("pwaBannerHidden");
      const lastShownTime = localStorage.getItem("pwaBannerLastShown");

      if (bannerHidden !== "true") {
        if (
          !lastShownTime ||
          Date.now() - parseInt(lastShownTime) > 72 * 60 * 60 * 1000
        ) {
          setShowBanner(true);
          localStorage.setItem("pwaBannerLastShown", Date.now().toString());
        }
      }
    }
  }, []);

  const handleRemindLater = () => {
    setShowBanner(false);
    localStorage.setItem("pwaBannerLastShown", Date.now().toString());
  };

  const handleDontShowAgain = () => {
    setShowBanner(false);
    localStorage.setItem("pwaBannerHidden", "true");
  };

  if (isIOS && !isStandalone && showBanner) {
    return (
      <section className="z-50 justify-between flex-col h-screen w-screen bg-white dark:bg-black text-black dark:text-white flex py-10 items-center px-6 text-center overflow-hidden">
        <div className="flex flex-col gap-1 items-center">
          <Image
            src="/apple-touch-icon.png"
            alt="Outfits.bio logo"
            width={100}
            height={100}
            loading="eager"
            priority
          />
          <p className="text-2xl font-semibold font-clash">
            Outfits.bio is better as an app!
          </p>
          <p>
            Installing the website as an app will make it behave like any app
            you're used to.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="flex gap-1 items-center">
            1. Tap the{" "}
            <span>
              <Share className=" text-[#007AFF] w-4 h-4" />
            </span>{" "}
            Share button below
          </p>
          <p>2. Tap "Add to Home Screen"</p>
          <p>3. Tap "Add"</p>
        </div>

        <div className="flex flex-col gap-3 items-center">
          <p
            className="text-muted-foreground text-sm text-underline cursor-pointer"
            onClick={handleRemindLater}
          >
            Remind me later
          </p>
          <p
            className="text-muted-foreground/75 text-sm cursor-pointer"
            onClick={handleDontShowAgain}
          >
            Don't show this again
          </p>
          <PiCaretDownBold className=" text-[#007AFF] w-6 h-6" />
        </div>
      </section>
    );
  } else {
    return null;
  }
}
