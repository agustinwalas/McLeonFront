import { create } from "zustand";
import { ReactNode } from "react";

interface DialogStoreState {
  isOpen: boolean;
  title?: string;
  description?: string;
  content?: ReactNode;

  openDialog: (params: {
    title?: string;
    description?: string;
    content?: ReactNode;
  }) => void;

  closeDialog: () => void;
  setContent: (content: ReactNode) => void;
}

export const useDialogStore = create<DialogStoreState>((set) => ({
  isOpen: false,
  title: "",
  description: "",
  content: null,

  openDialog: ({ title, description, content }) =>
    set({
      isOpen: true,
      title,
      description,
      content,
    }),

  closeDialog: () =>
    set({
      isOpen: false,
      title: "",
      description: "",
      content: null,
    }),

  setContent: (content) => set({ content }),
}));
