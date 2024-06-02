"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useParamsModal = (key: string, value?: string) => {
    const pathname = usePathname();
    const router = useRouter();
    const params = useSearchParams();

    const close = () => {
        const currentParams = new URLSearchParams(Array.from(params.entries()));

        currentParams.delete(key);

        router.push(`${pathname}?${currentParams.toString()}`);
    };

    const open = () => {
        const currentParams = new URLSearchParams(Array.from(params.entries()));

        currentParams.set(key, value ?? 'true');

        router.push(`${pathname}?${currentParams.toString()}`);
    };

    return { close, open };
}