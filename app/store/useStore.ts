import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Destination {
  id: string;
  name: string;
  description: string;
  location: string;
  imageUrl?: string;
}

export interface ItineraryDay {
  id: string;
  date: string;
  activities: Activity[];
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
  location: string;
}

export interface Photo {
  id: string;
  url: string;
  caption: string;
  date: string;
  location: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface TravelItem {
  id: string;
  name: string;
  category: string;
  isPacked: boolean;
  quantity: number;
  notes?: string;
}

interface TravelStore {
  destinations: Destination[];
  itinerary: ItineraryDay[];
  photos: Photo[];
  expenses: Expense[];
  travelItems: TravelItem[];
  addDestination: (destination: Destination) => void;
  updateDestination: (id: string, destination: Partial<Destination>) => void;
  deleteDestination: (id: string) => void;
  addItineraryDay: (day: ItineraryDay) => void;
  updateItineraryDay: (id: string, day: Partial<ItineraryDay>) => void;
  deleteItineraryDay: (id: string) => void;
  addPhoto: (photo: Photo) => void;
  deletePhoto: (id: string) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addTravelItem: (item: TravelItem) => void;
  updateTravelItem: (id: string, item: Partial<TravelItem>) => void;
  deleteTravelItem: (id: string) => void;
  toggleTravelItemPacked: (id: string) => void;
}

export const useStore = create<TravelStore>()(
  persist(
    (set) => ({
      destinations: [],
      itinerary: [],
      photos: [],
      expenses: [],
      travelItems: [],

      addDestination: (destination) =>
        set((state) => ({
          destinations: [...state.destinations, destination],
        })),

      updateDestination: (id, destination) =>
        set((state) => ({
          destinations: state.destinations.map((d) =>
            d.id === id ? { ...d, ...destination } : d
          ),
        })),

      deleteDestination: (id) =>
        set((state) => ({
          destinations: state.destinations.filter((d) => d.id !== id),
        })),

      addItineraryDay: (day) =>
        set((state) => ({
          itinerary: [...state.itinerary, day],
        })),

      updateItineraryDay: (id, day) =>
        set((state) => ({
          itinerary: state.itinerary.map((d) =>
            d.id === id ? { ...d, ...day } : d
          ),
        })),

      deleteItineraryDay: (id) =>
        set((state) => ({
          itinerary: state.itinerary.filter((d) => d.id !== id),
        })),

      addPhoto: (photo) =>
        set((state) => ({
          photos: [...state.photos, photo],
        })),

      deletePhoto: (id) =>
        set((state) => ({
          photos: state.photos.filter((p) => p.id !== id),
        })),

      addExpense: (expense) =>
        set((state) => ({
          expenses: [...state.expenses, expense],
        })),

      updateExpense: (id, expense) =>
        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === id ? { ...e, ...expense } : e
          ),
        })),

      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),

      addTravelItem: (item) =>
        set((state) => ({
          travelItems: [...state.travelItems, item],
        })),

      updateTravelItem: (id, item) =>
        set((state) => ({
          travelItems: state.travelItems.map((i) =>
            i.id === id ? { ...i, ...item } : i
          ),
        })),

      deleteTravelItem: (id) =>
        set((state) => ({
          travelItems: state.travelItems.filter((i) => i.id !== id),
        })),

      toggleTravelItemPacked: (id) =>
        set((state) => ({
          travelItems: state.travelItems.map((i) =>
            i.id === id ? { ...i, isPacked: !i.isPacked } : i
          ),
        })),
    }),
    {
      name: 'travel-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 