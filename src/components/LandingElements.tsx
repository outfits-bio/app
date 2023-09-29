import { Hoodie, Pants, Sneaker, TShirt } from '@phosphor-icons/react';

export const LandingElements = () => {
    return <div className="w-full h-full absolute dark:text-white text-slate-500 text-[130px] p-20 justify-between hidden lg:flex">
        <div className='flex flex-col justify-between'>
            <Sneaker className='-rotate-[18deg]' />
            <Hoodie className='-rotate-[18deg] mb-20' />
        </div>
        <div className='flex flex-col justify-between'>
            <TShirt className='rotate-[18deg]' />
            <Pants className='rotate-[18deg] mb-20' />
        </div>
    </div>;
}