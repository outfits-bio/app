"use client";

import { cn } from '@/utils/cn.util';
import { Dialog, Transition } from '@headlessui/react';
import type { VariantProps } from "class-variance-authority";
import { cva } from 'class-variance-authority';
import localFont from 'next/font/local';
import { Fragment, forwardRef } from 'react';

const clash = localFont({
    src: '../../../../public/fonts/ClashDisplay-Variable.woff2',
    display: 'swap',
    variable: '--font-clash',
});

const satoshi = localFont({
    src: '../../../../public/fonts/Satoshi-Variable.woff2',
    display: 'swap',
    variable: '--font-satoshi',
});

const variants = cva('w-96 gap-2 overflow-hidden rounded-xl bg-white dark:bg-black border border-stroke p-4 text-left align-middle shadow-xl transition-all z-10', {
    variants: {
        size: {
            sm: 'min-w-96',
            md: 'min-w-128',
            lg: 'min-w-192',
            xl: 'min-w-256',
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
    close: () => void;
}

export const BaseModal = forwardRef<HTMLDivElement, BaseModalProps>(({ className, children, isOpen, close, ...props }, ref) => {

    return <Transition appear show={isOpen} as={Fragment} {...props}>
        <Dialog as="div" className={`relative z-50 ${clash.variable} ${satoshi.variable} font-clash`} open={isOpen} onClose={close}>
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