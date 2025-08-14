import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { TabMenuOption } from "../types/UserManagement";
import { allUserTabsMenu } from "../services/TabsMenu";

interface AsideMenuOptionsState {
  userTabs: TabMenuOption[] | null;
  userSelectedTab: TabMenuOption | null;

  fetchUserTabs: (token: string) => Promise<void>;
  setUserSelectedTab: (tabId: string) => void;
}

export const useAsideMenuOptionsStore = create<AsideMenuOptionsState>()(
  persist(
    (set) => ({
      userTabs: null,
      userSelectedTab: null,

      fetchUserTabs: async (token) => {
        const fetchedUserTabs = await allUserTabsMenu(token);
        set({ userTabs: fetchedUserTabs });
      },

      setUserSelectedTab: (tabId) => {
        set((state) => ({
          userSelectedTab: state.userTabs?.find((tab) => tab.uuid === tabId) || null,
        }));
      }

    }),
    {
      name: "aside-menu-options-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        userTabs: state.userTabs,
        userSelectedTab: state.userSelectedTab,
        fetchUserTabs: state.fetchUserTabs,
        setUserSelectedTab: state.setUserSelectedTab,
      }),
    }
  )
);
