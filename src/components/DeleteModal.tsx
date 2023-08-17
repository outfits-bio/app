import { Dispatch, Fragment, SetStateAction, useCallback, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import getCroppedImg from '~/utils/crop-image.util';

import { Dialog, Transition } from '@headlessui/react';
import { X } from '@phosphor-icons/react';
import { PostType } from '@prisma/client';

import { Button } from './Button';

interface DeleteModalProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    deleteAccount: () => void;
    admin?: boolean;
}

export const DeleteModal = ({ isOpen, setIsOpen, deleteAccount, admin = false }: DeleteModalProps) => {

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" open={isOpen} onClose={() => setIsOpen(false)}>
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
                            <Dialog.Panel className="w-96 gap-2 flex flex-col transform overflow-hidden rounded-md dark:text-white bg-white dark:bg-black border border-black dark:border-white p-4 text-left align-middle shadow-xl transition-all">
                                <h1 className='text-2xl font-semibold'>Are you sure?</h1>

                                <p className='w-full text-sm'>You&apos;re about to delete {admin ? "this" : 'your'} account on outfits.bio, once you do {admin ? 'they' : 'you'} will no longer be able to login, and all of {admin ? 'their' : 'your'} data will be erased. Are you sure you would like to proceed?</p>

                                <div className='flex w-full gap-2'>
                                    <Button variant='outline' centerItems onClick={() => setIsOpen(false)}>No, Abort</Button>
                                    <Button variant='danger' centerItems onClick={() => { deleteAccount(); setIsOpen(false); }}>Delete Account</Button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition >
    )
}