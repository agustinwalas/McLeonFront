"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDialogStore } from "@/store/useDialog";

export function GlobalDialog() {
  const {
    isOpen,
    title,
    description,
    content,
    closeDialog,
  } = useDialogStore();


  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-[500px]">
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
        )}

        {content && <div className="py-0">{content}</div>}

      </DialogContent>
    </Dialog>
  );
}
