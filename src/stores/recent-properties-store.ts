import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecentPropertiesState {
    recentPropertyIds: string[];
    addRecentProperty: (propertyId: string) => void;
    clearRecents: () => void;
}

const MAX_RECENTS = 10;

export const useRecentPropertiesStore = create<RecentPropertiesState>()(
    persist(
        (set) => ({
            recentPropertyIds: [],

            addRecentProperty: (propertyId: string) =>
                set((state) => {
                    // Remove if already exists (to move to front)
                    const filtered = state.recentPropertyIds.filter(id => id !== propertyId);
                    // Add to front, limit to MAX_RECENTS
                    return {
                        recentPropertyIds: [propertyId, ...filtered].slice(0, MAX_RECENTS),
                    };
                }),

            clearRecents: () => set({ recentPropertyIds: [] }),
        }),
        {
            name: "recent-properties-storage",
        }
    )
);
