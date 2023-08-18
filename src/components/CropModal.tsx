import { Dispatch, Fragment, SetStateAction, useCallback, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import getCroppedImg from '~/utils/crop-image.util';

import { Dialog, Transition } from '@headlessui/react';
import { PostType } from '@prisma/client';

import { Button } from './Button';

interface Props {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    fileUrl: string | null;
    setFileUrl: Dispatch<SetStateAction<string | null>>;
    setFile: Dispatch<SetStateAction<File | Blob | null>>;
}

export const CropModal = ({ isOpen, setIsOpen, fileUrl, setFile, setFileUrl }: Props) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixelsState, setCroppedAreaPixelsState] = useState<Area | null>(null);

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixelsState(croppedAreaPixels)
    }, []);

    const handleClose = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(fileUrl ?? "", croppedAreaPixelsState);

            if (!croppedImage) return;

            setFile(croppedImage.file);
            setFileUrl(croppedImage.fileUrl);
            setIsOpen(false);
        } catch (e) {
            console.error(e)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [croppedAreaPixelsState]);

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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-md dark:text-white bg-white dark:bg-slate-950 p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title className={'text-lg font-bold mb-2'}>Crop Image</Dialog.Title>

                                <div className='relative w-full h-80'>
                                    <Cropper
                                        image={fileUrl ?? ""}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={1}
                                        cropShape="round"
                                        showGrid={false}
                                        onCropChange={(crop) => setCrop(crop)}
                                        onCropComplete={onCropComplete}
                                        onZoomChange={(zoom) => setZoom(zoom)}
                                    />
                                </div>

                                <div className='flex w-full justify-between items-center mt-4 gap-2'>
                                    <Button centerItems onClick={() => setIsOpen(false)}>Cancel</Button>
                                    <Button centerItems onClick={handleClose}>Save</Button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}