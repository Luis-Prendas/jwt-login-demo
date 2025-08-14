import { allTabsMenu } from "../services/TabsMenu";
import { useAuthStore } from "../store/cstorage";
import { useAsideMenuOptionsStore } from "../store/useAsideMenuOptionsStore";

export function useTabsMenu() {
  const { userTabs, userSelectedTab, fetchUserTabs, setUserSelectedTab } = useAsideMenuOptionsStore();
  const { token } = useAuthStore();

  const fetchAllTabs = async () => {
    if (!token) return null;
    const tabs = await allTabsMenu(token);
    return tabs;
  }

  return {
    userTabs,
    userSelectedTab,
    fetchAllTabs,
    fetchUserTabs,
    setUserSelectedTab
  };
}
