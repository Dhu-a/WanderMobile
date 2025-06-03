import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleare";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useStore = create(
    persist(
        (set) => ({
            isEnabledView: false,
            toggleIsEnableView: () =>
                set((state) => ({ isEnabledView: !state.isEnabledView})),
        }),
        {
            name: "WanderWish-config",
            storage: createJSONStorage(()  => AsyncStorage),
        }
    )
);
