import type { UserData, UserDataWithBadges } from "../types/UserManagement";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4040';

export async function userInfo(token: string): Promise<UserData | null> {
  try {
    const response = await fetch(`${BASE_URL}/user`, {
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
    console.error(`❌ Error en userInfo: ${error}`);
    return null;
  }
}

export async function allUsersInfo(token: string): Promise<UserData[] | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/users/users`, {
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

export async function userInfoWithBadges(token: string, uuid: string): Promise<UserDataWithBadges | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/users/user/${uuid}`, {
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
    console.log(data)
    return data.user;
  } catch (error) {
    console.error(`❌ Error en userInfoWithBadges: ${error}`);
    return null;
  }
}