import { cva } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '~/utils/cn.util';

import { SpinnerGap } from '@phosphor-icons/react';

import type { VariantProps } from 'class-variance-authority';

const variants = cva('font-semibold font-urbanist self-stretch h-12 py-2 gap-3 flex items-center', {
    variants: {
        variant: {
            primary: 'dark:bg-white border dark:border-white border-black dark:text-black text-white bg-black hover:bg-opacity-80 dark:hover:bg-opacity-80 disabled:bg-opacity-80 dark:disabled:bg-opacity-80',
            outline: 'border dark:border-white border-black disabled:bg-hover bg-transparent hover:bg-hover',
            ghost: 'border border-transparent hover:bg-hover disabled:bg-hover',
            'outline-ghost': 'border border-stroke hover:bg-hover disabled:bg-hover',
        },
        centerItems: {
            true: 'justify-center',
            false: 'justify-between'
        },
        shape: {
            normal: 'px-6 w-full rounded-lg',
            square: 'w-12 px-2 rounded-lg justify-center',
            circle: 'rounded-full px-2 w-12 justify-center',
        }
    },
    defaultVariants: {
        variant: 'primary',
        centerItems: false,
        shape: 'normal'
    }
});

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variants> {
    isLoading?: boolean;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, children, isLoading, variant, centerItems, shape, ...props }, ref) => {
    if (props.iconLeft && !props.iconRight) {
        return <button ref={ref} className={cn(variants({ centerItems, className, variant, shape }))} disabled={isLoading} {...props}>
            {!isLoading && <div className='text-2xl'>
                {props.iconLeft}
            </div>}
            {isLoading && <SpinnerGap className='animate-spin text-2xl' />}
            {children}
        </button>;
    }

    if (!props.iconLeft && props.iconRight) {
        return <button ref={ref} className={cn(variants({ centerItems, className, variant, shape }))} disabled={isLoading} {...props}>
            {isLoading && <SpinnerGap className='animate-spin text-2xl' />}
            {children}
            <div className='text-2xl'>
                {props.iconRight}
            </div>
        </button>;
    }

    if (props.iconLeft && props.iconRight) {
        return <button ref={ref} className={cn(variants({ centerItems, className, variant, shape }))} disabled={isLoading} {...props}>
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

    return <button ref={ref} className={cn(variants({ centerItems, className, variant, shape }))} disabled={isLoading} {...props}>
        {props.iconLeft && !isLoading && <div className='text-2xl'>
            {props.iconLeft}
        </div>}
        {isLoading && <SpinnerGap className='animate-spin text-2xl' />}
        {children}
    </button>;
});

Button.displayName = 'Button';