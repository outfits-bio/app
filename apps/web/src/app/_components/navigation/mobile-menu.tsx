"use client";

import { Menu, Transition } from '@headlessui/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Fragment } from 'react';

import { PiDotsThree, PiX } from 'react-icons/pi';

export const MobileMenu = () => {
    const { data: session } = useSession();

    if (session && session.user) return null;

    return <Menu as="div" className="inline-block text-left md:hidden">
        {({ open }) => (
            <div>
                {open && <div className="fixed inset-0 top-20 bg-black/30 transition-all ease-in-out duration-50" aria-hidden="true" />}

                <div>
                    <Menu.Button className="inline-flex w-full justify-center bg-opacity-20 p-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                        {open ? <PiX className='h-9 w-9' /> : <PiDotsThree className='h-9 w-9' />}
                    </Menu.Button>
                </div>


                <Transition
                    as={Fragment}
                    enter="transition-all ease-in-out duration-50"
                    enterFrom="h-0"
                    enterTo="h-44"
                    leave="transition-all ease-in-out duration-50"
                    leaveFrom="h-44"
                    leaveTo="h-0"

                >
                    <Menu.Items
                        className="h-44 border-b border dark:border-white bg-white dark:bg-black fixed overflow-hidden inset-0 mt-20 w-full ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="p-4 space-y-2">
                            <Menu.Item>
                                {({ active }) => (
                                    <Link href={'https://discord.gg/f4KEs5TVz2'}
                                        className={`${active ? 'bg-gray-100 dark:bg-opacity-20 rounded-xl transform transition duration-300 ease-in-out' : ''
                                            } group flex w-full items-center justify-between px-4 py-2 font-clash font-semibold`}
                                    >
                                        <h3>Create your profile or Login</h3>
                                    </Link>
                                )}
                            </Menu.Item>


                            <div className='flex w-full items-center justify-center gap-4 font-clash font-semibold opacity-50'>
                                <Link href={'/docs/terms-of-service'} className='px-4 py-2'>
                                    Terms
                                </Link>
                                <Link href={'/docs/privacy-policy'} className='px-4 py-2'>
                                    Privacy
                                </Link>
                                <Link href={'/docs/brand-guide'} className='px-4 py-2'>
                                    Branding
                                </Link>
                            </div>
                        </div>
                    </Menu.Items>
                </Transition>
            </div>
        )}
    </Menu>
}