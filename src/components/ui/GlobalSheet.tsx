// src/components/ui/GlobalSheet.tsx

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSheetStore } from "@/store/useSheet";

export const GlobalSheet = () => {
  const { isOpen, title, description, content, closeSheet } = useSheetStore();

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="p-4">{content}</div>
      </SheetContent>
    </Sheet>
  );
};
