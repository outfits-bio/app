import { PiHoodie, PiPants, PiSneaker, PiTShirt } from 'react-icons/pi';

export const LandingElements = () => {
    return <div className="w-full h-full absolute dark:text-white text-slate-500 text-[130px] p-20 justify-between hidden lg:flex">
        <div className='flex flex-col justify-between'>
            <PiSneaker className='-rotate-[18deg]' />
            <PiHoodie className='-rotate-[18deg] mb-20' />
        </div>
        <div className='flex flex-col justify-between'>
            <PiTShirt className='rotate-[18deg]' />
            <PiPants className='rotate-[18deg] mb-20' />
        </div>
    </div>;
}