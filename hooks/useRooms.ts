import { useState, useEffect, useCallback } from "react";
import { getRooms, Room } from "@/lib/firestore/rooms";

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getRooms();
      setRooms(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return { rooms, loading, error, refetch: fetchRooms };
}
