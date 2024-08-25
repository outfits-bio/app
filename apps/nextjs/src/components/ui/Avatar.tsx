import { cn } from '@acme/utils/cn.util'
import { formatAvatar } from '@acme/utils/image-src-format.util'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import Image from 'next/image'
import { forwardRef } from 'react'

const variants = cva(
  'relative border border-stroke rounded-full grow-0 shrink-0 md:basis-auto',
  {
    variants: {
      size: {
        xxs: 'w-6 h-6',
        xs: 'w-[32px] h-[32px]',
        // sm: 'w-[46px] h-[46px]',
        sm: 'w-12 h-12',
        md: 'basis-16 w-16 h-16',
        lg: 'w-[88px] h-[88px]',
        jumbo: 'w-32 h-32 basis-32  md:w-[300px] md:h-[300px]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof variants> {
  image?: string | null
  id?: string
  username?: string | null
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, image, id, username, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(variants({ className, size }))}
        {...props}
      >
        <Image
          priority
          src={formatAvatar(image, id)}
          alt={username ?? ''}
          width={size === 'jumbo' ? 300 : size === 'lg' ? 88 : size === 'md' ? 64 : size === 'sm' ? 48 : 32}
          height={size === 'jumbo' ? 300 : size === 'lg' ? 88 : size === 'md' ? 64 : size === 'sm' ? 48 : 32}
          className="object-contain rounded-full"
        />
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'
