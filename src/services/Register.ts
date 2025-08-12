import type { RegisterData } from "../types/UserManagement";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:6666';

export async function userRegister(data: RegisterData): Promise<string | null> {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const { token } = await response.json();
    return token;
  } catch (error) {
    console.error(`❌ Error en userRegister: ${error}`);
    return null;
  }
}
