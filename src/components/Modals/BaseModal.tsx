import { cva } from 'class-variance-authority';
import { Inter, Urbanist } from 'next/font/google';
import { Dispatch, forwardRef, Fragment, SetStateAction } from 'react';
import { cn } from '~/utils/cn.util';

import { Dialog, Transition, TransitionChildProps } from '@headlessui/react';

import type { VariantProps } from "class-variance-authority";

const urbanist = Urbanist({
    subsets: ['latin-ext'],
    display: 'swap',
    variable: '--font-urbanist',
});

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

const variants = cva('w-96 gap-2 overflow-hidden rounded-md bg-white dark:bg-black border border-stroke p-4 text-left align-middle shadow-xl transition-all', {
    variants: {
        size: {
            sm: 'w-96',
            md: 'w-128',
            lg: 'w-192',
            xl: 'w-256',
        },
    },
    defaultVariants: {
        size: 'md',
    }
});

export interface BaseModalProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof variants> {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const BaseModal = forwardRef<HTMLDivElement, BaseModalProps>(({ className, children, size, isOpen, setIsOpen, ...props }, ref) => {
    return <Transition appear show={isOpen} as={Fragment} {...props}>
        <Dialog as="div" className={`relative z-10 ${urbanist.variable} ${inter.variable} font-urbanist`} open={isOpen} onClose={() => setIsOpen(false)}>
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className={cn(variants({ className }))} ref={ref}>
                            {children}
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </div>
        </Dialog>
    </Transition>
});

BaseModal.displayName = 'BaseModal';