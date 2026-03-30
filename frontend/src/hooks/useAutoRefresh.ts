import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchAll, DashboardData } from '../api';

interface UseAutoRefreshResult {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refreshing: boolean;
}

export function useAutoRefresh(intervalMs = 60_000): UseAutoRefreshResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async (isInitial = false) => {
    if (!isInitial) setRefreshing(true);
    try {
      const result = await fetchAll();
      setData(result);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refresh(true);

    intervalRef.current = setInterval(() => {
      refresh(false);
    }, intervalMs);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [refresh, intervalMs]);

  return { data, loading, error, lastUpdated, refreshing };
}
