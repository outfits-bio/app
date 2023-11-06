import { ChangeEvent, DragEvent, useState } from 'react';

export const useFileUpload = () => {
    const [dragActive, setDragActive] = useState<boolean>(false);
    const [file, setFile] = useState<File | Blob | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [cropModalOpen, setCropModalOpen] = useState<boolean>(false);

    const handleDrag = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (!e.dataTransfer?.files?.length) return;

        setFile(e.dataTransfer.files[0] ?? null);

        if (e.dataTransfer.files[0])
            setFileUrl(URL.createObjectURL(e.dataTransfer.files[0]));

        setCropModalOpen(true);
    };

    /**
   * This opens the crop modal and sets the file and fileUrl
   * This only fires when the user clicks on the "Create new" button, not when the user drags and drops
   */
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        processFile(e.target.files[0]);
    }

    const processFile = (file: File) => {
        setFile(file);
        setFileUrl(URL.createObjectURL(file));
        setCropModalOpen(true);
    };


    return { handleChange, dragActive, file, fileUrl, handleDrag, handleDrop, setFile, setFileUrl, cropModalOpen, setCropModalOpen };
}
