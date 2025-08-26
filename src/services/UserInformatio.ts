import type { UserBasicData } from "../types/UserManagement";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:6969';

export async function gerUser(id: string, token: string): Promise<UserBasicData | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/user/getUser/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error(`❌ Error en getUserInfo: ${error}`);
    return null;
  }
}

export async function gerAllUsers(token: string): Promise<UserBasicData[] | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/user/getAllUsers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch all users info');
    }

    const data = await response.json();
    return data.users;
  } catch (error) {
    console.error(`❌ Error en allUsersInfo: ${error}`);
    return null;
  }
}
