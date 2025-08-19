import type { LoginResponse, UserLogin } from "../types/UserManagement";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4040';

export async function userLogin(data: UserLogin): Promise<LoginResponse> {
  try {
    const response = await fetch(`${BASE_URL}/api/sessions/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res: LoginResponse = await response.json();

    if (!response.ok) {
      throw new Error(res.error!);
    }

    return res
  } catch (error) {
    console.error(`❌ Error en userLogin: ${(error as Error).message}`);
    return { token: null, error: (error as Error).message }
  }
}