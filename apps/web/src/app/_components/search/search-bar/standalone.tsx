"use client";

import debounce from 'lodash.debounce';
import { useRouter, useSearchParams } from "next/navigation";
import { type ChangeEvent, useCallback, type Dispatch, type SetStateAction, useEffect } from "react";
import { PiMagnifyingGlass, PiSpinnerGap } from "react-icons/pi";

interface SearchBarProps {
    isFetching: boolean;
    refetch: () => void;
    input: string;
    setInput: Dispatch<SetStateAction<string>>;
}

export function SearchBar({ isFetching, refetch, input, setInput }: SearchBarProps) {
    const router = useRouter();
    const params = useSearchParams();

    const username = params.get('username')?.toString();

    const request = debounce(async () => {
        refetch();
    }, 300)

    const debounceRequest = useCallback(() => {
        void request()
    }, []);

    useEffect(() => {
        if (username) {
            debounceRequest();
        }
    }, [username]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value)
        debounceRequest();
    }

    return <div className="relative items-center font-clash font-medium flex mb-4">
        <input
            autoComplete='off'
            type="text"
            placeholder='Search for users'
            className="pl-4 py-2 h-12 w-full border rounded-md border-stroke text-secondary-text dark:bg-black focus:outline-none"
            onChange={handleChange}
            value={input}
        />

        <div className='w-[1px] h-full absolute right-12 bg-stroke' />

        <button className='absolute right-0 flex items-center justify-center h-full w-12 hover:bg-hover disabled:hover:bg-transparent rounded-r-md' disabled={!input} onClick={() => input && router.push(`/search?username=${input}`)}>
            {isFetching ? <PiSpinnerGap className=' text-secondary-text w-6 h-6 animate-spin' /> : <PiMagnifyingGlass className='text-secondary-text w-6 h-6' />}
        </button>
    </div>
}