/**
 * useCourses Hook
 *
 * Custom hook for fetching courses with filtering
 */

import { useState, useEffect, useMemo } from 'react';
import { api } from '@api/client';
import type { Course, CourseFilters, LoadingState } from '@types/index';

export function useCourses(filters?: CourseFilters): LoadingState<Course[]> {
  const [state, setState] = useState<LoadingState<Course[]>>({
    status: 'idle',
    data: null,
    error: null,
  });

  // Memoize filters to prevent unnecessary re-fetches
  // Only re-compute when individual filter values change
  const memoizedFilters = useMemo(
    () => filters,
    [
      filters?.cycle,
      filters?.campus,
      filters?.modality,
      filters?.featured,
      filters?.search,
    ]
  );

  useEffect(() => {
    const fetchCourses = async () => {
      setState({ status: 'loading', data: null, error: null });

      try {
        const params: Record<string, any> = {
          'where[active][equals]': true,
          limit: 100,
        };

        // Add filters if provided
        if (memoizedFilters?.cycle) {
          params['where[cycle][equals]'] = memoizedFilters.cycle;
        }
        if (memoizedFilters?.campus) {
          params['where[campuses][contains]'] = memoizedFilters.campus;
        }
        if (memoizedFilters?.modality) {
          params['where[modality][equals]'] = memoizedFilters.modality;
        }
        if (memoizedFilters?.featured !== undefined) {
          params['where[featured][equals]'] = memoizedFilters.featured;
        }
        if (memoizedFilters?.search) {
          params['where[or][0][title][contains]'] = memoizedFilters.search;
          params['where[or][1][description][contains]'] = memoizedFilters.search;
        }

        const response = await api.courses.getAll(params);

        setState({
          status: 'success',
          data: response.docs,
          error: null,
        });
      } catch (error) {
        setState({
          status: 'error',
          data: null,
          error: error instanceof Error ? error.message : 'Failed to fetch courses',
        });
      }
    };

    fetchCourses();
  }, [memoizedFilters]);

  return state;
}

/**
 * useCourse Hook
 *
 * Fetch single course by slug
 */
export function useCourse(slug: string): LoadingState<Course> {
  const [state, setState] = useState<LoadingState<Course>>({
    status: 'idle',
    data: null,
    error: null,
  });

  useEffect(() => {
    if (!slug) return;

    const fetchCourse = async () => {
      setState({ status: 'loading', data: null, error: null });

      try {
        const response = await api.courses.getBySlug(slug);
        setState({
          status: 'success',
          data: response,
          error: null,
        });
      } catch (error) {
        setState({
          status: 'error',
          data: null,
          error: error instanceof Error ? error.message : 'Failed to fetch course',
        });
      }
    };

    fetchCourse();
  }, [slug]);

  return state;
}
