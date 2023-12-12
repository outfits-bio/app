"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/Button";

export function PersonalizationSection() {
    const [color, setColor] = useState('orange-accent');


    return <div className='border border-stroke rounded-xl w-full py-12 flex flex-col px-4 '>
        <h2 className='font-bold text-3xl md:text-4xl font-clash mb-4'>Personalization</h2>
        <p className='mb-4'>We offer a variety of themes and accent colors try them below:</p>

        <div className='flex gap-2 mb-4'>
            <button className={`w-6 h-6 rounded-full bg-orange-accent ${color === 'orange-accent' && 'border border-stroke'}`} onClick={() => setColor('orange-accent')} />
            <button className={`w-6 h-6 rounded-full bg-hot-pink-accent ${color === 'hot-pink-accent' && 'border border-stroke'}`} onClick={() => setColor('hot-pink-accent')} />
            <button className={`w-6 h-6 rounded-full bg-brown-accent ${color === 'brown-accent' && 'border border-stroke'}`} onClick={() => setColor('brown-accent')} />
            <button className={`w-6 h-6 rounded-full bg-light-pink-accent ${color === 'light-pink-accent' && 'border border-stroke'}`} onClick={() => setColor('light-pink-accent')} />
            <button className={`w-6 h-6 rounded-full bg-accent ${color === 'accent' && 'border border-stroke'}`} onClick={() => setColor('accent')} />
        </div>

        <div className='flex'>
            <Link href={'/login'}>
                <Button variant={'outline-ghost'} className={`bg-${color} text-white ${color === 'accent' && 'dark:text-black'}`}>Try it Today</Button>
            </Link>
        </div>
    </div>
}