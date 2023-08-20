import { cva } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '~/utils/cn.util';

import type { VariantProps } from 'class-variance-authority';
const variants = cva('border border-stroke rounded-md relative bg-hover animate-pulse', {
    variants: {
        size: {
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