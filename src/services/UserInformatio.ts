import type { Assistance, Schedule, UserData, UserDataWithBadges } from "../types/UserManagement";

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

export async function userAssistance(token: string, userUuid: string): Promise<Assistance[] | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/assistance/getAssistance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userUuid }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user assistance');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`❌ Error en userAssistance: ${error}`);
    return null;
  }
}

export async function userSchedule(token: string, userUuid: string): Promise<Schedule[] | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/schedule/getSchedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userUuid }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user schedule');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`❌ Error en userSchedule: ${error}`);
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
    return data;
  } catch (error) {
    console.error(`❌ Error en userInfoWithBadges: ${error}`);
    return null;
  }
}

export async function userUpdate(token: string, userData: UserDataWithBadges): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/api/users/user/${userData.userUuid}`, {
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
    console.error(`❌ Error en userUpdate: ${error}`);
    return false;
  }
}