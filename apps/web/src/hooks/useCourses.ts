/**
 * useCourses Hook
 *
 * Custom hook for fetching courses with filtering
 */

import { useState, useEffect } from 'react';
import { api } from '@api/client';
import type { Course, CourseFilters, LoadingState } from '@types/index';

export function useCourses(filters?: CourseFilters) {
  const [state, setState] = useState<LoadingState<Course[]>>({
    status: 'idle',
    data: null,
    error: null,
  });

  useEffect(() => {
    const fetchCourses = async () => {
      setState({ status: 'loading', data: null, error: null });

      try {
        const params: Record<string, any> = {
          'where[active][equals]': true,
          limit: 100,
        };

        // Add filters if provided
        if (filters?.cycle) {
          params['where[cycle][equals]'] = filters.cycle;
        }
        if (filters?.campus) {
          params['where[campuses][contains]'] = filters.campus;
        }
        if (filters?.modality) {
          params['where[modality][equals]'] = filters.modality;
        }
        if (filters?.featured !== undefined) {
          params['where[featured][equals]'] = filters.featured;
        }
        if (filters?.search) {
          params['where[or][0][title][contains]'] = filters.search;
          params['where[or][1][description][contains]'] = filters.search;
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
  }, [filters?.cycle, filters?.campus, filters?.modality, filters?.featured, filters?.search]);

  return state;
}

/**
 * useCourse Hook
 *
 * Fetch single course by slug
 */
export function useCourse(slug: string) {
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
