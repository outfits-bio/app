import { Dialog, Transition } from '@headlessui/react';
import { Dispatch, Fragment, SetStateAction } from 'react';


import { Button } from './Button';

interface DeleteModalProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    deleteFn: () => void;
    admin?: boolean;
    post?: boolean;
}

export const DeleteModal = ({ isOpen, setIsOpen, deleteFn, admin = false, post = false }: DeleteModalProps) => {

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
                            <Dialog.Panel className="w-96 gap-2 flex flex-col overflow-hidden rounded-xl dark:text-white bg-white dark:bg-black border border-stroke p-4 text-left align-middle shadow-xl transition-all">
                                <h1 className='text-2xl font-semibold'>Are you sure?</h1>

                                {post ? <p className='text-sm'>
                                    You&apos;re about to delete this post, once you do it will be gone forever. Are you sure you would like to proceed?
                                </p> : <p className='w-full text-sm'>You&apos;re about to delete {admin ? "this" : 'your'} account on outfits.bio, once you do {admin ? 'they' : 'you'} will no longer be able to login, and all of {admin ? 'their' : 'your'} data will be erased. Are you sure you would like to proceed?</p>}

                                <div className='flex w-full gap-2'>
                                    <Button variant='outline' centerItems onClick={() => setIsOpen(false)}>No, Abort</Button>
                                    <Button centerItems onClick={() => { deleteFn(); setIsOpen(false); }}>Delete {post ? 'Post' : 'Account'}</Button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition >
    )
}