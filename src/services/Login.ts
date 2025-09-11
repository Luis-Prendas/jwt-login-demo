import type { LoginResponse, LoginForm } from "../types/UserManagement";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:6969';

export async function sessionLogin(data: LoginForm): Promise<LoginResponse> {
  try {
    const response = await fetch(`${BASE_URL}/api/session/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res: LoginResponse = await response.json();

    if (res.error) {
      throw new Error(res.error!);
    }

    return res
  } catch (error) {
    console.error(`❌ Error en userLogin: ${(error as Error).message}`);
    return { token: null, error: (error as Error).message }
  }
}