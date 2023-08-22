import { cva, VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '~/utils/cn.util';

const variants = cva('', {
    variants: {
        variant: {
            dark: '',
            light: '',
            system: '',
        },
        active: {
            true: 'bg-white dark:bg-black',
            false: 'bg-body',
        }
    },
    defaultVariants: {
        variant: 'system',
        active: false,
    }
});

export interface ThemeCardProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variants> {
    onClick: () => void;
}

export const Vector = ({ variant }: { variant: 'dark' | 'light' | null | undefined }) => {
    return <svg width="160" height="100" viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_568_518)">
            <rect width="160" height="100" rx="8" fill={variant === 'dark' ? 'black' : 'white'} />
            <rect x="65" y="9" width="28" height="7" rx="3.5" fill={variant === 'dark' ? '#2d2d2d' : '#E7E7E7'} />
            <rect x="65.5" y="18.5" width="11" height="20.4286" rx="1.5" stroke={variant === 'dark' ? '#2d2d2d' : '#E7E7E7'} />
            <rect x="81.5" y="18.5" width="11" height="20.4286" rx="1.5" stroke={variant === 'dark' ? '#2d2d2d' : '#E7E7E7'} />
            <rect x="65" y="49.4287" width="39" height="7" rx="3.5" fill={variant === 'dark' ? '#2d2d2d' : '#E7E7E7'} />
            <rect x="65.5" y="58.9287" width="11" height="20.4286" rx="1.5" stroke={variant === 'dark' ? '#2d2d2d' : '#E7E7E7'} />
            <rect x="81.5" y="58.9287" width="11" height="20.4286" rx="1.5" stroke={variant === 'dark' ? '#2d2d2d' : '#E7E7E7'} />
            <rect x="97.5" y="58.9287" width="11" height="20.4286" rx="1.5" stroke={variant === 'dark' ? '#2d2d2d' : '#E7E7E7'} />
            <rect x="113.5" y="58.9287" width="11" height="20.4286" rx="1.5" stroke={variant === 'dark' ? '#2d2d2d' : '#E7E7E7'} />
            <rect x="129.5" y="58.9287" width="11" height="20.4286" rx="1.5" stroke={variant === 'dark' ? '#2d2d2d' : '#E7E7E7'} />
            <rect x="65" y="89.8574" width="22" height="7" rx="3.5" fill={variant === 'dark' ? '#2d2d2d' : '#E7E7E7'} />
            <rect x="65.5" y="99.3574" width="11" height="20.4286" rx="1.5" stroke={variant === 'dark' ? '#2d2d2d' : '#E7E7E7'} />
            <rect x="81.5" y="99.3574" width="11" height="20.4286" rx="1.5" stroke={variant === 'dark' ? '#2d2d2d' : '#E7E7E7'} />
            <rect x="97.5" y="99.3574" width="11" height="20.4286" rx="1.5" stroke={variant === 'dark' ? '#2d2d2d' : '#E7E7E7'} />
            <circle cx="26" cy="24" r="14.5" stroke={variant === 'dark' ? '#2d2d2d' : '#E7E7E7'} />
            <rect x="11" y="41" width="30" height="5" rx="2.5" fill={variant === 'dark' ? '#2d2d2d' : '#E7E7E7'} />
            <rect x="11" y="48" width="41" height="5" rx="2.5" fill={variant === 'dark' ? '#2d2d2d' : '#E7E7E7'} />
            <rect x="11" y="55" width="13" height="5" rx="2.5" fill={variant === 'dark' ? '#2d2d2d' : '#E7E7E7'} />
            <rect x="26" y="55" width="13" height="5" rx="2.5" fill={variant === 'dark' ? '#2d2d2d' : '#E7E7E7'} />
            <rect x="11" y="64" width="30" height="10" rx="1.5" fill={variant === 'dark' ? '#2d2d2d' : '#E7E7E7'} />
            <rect x="43" y="64" width="10" height="10" rx="1.5" fill={variant === 'dark' ? '#2d2d2d' : '#E7E7E7'} />
        </g>
        <defs>
            <clipPath id="clip0_568_518">
                <rect width="160" height="100" rx="8" fill="white" />
            </clipPath>
        </defs>
    </svg>
}

export const ThemeCard = forwardRef<HTMLButtonElement, ThemeCardProps>(({ className, children, variant, active, ...props }, ref) => {
    return <button ref={ref} className={cn(variants({ active }), 'border-stroke border px-4 py-3 flex flex-col gap-3 rounded-md')} {...props}>
        {variant !== 'system' ? <div className={cn(variants({ variant }))}>
            <Vector variant={variant} />
        </div> : <div className='bg-white dark:bg-black h-[100px] w-40 relative'>
            <div className='absolute inset-0'>
                <Vector variant='dark' />
            </div>
            <div className='absolute w-1/2 overflow-hidden'>
                <Vector variant='light' />
            </div>
        </div>}
        <p>{variant === 'light' ? 'Light Mode (Default)' : variant === 'dark' ? 'Dark Mode' : 'System Automatic'}</p>
    </button>;
});

ThemeCard.displayName = 'ThemeCard';