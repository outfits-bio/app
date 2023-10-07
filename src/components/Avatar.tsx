import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import Image from 'next/image';
import { forwardRef } from 'react';
import { cn } from '~/utils/cn.util';
import { formatAvatar } from '~/utils/image-src-format.util';


const variants = cva('relative border border-stroke rounded-full', {
    variants: {
        size: {
            xs: 'w-[32px] h-[32px] grow-0 shrink-0 md:basis-auto',
            sm: 'w-[46px] h-[46px] grow-0 shrink-0 md:basis-auto',
            md: 'basis-16 w-16 h-16 grow-0 shrink-0 md:basis-auto',
            jumbo: 'w-32 h-32 basis-32 grow-0 shrink-0 md:basis-auto md:w-[300px] md:h-[300px]'
        }
    },
    defaultVariants: {
        size: 'md'
    }
});

export interface AvatarProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof variants> {
    image?: string | null;
    id?: string;
    username?: string | null;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(({ className, size, image, id, username, ...props }, ref) => {
    return <div ref={ref} className={cn(variants({ className, size }))} {...props}>
        <Image priority src={formatAvatar(image, id)} alt={username ?? ''} fill className='rounded-full object-contain' />
    </div>;
});

Avatar.displayName = 'Avatar';