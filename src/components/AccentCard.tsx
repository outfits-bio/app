import { cva, VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '~/utils/cn.util';

const variants = cva('', {
    variants: {
        variant: {
            default: 'bg-black dark:bg-white',
            brown: 'bg-brown-accent',
            'hot-pink': 'bg-hot-pink-accent',
            'light-pink': 'bg-light-pink-accent',
            'orange': 'bg-orange-accent',
        },
    },
    defaultVariants: {
        variant: 'default',
    }
});

const variantToName = (variant?: string | null) => {
    switch (variant) {
        case 'brown':
            return 'Brown';
        case 'hot-pink':
            return 'Hot Pink';
        case 'light-pink':
            return 'Light Pink';
        case 'orange':
            return 'Orange';
        default:
            return 'Default';
    }
}

export interface AccentCardProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variants> {
    onClick: () => void;
    active: boolean;
}

export const AccentCard = forwardRef<HTMLButtonElement, AccentCardProps>(({ variant, active, ...props }, ref) => {
    return <button ref={ref} className={active ? 'border-stroke border p-4 flex flex-col gap-3 rounded-md bg-white dark:bg-black' : 'border-stroke border p-4 flex flex-col gap-3 rounded-md bg-body'} {...props}>
        <div className={cn(variants({ variant }), 'w-14 h-14 rounded-full')} />
        {variantToName(variant)}
    </button >;
});

AccentCard.displayName = 'AccentCard';