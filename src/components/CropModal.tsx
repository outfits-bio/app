import { Fragment, Ref } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';

import { Dialog, Transition } from '@headlessui/react';

interface Props {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    fileUrl: string | null;
    setFileUrl: (fileUrl: string | null) => void;
    file: any;
    onCrop: () => void;
    cropperRef: Ref<ReactCropperElement>;
}

export const CropModal = ({ isOpen, setIsOpen, fileUrl, onCrop, cropperRef, setFileUrl, file }: Props) => {
    const handleClose = () => {
        setIsOpen(false);
        setFileUrl(URL.createObjectURL(file));
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" open={isOpen} onClose={handleClose}>
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title className={'text-lg font-bold mb-2'}>Crop Image</Dialog.Title>

                                <Cropper
                                    src={fileUrl ?? ""}
                                    aspectRatio={1 / 1}
                                    className='max-h-80'
                                    crop={onCrop}
                                    ref={cropperRef}
                                    cropBoxResizable={false}
                                />

                                <button className='mt-4 border border-gray-400 px-6 h-10 rounded-sm' onClick={handleClose}>Close</button>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}