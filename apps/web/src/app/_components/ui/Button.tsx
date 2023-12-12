import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { PiSpinnerGap } from 'react-icons/pi';
import { cn } from '@/utils/cn.util';

const variants = cva('font-semibold font-clash self-stretch h-12 py-2 gap-3 flex items-center', {
    variants: {
        variant: {
            primary: 'bg-accent border-accent border dark:text-black text-white hover:bg-opacity-80 dark:hover:bg-opacity-80 disabled:bg-opacity-80 dark:disabled:bg-opacity-80',
            outline: 'border dark:border-white disabled:bg-hover bg-transparent hover:bg-hover transform transition duration-300 ease-in-out',
            ghost: 'border border-transparent hover:bg-hover disabled:bg-hover transform transition duration-300 ease-in-out',
            'outline-ghost': 'border border-stroke hover:bg-hover disabled:bg-hover transform transition duration-300 ease-in-out',
        },
        centerItems: {
            true: 'justify-center',
            false: 'justify-between'
        },
        shape: {
            normal: 'px-6 w-full rounded-lg',
            square: 'w-12 px-2 rounded-lg justify-center',
            circle: 'rounded-full px-2 w-12 justify-center',
        },
        accent: {
            true: 'bg-accent border-accent',
            false: ''
        },
    },
    defaultVariants: {
        variant: 'primary',
        centerItems: false,
        shape: 'normal',
        accent: false,
    }
});

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variants> {
    isLoading?: boolean;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, children, isLoading, variant, centerItems, iconLeft, iconRight, shape, accent, ...props }, ref) => {

    if (variant === 'outline-ghost' && accent) {
        variant = 'primary';
    }

    if (iconLeft && !iconRight) {
        return <button ref={ref} className={cn(variants({ centerItems, className, variant, shape, accent }))} disabled={isLoading} {...props}>
            {!isLoading && <div className='text-2xl'>
                {iconLeft}
            </div>}
            {isLoading && <PiSpinnerGap className='animate-spin text-2xl' />}
            {children}
        </button>;
    }

    if (!iconLeft && iconRight) {
        return <button ref={ref} className={cn(variants({ centerItems, className, variant, shape, accent }))} disabled={isLoading} {...props}>
            {isLoading && <PiSpinnerGap className='animate-spin text-2xl' />}
            {children}
            <div className='text-2xl'>
                {iconRight}
            </div>
        </button>;
    }

    if (iconLeft && iconRight) {
        return <button ref={ref} className={cn(variants({ centerItems, className, variant, shape, accent }))} disabled={isLoading} {...props}>
            {!isLoading && <div className='text-2xl'>
                {iconLeft}
            </div>}
            {isLoading && <PiSpinnerGap className='animate-spin text-2xl' />}
            {children}
            <div className='text-2xl'>
                {iconRight}
            </div>
        </button>;
    }

    return <button ref={ref} className={cn(variants({ centerItems, className, variant, shape, accent }))} disabled={isLoading} {...props}>
        {iconLeft && !isLoading && <div className='text-2xl'>
            {iconLeft}
        </div>}
        {isLoading && <PiSpinnerGap className='animate-spin text-2xl' />}
        {children}
    </button>;
});

Button.displayName = 'Button';