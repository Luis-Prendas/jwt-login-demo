import type { LoginResponse, RegisterData } from "../types/UserManagement";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:6969';

export async function userRegister(data: RegisterData): Promise<LoginResponse> {
  try {
    const response = await fetch(`${BASE_URL}/api/session/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const res: LoginResponse = await response.json();

    if (!response.ok) {
      throw new Error(res.error!);
    }

    return res
  } catch (error) {
    console.error(`❌ Error en userRegister: ${(error as Error).message}`);
    return { token: null, error: (error as Error).message }
  }
}
