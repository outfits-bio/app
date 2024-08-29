"use client";

import { useFileUpload } from "@/hooks/file-upload.hook";
import { api } from "@/trpc/react";
import getCroppedImg from "@/utils/crop-image.util";
import { handleErrors } from "@/utils/handle-errors.util";
import { getPostTypeName } from "@/utils/names.util";
import axios from "axios";
import { PostType } from "database";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Area } from "react-easy-crop";
import Cropper from "react-easy-crop";
import { PiPlus } from "react-icons/pi";
import { Button } from "../ui/Button";
import {
  BaseModal,
  BaseModalContent,
  BaseModalDescription,
  BaseModalTitle,
  BaseModalTrigger,
} from "./base-modal";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as nsfwjs from "nsfwjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { UserTagInput } from "../ui/user-tag-input";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";

export function CreatePostModal() {
  const ctx = api.useUtils();
  const router = useRouter();

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [type, setType] = useState<PostType>("OUTFIT");
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixelsState, setCroppedAreaPixelsState] =
    useState<Area | null>(null);

  const {
    handleChange,
    dragActive,
    file,
    fileUrl,
    handleDrag,
    handleDrop,
    handlePaste,
    setFile,
    setFileUrl,
  } = useFileUpload();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isCropped, setIsCropped] = useState<boolean>(false);

  const ref = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLButtonElement>(null);

  const [isNSFW, setIsNSFW] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [productLink, setProductLink] = useState("");

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

  const { mutate } = api.post.createPost.useMutation({
    onError: (e) => handleErrors({ e, message: "Failed to create post" }),
    onSuccess: async (result) => {
      await axios.put(result.res, file);
      await ctx.post.getPostsAllTypes.refetch();
      ref2.current?.click();
      toast.success("Post created successfully");
      router.push(`/profile`);
      resetForm();
    },
  });

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixelsState(croppedAreaPixels);
    },
    [],
  );

  const handleSubmit = useCallback(async () => {
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
      setIsCropped(true);

      mutate({ type, caption, tags, productLink });
    } catch (e) {
      console.error(e);
    }
  }, [
    croppedAreaPixelsState,
    isNSFW,
    caption,
    tags,
    productLink,
    type,
    mutate,
  ]);

  const resetForm = useCallback(() => {
    setFile(null);
    setFileUrl(null);
    setType("OUTFIT");
    setCaption("");
    setTags([]);
    setProductLink("");
    setCrop({ x: 0, y: 0 });
    setRotation(0);
    setZoom(1);
    setCroppedAreaPixelsState(null);
    setIsCropped(false);
    setIsNSFW(false);
  }, [setFile, setFileUrl]);

  return (
    <BaseModal>
      <BaseModalTrigger ref={ref2}>
        <Button
          aria-label="Post Button"
          className="px-3 md:px-6"
          iconLeft={<PiPlus />}
        >
          <span className="hidden sm:inline">Post</span>
        </Button>
      </BaseModalTrigger>
      <BaseModalContent>
        <BaseModalTitle>Create Post</BaseModalTitle>
        <BaseModalDescription>
          Upload an image of your clothes to share with the community.
        </BaseModalDescription>

        <div className="flex flex-wrap md:flex-nowrap gap-3 justify-center mt-1 md:mt-0 mb-3 overflow-y-scroll">
          <div className="flex flex-col gap-3">
            <div className="relative w-[244.4px] h-[400px]">
              {fileUrl ? (
                <Cropper
                  image={fileUrl}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={176 / 288}
                  cropSize={{ width: 244.4, height: 400 }}
                  classes={{ containerClassName: "bg-hover rounded-xl" }}
                  showGrid={true}
                  onCropChange={setCrop}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              ) : (
                <div
                  onDragEnter={handleDrag}
                  onPaste={handlePaste}
                  className="relative w-full h-full"
                >
                  <Input
                    ref={ref}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleChange}
                  />
                  {dragActive && (
                    <div
                      className="absolute w-full h-full t-0 r-0 b-0 l-0"
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    />
                  )}
                  <button
                    onClick={() => ref.current?.click()}
                    type="button"
                    className="w-full h-full bg-white dark:bg-black border hover:bg-stroke border-stroke gap-2 flex items-center justify-center font-bold flex-col text-sm rounded-xl"
                  >
                    <PiPlus className="w-8 h-8 text-secondary-text" />
                    <p className="text-secondary-text font-clash">
                      Upload, Drop or Paste
                    </p>
                  </button>
                </div>
              )}
            </div>
            <Input
              type="range"
              value={zoom}
              step={0.1}
              min={0.4}
              max={3}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(e.target.valueAsNumber)}
              className="w-full h-2 bg-gray-200 rounded-xl mb-3 appearance-none cursor-pointer dark:bg-gray-700 accent-black dark:accent-white"
            />
          </div>

          <div className="flex flex-col gap-3 w-full md:w-fit">
            <h1 className="font-clash font-bold text-xl pt-0">Post Details</h1>
            <div className="relative w-full">
              <Select
                value={type}
                onValueChange={(value) => setType(value as PostType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a post type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PostType.OUTFIT}>
                    {getPostTypeName("OUTFIT")}
                  </SelectItem>
                  <SelectItem value={PostType.HEADWEAR}>
                    {getPostTypeName("HEADWEAR")}
                  </SelectItem>
                  <SelectItem value={PostType.SHOES}>
                    {getPostTypeName("SHOES")}
                  </SelectItem>
                  <SelectItem value={PostType.HOODIE}>
                    {getPostTypeName("HOODIE")}
                  </SelectItem>
                  <SelectItem value={PostType.PANTS}>
                    {getPostTypeName("PANTS")}
                  </SelectItem>
                  <SelectItem value={PostType.SHIRT}>
                    {getPostTypeName("SHIRT")}
                  </SelectItem>
                  <SelectItem value={PostType.WATCH}>
                    {getPostTypeName("WATCH")}
                  </SelectItem>
                  <SelectItem value={PostType.GLASSES}>
                    {getPostTypeName("GLASSES")}
                  </SelectItem>
                  <SelectItem value={PostType.JEWELRY}>
                    {getPostTypeName("JEWELRY")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea
              placeholder="Write a caption... (optional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 resize-none"
            />
            <UserTagInput
              value={tags}
              onChange={setTags}
              placeholder="Tag people... (optional)"
            />
            <Input
              type="url"
              placeholder="Product link (optional)"
              value={productLink}
              onChange={(e) => setProductLink(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
            />
          </div>
        </div>

        <div className="w-full flex gap-2 items-center">
          <Button
            centerItems
            onClick={resetForm}
            disabled={!fileUrl}
            variant={"outline-ghost"}
          >
            Clear
          </Button>
          <Button
            centerItems
            onClick={handleSubmit}
            disabled={!fileUrl || isChecking || isNSFW}
            className="disabled:cursor-not-allowed disabled:opacity-75"
          >
            {isChecking ? "Loading..." : "Post"}
          </Button>
        </div>
        {isNSFW && (
          <p className="text-red-500 mt-2">
            NSFW content detected. Please choose a different image.
          </p>
        )}
      </BaseModalContent>
    </BaseModal>
  );
}
