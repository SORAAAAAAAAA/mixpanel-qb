import { create } from "zustand";
import { BuilderStore } from "@/types/builder";

export const useBuilderStore = create<BuilderStore>((set) => ({
  isVisible: false,
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
  setVisibility: (visible) => set({ isVisible: visible }),
}));