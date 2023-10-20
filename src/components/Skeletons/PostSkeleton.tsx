import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '~/utils/cn.util';

const variants = cva('border border-stroke rounded-md relative bg-hover animate-pulse', {
    variants: {
        size: {
            sm: 'w-[126px] h-[206px] min-w-[126px]',
            md: 'w-44 h-72 min-w-[176px]'
        }
    },
    defaultVariants: {
        size: 'md'
    }
});

export interface PostSkeletonProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof variants> {
}

export const PostSkeleton = forwardRef<HTMLDivElement, PostSkeletonProps>(({ className, size, ...props }, ref) => {
    return <div ref={ref} className={cn(variants({ className, size }))} {...props} />;
});

PostSkeleton.displayName = 'PostSkeleton';