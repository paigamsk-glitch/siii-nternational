import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SavedPassenger {
  id: string;
  name: string;
  age: string;
  gender: "Male" | "Female" | "Other";
  addedAt: number;
}

interface PassengerStoreState {
  passengers: SavedPassenger[];
  addPassenger: (p: Omit<SavedPassenger, "id" | "addedAt">) => void;
  removePassenger: (id: string) => void;
  updatePassenger: (id: string, p: Partial<Omit<SavedPassenger, "id" | "addedAt">>) => void;
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export const usePassengerStore = create<PassengerStoreState>()(
  persist(
    (set) => ({
      passengers: [],
      addPassenger: (p) =>
        set((s) => ({
          passengers: [
            ...s.passengers,
            { ...p, id: uid(), addedAt: Date.now() },
          ],
        })),
      removePassenger: (id) =>
        set((s) => ({ passengers: s.passengers.filter((p) => p.id !== id) })),
      updatePassenger: (id, updates) =>
        set((s) => ({
          passengers: s.passengers.map((p) =>
            p.id === id ? { ...p, ...updates } : p,
          ),
        })),
    }),
    { name: "s-intl-saved-passengers" },
  ),
);
