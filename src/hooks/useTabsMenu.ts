import { useAsideMenuOptionsStore } from "../storage/useAsideMenuOptionsStore";

export function useTabsMenu() {
  const { tabs, selectedTab, fetchTabs, setSelectedTab } = useAsideMenuOptionsStore();

  return {
    tabs,
    selectedTab,
    fetchTabs,
    setSelectedTab,
  };
}
