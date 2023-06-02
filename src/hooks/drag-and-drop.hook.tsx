import { DragEvent, useState } from 'react';

export const useDragAndDrop = () => {
    const [dragActive, setDragActive] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);
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

    return { dragActive, file, fileUrl, handleDrag, handleDrop, setFile, setFileUrl, cropModalOpen, setCropModalOpen };
}
