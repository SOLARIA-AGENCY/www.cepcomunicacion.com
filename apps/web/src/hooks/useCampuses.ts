/**
 * useCampuses Hook
 *
 * Custom hook for fetching campuses
 */

import { useState, useEffect } from 'react';
import { api } from '@api/client';
import type { Campus, LoadingState } from '@types/index';

export function useCampuses() {
  const [state, setState] = useState<LoadingState<Campus[]>>({
    status: 'idle',
    data: null,
    error: null,
  });

  useEffect(() => {
    const fetchCampuses = async () => {
      setState({ status: 'loading', data: null, error: null });

      try {
        const response = await api.campuses.getAll();
        setState({
          status: 'success',
          data: response.docs,
          error: null,
        });
      } catch (error) {
        setState({
          status: 'error',
          data: null,
          error: error instanceof Error ? error.message : 'Failed to fetch campuses',
        });
      }
    };

    fetchCampuses();
  }, []);

  return state;
}
