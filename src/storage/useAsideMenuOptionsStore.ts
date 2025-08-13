import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { TabMenuOption } from "../types/UserManagement";
import { allTabsMenu } from "../services/TabsMenu";

interface AsideMenuOptionsState {
  tabs: TabMenuOption[] | null;
  selectedTab: TabMenuOption | null;

  fetchTabs: (token: string) => Promise<void>;
  setSelectedTab: (tabId: string) => void;
}

export const useAsideMenuOptionsStore = create<AsideMenuOptionsState>()(
  persist(
    (set) => ({
      tabs: null,
      selectedTab: null,

      fetchTabs: async (token) => {
        const fetchedTabs = await allTabsMenu(token);
        set({ tabs: fetchedTabs });
      },

      setSelectedTab: (tabId) => {
        set((state) => ({
          selectedTab: state.tabs?.find((tab) => tab.uuid === tabId) || null,
        }));
      }

    }),
    {
      name: "aside-menu-options-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        tabs: state.tabs,
        selectedTab: state.selectedTab,
        fetchTabs: state.fetchTabs,
        setSelectedTab: state.setSelectedTab,
      }),
    }
  )
);
