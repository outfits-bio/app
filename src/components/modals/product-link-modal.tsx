import { useState } from "react";
import {
  BaseModal,
  BaseModalContent,
  BaseModalDescription,
  BaseModalTitle,
  BaseModalTrigger,
} from "./base-modal";
import { Button } from "../ui/Button";

interface ProductLinkModalProps {
  link: string;
  children: React.ReactNode;
}

export function ProductLinkModal({ link, children }: ProductLinkModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenLink = () => {
    window.open(link.startsWith("http") ? link : `https://${link}`, "_blank");
    setIsOpen(false);
  };

  return (
    <BaseModal>
      <BaseModalTrigger>{children}</BaseModalTrigger>
      <BaseModalContent>
        <BaseModalTitle>External Link</BaseModalTitle>
        <BaseModalDescription>
          You are about to leave the website. Are you sure you want to continue?
          This link is user-input and may contain malicious content or not be
          safe.
        </BaseModalDescription>
        <p className="mt-2 mb-4">
          <strong>Destination:</strong> {link}
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleOpenLink}>Continue</Button>
        </div>
      </BaseModalContent>
    </BaseModal>
  );
}
