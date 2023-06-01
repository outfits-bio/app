import { Fragment, useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '~/utils/crop-image.util';

import { Dialog, Transition } from '@headlessui/react';

interface Props {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    fileUrl: string | null;
    setFileUrl: (fileUrl: string | null) => void;
    setFile: (file: any) => void;
    setIsCropped: (isCropped: boolean) => void;
}

export const PostCropModal = ({ isOpen, setIsOpen, fileUrl, setFile, setFileUrl, setIsCropped }: Props) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [rotation, setRotation] = useState(0)
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleClose = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(
                fileUrl ?? "",
                croppedAreaPixels,
            )

            if (!croppedImage) return;
            setFile(croppedImage.file);
            setFileUrl(croppedImage.fileUrl);
            setIsCropped(true);
            setIsOpen(false);
        } catch (e) {
            console.error(e)
        }
    }, [croppedAreaPixels]);

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

                                {/* <Cropper
                                    src={fileUrl ?? ""}
                                    aspectRatio={1 / 1}
                                    className='max-h-80'
                                    crop={onCrop}
                                    ref={cropperRef}
                                    cropBoxResizable={false}
                                /> */}

                                <div className='relative w-full h-80'>
                                    <Cropper
                                        image={fileUrl ?? ""}
                                        crop={crop}
                                        zoom={zoom}
                                        rotation={rotation}
                                        aspect={2 / 3}
                                        showGrid={true}
                                        onCropChange={(crop) => setCrop(crop)}
                                        onRotationChange={(rotation) => setRotation(rotation)}
                                        onCropComplete={onCropComplete}
                                        onZoomChange={(zoom) => setZoom(zoom)}
                                    />
                                </div>

                                <button className='mt-4 border border-gray-400 px-6 h-10 rounded-sm' onClick={handleClose}>Close</button>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}