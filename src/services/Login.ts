const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:6969';

export type LoginForm = {
  username: string,
  password: string,
  organizationCode: string
}

export async function sessionLogin(data: LoginForm): Promise<string | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/session/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to login');
    }

    const res = await response.json();
    return res.token
  } catch (error) {
    console.error(`❌ Error en userLogin: ${(error as Error).message}`);
    return null
  }
}