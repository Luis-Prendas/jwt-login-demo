import type { User } from "@/types";
import type { createUserSchema, updateUserSchema } from "@/types/zod-schemas";
import type z from "zod";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:6969';

export type UpdateUserDto = z.infer<typeof updateUserSchema>
export type CreateUserDto = z.infer<typeof createUserSchema>

export async function getUserService(id: string, token: string): Promise<User | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/user/get/${id}`, {
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
    return data.data;
  } catch (error) {
    console.error(`❌ Error en getUserInfo: ${error}`);
    return null;
  }
}

export async function gerAllUsersService(token: string): Promise<User[] | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/user/getAll`, {
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
    return data.data;
  } catch (error) {
    console.error(`❌ Error en allUsersInfo: ${error}`);
    return null;
  }
}

export async function createUserServide(userData: CreateUserDto, token: string) {
  try {
    const response = await fetch(`${BASE_URL}/api/user/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to create user info');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`❌ Error en createUserServide: ${error}`);
    return false;
  }
}

export async function updateUserService(userData: UpdateUserDto, token: string, id: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/api/user/update/${id}`, {
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

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`❌ Error en updateUserInfo: ${error}`);
    return false;
  }
}

export async function deleteUserService(userData: UpdateUserDto, token: string, id: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/api/user/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to delete user info');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`❌ Error en deleteUserService: ${error}`);
    return false;
  }
}