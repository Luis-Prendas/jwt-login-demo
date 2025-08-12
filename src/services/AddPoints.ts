const BASE_URL = import.meta.env.VITE_API_URL;

export async function addPoints(token: string, points: number): Promise<string | null> {
  const response = await fetch(`${BASE_URL}/add-points`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ points })
  });

  if (!response.ok) {
    throw new Error('Failed to add points');
  }

  return response.json();
}
