import { addPoints } from '../services/AddPoints';
import { useState } from 'react';
import { useAuthStore } from '../storage/cstorage';

export function useAddPoints() {
  const token = useAuthStore(state => state.token);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const fetchUserData = useAuthStore(state => state.fetchUserData);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPointsUser = async (points: number): Promise<void> => {
    if (!isAuthenticated) {
      setError('User not authenticated');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await addPoints(token!, points);

      if (!response) {
        throw new Error('Failed to add points');
      }

      await fetchUserData();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { addPointsUser, loading, error };
}
