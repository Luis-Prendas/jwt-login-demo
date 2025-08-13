import type { TabMenuOption } from "../types/UserManagement";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4040';

export async function allTabsMenu(token: string): Promise<TabMenuOption[] | null> {
  try {
    const response = await fetch(`${BASE_URL}/tabs-menu`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch tabs");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tabs:", error);
    return null;
  }
}
