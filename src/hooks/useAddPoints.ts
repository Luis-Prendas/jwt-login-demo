import { useState } from "react";
import { useAuth } from "./useAuth";
import { addPoints } from "../services/AddPoints";

export function useAddPoints() {
  const { isAuthenticated, token, fetchUserData } = useAuth();
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

      if (!response || response.error) {
        throw new Error(response?.error || 'Failed to add points');
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
