"use client";

import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle } from "@headlessui/react";
import {
  type Dispatch,
  Fragment,
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Button } from "../ui/Button";
import getCroppedImg from "@/utils/crop-image.util";
import * as nsfwjs from "nsfwjs";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  fileUrl: string | null;
  setFileUrl: Dispatch<SetStateAction<string | null>>;
  setFile: Dispatch<SetStateAction<File | Blob | null>>;
}

export const AvatarCropModal = ({
  isOpen,
  setIsOpen,
  fileUrl,
  setFile,
  setFileUrl,
}: Props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixelsState, setCroppedAreaPixelsState] =
    useState<Area | null>(null);

  const [isNSFW, setIsNSFW] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkNSFW = useCallback(async (imageUrl: string) => {
    setIsChecking(true);
    try {
      const img = new Image();
      img.src = imageUrl;
      await img.decode();

      const model = await nsfwjs.load();
      const predictions = await model.classify(img);

      const nsfwScore =
        predictions.find(
          (p: { className: string }) =>
            p.className === "Porn" || p.className === "Hentai",
        )?.probability ?? 0;
      setIsNSFW(nsfwScore > 0.5); // Set a threshold, e.g., 50%
    } catch (error) {
      console.error("NSFW check failed:", error);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    if (fileUrl) {
      void checkNSFW(fileUrl);
    }
  }, [fileUrl, checkNSFW]);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixelsState(croppedAreaPixels);
    },
    [],
  );

  const handleClose = useCallback(async () => {
    if (isNSFW) {
      toast.error("NSFW content detected. Please choose a different image.");
      return;
    }

    try {
      const croppedImage = await getCroppedImg(
        fileUrl ?? "",
        croppedAreaPixelsState,
      );

      if (!croppedImage) return;

      setFile(croppedImage.file);
      setFileUrl(croppedImage.fileUrl);
      setIsOpen(false);
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [croppedAreaPixelsState]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        open={isOpen}
        onClose={handleClose}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md overflow-hidden rounded-xl dark:text-white bg-white dark:bg-slate-950 p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle className={"text-lg font-clash font-bold mb-2"}>
                  Crop Image
                </DialogTitle>

                <div className="relative w-full h-80">
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

                <div className="flex w-full justify-between items-center mt-4 gap-2">
                  <Button
                    variant={"outline"}
                    centerItems
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    centerItems
                    onClick={handleClose}
                    disabled={isNSFW || isChecking}
                  >
                    {isChecking ? "Loading..." : "Save"}
                  </Button>
                </div>
                {isNSFW && (
                  <p className="text-red-500 mt-2">
                    NSFW content detected. Please choose a different image.
                  </p>
                )}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
