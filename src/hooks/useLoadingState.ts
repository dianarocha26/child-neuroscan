import { useState } from 'react';

export interface LoadingState {
  loading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export function useLoadingState(initialLoading = true): LoadingState {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  return {
    loading,
    error,
    setLoading,
    setError,
    clearError,
  };
}
