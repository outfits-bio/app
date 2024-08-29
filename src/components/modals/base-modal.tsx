import React from "react";
import { useMediaQuery } from "../../hooks/use-media-query.hook";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export interface BaseModalProps {
  children?: React.ReactNode;
  open?: boolean;
  className?: string;
  ref?: React.RefObject<HTMLButtonElement>;
}

export const BaseModal = ({ children, open }: BaseModalProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return <Dialog {...(open !== undefined ? { open } : {})}>{children}</Dialog>;
  } else {
    return <Drawer>{children}</Drawer>;
  }
};

BaseModal.displayName = "BaseModal";

export const BaseModalClose = ({ children }: BaseModalProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return <DialogClose>{children}</DialogClose>;
  } else {
    return <DrawerClose>{children}</DrawerClose>;
  }
};

BaseModalClose.displayName = "BaseModalClose";

export const BaseModalTrigger = React.forwardRef<
  HTMLButtonElement,
  BaseModalProps
>(({ children, className }: BaseModalProps, ref) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <DialogTrigger className={className} ref={ref} asChild>
        {children}
      </DialogTrigger>
    );
  } else {
    return (
      <DrawerTrigger className={className} ref={ref} asChild>
        {children}
      </DrawerTrigger>
    );
  }
});

BaseModalTrigger.displayName = "BaseModalTrigger";

export const BaseModalContent = ({ children, className }: BaseModalProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return <DialogContent>{children}</DialogContent>;
  } else {
    return (
      <DrawerContent
        className={"max-h-screen px-4 outline-none p-mobile " + className}
      >
        {children}
      </DrawerContent>
    );
  }
};

BaseModalContent.displayName = "BaseModalContent";

export const BaseModalHeader = ({ children }: BaseModalProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return <DialogHeader>{children}</DialogHeader>;
  } else {
    return <DrawerHeader>{children}</DrawerHeader>;
  }
};

BaseModalHeader.displayName = "BaseModalHeader";

export const BaseModalFooter = ({ children, className }: BaseModalProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return <DialogFooter className={className}>{children}</DialogFooter>;
  } else {
    return (
      <DrawerFooter className={"px-0 " + className}>{children}</DrawerFooter>
    );
  }
};

BaseModalFooter.displayName = "BaseModalFooter";

export const BaseModalTitle = ({ children }: BaseModalProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <DialogTitle className="font-clash font-semibold">{children}</DialogTitle>
    );
  } else {
    return (
      <DrawerTitle className="font-clash font-semibold">{children}</DrawerTitle>
    );
  }
};

BaseModalTitle.displayName = "BaseModalTitle";

export const BaseModalDescription = ({ children }: BaseModalProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return <DialogDescription>{children}</DialogDescription>;
  } else {
    return <DrawerDescription>{children}</DrawerDescription>;
  }
};

BaseModalDescription.displayName = "BaseModalDescription";
