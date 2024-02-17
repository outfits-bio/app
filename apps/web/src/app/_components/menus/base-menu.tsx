"use client";

import { Menu, Transition } from '@headlessui/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, Fragment } from 'react';
import { cn } from '@/utils/cn.util';


const variants = cva('absolute right-1 rounded-xl divide-y divide-stroke mt-1 w-56 origin-top-right border border-stroke bg-white dark:bg-black shadow-dropdown p-4');

export interface BaseMenuProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof variants> {
    button: React.ReactNode;
}

export const BaseMenu = forwardRef<HTMLDivElement, BaseMenuProps>(({ className, children, button, ...props }, ref) => {
    return <Menu as="div" className="relative inline-block text-left z-10" {...props} ref={ref}>
        <div>
            <Menu.Button>
                {button}
            </Menu.Button>
        </div>
        <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
            <Menu.Items static className={cn(variants({ className }))}>
                {children}
            </Menu.Items>
        </Transition>
    </Menu>
});

BaseMenu.displayName = 'BaseMenu';