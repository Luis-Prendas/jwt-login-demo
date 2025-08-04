const BASE_URL = 'http://localhost:4000';

export async function userInfo(token: string): Promise<any> {
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