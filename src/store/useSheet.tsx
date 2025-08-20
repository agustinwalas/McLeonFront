// src/hooks/useSheet.tsx
import { create } from "zustand";
import { ReactNode } from "react";

interface SheetState {
  isOpen: boolean;
  title: string;
  description: string;
  content: ReactNode;
  openSheet: (title: string, description: string, content: ReactNode) => void;
  closeSheet: () => void;
}

export const useSheetStore = create<SheetState>((set) => ({
  isOpen: false,
  title: "",
  description: "",
  content: null,
  openSheet: (title, description, content) =>
    set({ isOpen: true, title, description, content }),
  closeSheet: () => set({ isOpen: false }),
}));
