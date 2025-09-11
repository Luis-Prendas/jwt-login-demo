import type { TBL_Organization } from "../types/UserManagement";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:6969';

export async function getAllOrgService(token: string): Promise<TBL_Organization[] | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/organization/getAllOrg`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch all org info');
    }

    const data = await response.json();
    return data.data
  } catch (error) {
    console.error(`❌ Error en getAllOrgService: ${error}`);
    return null;
  }
}