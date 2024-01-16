"use client";

import debounce from 'lodash.debounce';
import { useRouter } from "next/navigation";
import { type Dispatch, type SetStateAction, useCallback } from "react";
import { PiMagnifyingGlass, PiSpinnerGap } from "react-icons/pi";

interface SearchBarProps {
    isFetching: boolean;
    refetch: () => void;
    input: string;
    setInput: Dispatch<SetStateAction<string>>;
}

export function SearchBar({ isFetching, refetch, input, setInput }: SearchBarProps) {
    const router = useRouter();

    const request = debounce(async () => {
        if (input.length > 0) {
            void refetch();
        }
    }, 300)

    const debounceRequest = useCallback(() => {
        void request()
    }, []);

    return <div className="relative items-center font-clash font-medium flex mb-4">
        <input
            autoComplete='off'
            id="link"
            type="text"
            placeholder='Search for users'
            className="pl-4 py-2 h-12 w-full border rounded-md border-stroke text-secondary-text dark:bg-black focus:outline-none"
            onChange={(e) => {
                setInput(e.target.value)
                debounceRequest()
            }}
            value={input}
        />

        <div className='w-[1px] h-full absolute right-12 bg-stroke' />

        <button className='absolute right-0 flex items-center justify-center h-full w-12 hover:bg-hover disabled:hover:bg-transparent rounded-r-md' disabled={!input} onClick={() => input && router.push(`/search?username=${input}`)}>
            {isFetching ? <PiSpinnerGap className=' text-secondary-text w-6 h-6 animate-spin' /> : <PiMagnifyingGlass className='text-secondary-text w-6 h-6' />}
        </button>
    </div>
}