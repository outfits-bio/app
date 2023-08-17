import { Dispatch, Fragment, SetStateAction, useCallback, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import getCroppedImg from '~/utils/crop-image.util';

import { Dialog, Transition } from '@headlessui/react';
import { X } from '@phosphor-icons/react';
import { PostType } from '@prisma/client';

import { Button } from './Button';

interface Props {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    fileUrl: string | null;
    setFileUrl: Dispatch<SetStateAction<string | null>>;
    setFile: Dispatch<SetStateAction<File | Blob | null>>;
    setIsCropped: (isCropped: boolean) => void;
    type: PostType;
}

const typeToSingular = (type: PostType) => {
    switch (type) {
        case PostType.OUTFIT:
            return 'Outfit';
        case PostType.HOODIE:
            return 'Hoodie';
        case PostType.SHIRT:
            return 'Shirt';
        case PostType.PANTS:
            return 'Pants';
        case PostType.SHOES:
            return 'Shoes';
        case PostType.WATCH:
            return 'Accessory';
    }
}

export const PostCropModal = ({ isOpen, setIsOpen, fileUrl, setFile, setFileUrl, setIsCropped, type }: Props) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [rotation, setRotation] = useState(0)
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixelsState, setCroppedAreaPixelsState] = useState<Area | null>(null)

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixelsState(croppedAreaPixels);
    }, []);

    const handleClose = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(fileUrl ?? "", croppedAreaPixelsState);

            if (!croppedImage) return;

            setFile(croppedImage.file);
            setFileUrl(croppedImage.fileUrl);
            setIsCropped(true);
            setIsOpen(false);
        } catch (e) {
            console.error(e)
        }
    }, [croppedAreaPixelsState]);

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
                            <Dialog.Panel className="flex transform overflow-hidden rounded-md dark:text-white bg-white dark:bg-black border border-black dark:border-white p-4 text-left align-middle shadow-xl transition-all">
                                <div>
                                    <div className='flex justify-end w-full mb-2'>
                                        <div>
                                            <Button variant='ghost' centerItems>
                                                <X className='h-6 w-6' />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className='relative w-[320px] h-[574px]'>
                                        <Cropper
                                            image={fileUrl ?? ""}
                                            crop={crop}
                                            zoom={zoom}
                                            rotation={rotation}
                                            aspect={2 / 3}
                                            cropSize={{ width: 320, height: 574 }}
                                            classes={{ containerClassName: 'bg-gray-100 rounded-md' }}
                                            showGrid={true}
                                            onCropChange={(crop) => setCrop(crop)}
                                            onRotationChange={(rotation) => setRotation(rotation)}
                                            onCropComplete={onCropComplete}
                                            onZoomChange={(zoom) => setZoom(zoom)}
                                        />
                                    </div>

                                    <input
                                        type='range'
                                        value={zoom}
                                        step={0.1}
                                        min={0.4}
                                        max={3}
                                        aria-labelledby="Zoom"
                                        onChange={(e) => setZoom(e.target.valueAsNumber)}
                                        className="w-[320px] h-2 bg-gray-200 rounded-lg mb-3 appearance-none cursor-pointer dark:bg-gray-700 accent-black dark:accent-white"
                                    />

                                    <Button centerItems onClick={handleClose}>
                                        Post
                                    </Button>
                                </div>

                                {/* <div className='flex flex-col w-[320px] h-full gap-4 pl-4'>
                                    <div className='flex w-full items-center justify-end'>
                                        <button>
                                            <X className='h-6 w-6' />
                                        </button>
                                    </div>

                                    <div className='flex flex-col gap-2'>
                                        <h2 className='font-semibold text-2xl font-urbanist'>Details</h2>

                                        
                                    </div>
                                </div> */}

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}