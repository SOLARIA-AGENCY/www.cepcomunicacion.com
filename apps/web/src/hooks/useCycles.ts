/**
 * useCycles Hook
 *
 * Custom hook for fetching cycles
 */

import { useState, useEffect } from 'react';
import { api } from '@api/client';
import type { Cycle, LoadingState } from '../types';

export function useCycles() {
  const [state, setState] = useState<LoadingState<Cycle[]>>({
    status: 'idle',
    data: null,
    error: null,
  });

  useEffect(() => {
    const fetchCycles = async () => {
      setState({ status: 'loading', data: null, error: null });

      try {
        const response = await api.cycles.getAll();
        setState({
          status: 'success',
          data: response.docs,
          error: null,
        });
      } catch (error) {
        setState({
          status: 'error',
          data: null,
          error: error instanceof Error ? error.message : 'Failed to fetch cycles',
        });
      }
    };

    fetchCycles();
  }, []);

  return state;
}
