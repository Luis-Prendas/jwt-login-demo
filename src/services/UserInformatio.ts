import type { TBL_Badge, UserBasicData } from "../types/UserManagement";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:6969';

export async function getUserService(id: string, token: string): Promise<UserBasicData | null> {
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

export async function gerAllUsersService(token: string): Promise<UserBasicData[] | null> {
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

export async function updateUserService(userData: UserBasicData, token: string, id: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/api/user/updateUser/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to update user info');
    }

    return true;
  } catch (error) {
    console.error(`❌ Error en updateUserInfo: ${error}`);
    return false;
  }
}

export async function getUserBadgesService(id: string, token: string): Promise<TBL_Badge[] | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/badge/getUserBadges/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user badges');
    }

    const data = await response.json();
    return data.badges;
  } catch (error) {
    console.error(`❌ Error en getUserBadges: ${error}`);
    return null;
  }
}