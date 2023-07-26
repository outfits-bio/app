import { SpinnerGap } from '@phosphor-icons/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    color?: 'primary' | 'warning' | 'danger' | 'outline' | 'ghost' | 'warning-ghost';
    isLoading?: boolean;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
    centerItems?: boolean;
    itemsLeft?: boolean;
    active?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ isLoading = false, color = 'primary', centerItems = false, itemsLeft = false, active = false, ...props }: ButtonProps) => {
    let className = props.className + " " ?? "";

    if (color === 'primary') className += `w-full font-semibold font-urbanist dark:bg-white border dark:border-white border-black dark:text-black text-white bg-black hover:bg-opacity-80 disabled:bg-opacity-80 flex items-center ${centerItems ? 'justify-center' : itemsLeft ? 'justify-start' : 'justify-between'} self-stretch px-6 py-2 rounded-lg gap-3`;
    if (color === 'outline') className += `w-full font-semibold font-urbanist border dark:border-white border-black hover:bg-gray-100 dark:hover:bg-opacity-20 disabled:bg-gray-100 dark:disabled:bg-opacity-20 dark:bg-black bg-white flex items-center ${centerItems ? 'justify-center' : itemsLeft ? 'justify-start' : 'justify-between'} self-stretch px-6 py-2 rounded-lg gap-3`;
    if (color === 'ghost') className += `w-full font-semibold font-urbanist border border-white dark:border-black hover:bg-gray-100 dark:hover:bg-opacity-20 disabled:bg-gray-100 dark:disabled:bg-opacity-20 dark:bg-black bg-white flex items-center ${centerItems ? 'justify-center' : itemsLeft ? 'justify-start' : 'justify-between'} self-stretch px-6 py-2 rounded-lg gap-3`;
    if (color === 'warning') className += `w-full font-semibold font-urbanist border text-red-600 border-red-600 hover:bg-gray-100 dark:hover:bg-opacity-20 disabled:bg-gray-100 dark:disabled:bg-opacity-20 dark:bg-black bg-white flex items-center ${centerItems ? 'justify-center' : itemsLeft ? 'justify-start' : 'justify-between'} self-stretch px-6 py-2 rounded-lg gap-3`;
    if (color === 'warning-ghost') className += `w-full font-semibold font-urbanist text-red-600 hover:bg-gray-100 dark:hover:bg-opacity-20 disabled:bg-gray-100 dark:disabled:bg-opacity-20 dark:bg-black bg-white flex items-center ${centerItems ? 'justify-center' : itemsLeft ? 'justify-start' : 'justify-between'} self-stretch px-6 py-2 rounded-lg gap-3`;
    if (color === 'danger') className += `w-full font-semibold font-urbanist border text-white bg-red-600 border-red-600 hover:bg-opacity-90 disabled:bg-opacity-20 flex items-center ${centerItems ? 'justify-center' : itemsLeft ? 'justify-start' : 'justify-between'} self-stretch px-6 py-2 rounded-lg gap-3`;

    return <button className={className} disabled={isLoading} {...props}>
        {props.iconLeft && !isLoading && <div className='text-2xl'>
            {props.iconLeft}
        </div>}
        {isLoading && <SpinnerGap className='animate-spin text-2xl' />}
        {props.children}
        {props.iconRight && <div className='text-2xl'>
            {props.iconRight}
        </div>}
    </button>;
}