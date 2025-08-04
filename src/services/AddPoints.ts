export async function addPoints(token: string, points: number) {
  const response = await fetch('http://localhost:4000/add-points', {
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
