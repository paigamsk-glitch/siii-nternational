import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { 
  FlightOffer, 
  HotelListing, 
  HolidayPackage, 
  CreateBookingBodyType 
} from "@workspace/api-client-react";

type BookingItem = FlightOffer | HotelListing | HolidayPackage;

interface BookingState {
  type: CreateBookingBodyType | null;
  item: BookingItem | null;
  searchParams: Record<string, any>;
  setBookingItem: (type: CreateBookingBodyType, item: BookingItem, searchParams?: Record<string, any>) => void;
  clearBookingItem: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      type: null,
      item: null,
      searchParams: {},
      setBookingItem: (type, item, searchParams = {}) => set({ type, item, searchParams }),
      clearBookingItem: () => set({ type: null, item: null, searchParams: {} }),
    }),
    {
      name: "s-international-booking",
    }
  )
);
