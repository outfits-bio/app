import { cva } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '~/utils/cn.util';

import { SpinnerGap } from '@phosphor-icons/react';

import type { VariantProps } from 'class-variance-authority';

const variants = cva('w-full font-semibold font-urbanist self-stretch px-6 py-2 rounded-lg gap-3 flex items-center', {
    variants: {
        variant: {
            primary: 'dark:bg-white border dark:border-white border-black dark:text-black text-white bg-black hover:bg-opacity-80 disabled:bg-opacity-80',
            outline: 'border dark:border-white border-black hover:bg-gray-100 dark:hover:bg-opacity-20 disabled:bg-gray-100 dark:disabled:bg-opacity-20 dark:bg-black bg-white',
            ghost: 'border border-white dark:border-black hover:bg-gray-100 dark:hover:bg-opacity-20 disabled:bg-gray-100 dark:disabled:bg-opacity-20 dark:bg-black bg-white',
            warning: 'border text-red-600 border-red-600 hover:bg-gray-100 dark:hover:bg-opacity-20 disabled:bg-gray-100 dark:disabled:bg-opacity-20 dark:bg-black bg-white',
            'warning-ghost': 'text-red-600 hover:bg-gray-100 dark:hover:bg-opacity-20 disabled:bg-gray-100 dark:disabled:bg-opacity-20 dark:bg-black bg-white',
            danger: 'border text-white bg-red-600 border-red-600 hover:bg-opacity-90 disabled:bg-opacity-20',
        },
        centerItems: {
            true: 'justify-center',
            false: 'justify-between'
        },
    },
    defaultVariants: {
        variant: 'primary',
        centerItems: false,
    }
});

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variants> {
    isLoading?: boolean;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, children, isLoading, variant, centerItems, ...props }, ref) => {
    if (props.iconLeft && !props.iconRight) {
        return <button ref={ref} className={cn(variants({ centerItems, className, variant }))} disabled={isLoading} {...props}>
            {!isLoading && <div className='text-2xl'>
                {props.iconLeft}
            </div>}
            {isLoading && <SpinnerGap className='animate-spin text-2xl' />}
            {children}
        </button>;
    }

    if (!props.iconLeft && props.iconRight) {
        return <button ref={ref} className={cn(variants({ centerItems, className, variant }))} disabled={isLoading} {...props}>
            {isLoading && <SpinnerGap className='animate-spin text-2xl' />}
            {children}
            <div className='text-2xl'>
                {props.iconRight}
            </div>
        </button>;
    }

    if (props.iconLeft && props.iconRight) {
        return <button ref={ref} className={cn(variants({ centerItems, className, variant }))} disabled={isLoading} {...props}>
            {!isLoading && <div className='text-2xl'>
                {props.iconLeft}
            </div>}
            {isLoading && <SpinnerGap className='animate-spin text-2xl' />}
            {children}
            <div className='text-2xl'>
                {props.iconRight}
            </div>
        </button>;
    }

    return <button ref={ref} className={cn(variants({ centerItems, className, variant }))} disabled={isLoading} {...props}>
        {props.iconLeft && !isLoading && <div className='text-2xl'>
            {props.iconLeft}
        </div>}
        {isLoading && <SpinnerGap className='animate-spin text-2xl' />}
        {children}
    </button>;
});