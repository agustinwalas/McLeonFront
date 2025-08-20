'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { CirclePlus, FileX } from 'lucide-react';

interface SheetTemplateProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  buttonLabel: string;
  description: string;
  onlyText?: boolean;
  isDelete?: boolean;
  hideButton?: boolean;
}

export function SheetTemplate({
  children,
  open,
  isDelete,
  onOpenChange = () => {},
  title,
  buttonLabel,
  onlyText,
  description,
  hideButton = false,
}: SheetTemplateProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {!hideButton && (
        <SheetTrigger asChild>
          {onlyText ? (
            <span className="cursor-pointer text-blue-500 hover:underline">{buttonLabel}</span>
          ) : (
            <Button className="mt-3 primary">
              {buttonLabel} {isDelete ? <FileX /> : <CirclePlus />}
            </Button>
          )}
        </SheetTrigger>
      )}
      <SheetContent className='overflow-scroll' side="left">
        <SheetHeader className="mb-4">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
