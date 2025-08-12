import type { UserLogin } from "../types/UserManagement";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4040';

export async function userLogin(data: UserLogin): Promise<string | null> {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const { token } = await response.json();
    return token;
  } catch (error) {
    console.error(`❌ Error en userLogin: ${error}`);
    return null;
  }
}