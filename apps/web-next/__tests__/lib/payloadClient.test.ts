/**
 * Test Suite for PayloadClient
 *
 * Comprehensive tests for Payload CMS REST API client.
 * Coverage target: >= 80%
 *
 * @see apps/web-next/lib/payloadClient.ts
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PayloadClient, payloadClient } from '@/lib/payloadClient';

// Mock fetch globally
global.fetch = vi.fn();

describe('PayloadClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should use default baseUrl when not provided', () => {
      const client = new PayloadClient();
      expect(client).toBeInstanceOf(PayloadClient);
    });

    it('should use provided baseUrl', () => {
      const client = new PayloadClient('http://custom-url:4000');
      expect(client).toBeInstanceOf(PayloadClient);
    });

    it('should export singleton instance', () => {
      expect(payloadClient).toBeInstanceOf(PayloadClient);
    });
  });

  describe('find() method - Success cases', () => {
    it('should fetch collection with basic query', async () => {
      const mockResponse = {
        docs: [{ id: 1, name: 'Test Course' }],
        totalDocs: 1,
        limit: 10,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await payloadClient.find('courses', { limit: 10 });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/courses'),
        expect.objectContaining({
          method: 'GET',
          cache: 'no-store',
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should return docs array', async () => {
      const mockDocs = [
        { id: 1, name: 'Course 1' },
        { id: 2, name: 'Course 2' },
      ];
      const mockResponse = {
        docs: mockDocs,
        totalDocs: 2,
        limit: 10,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await payloadClient.find('courses', {});

      expect(result.docs).toEqual(mockDocs);
      expect(result.docs).toHaveLength(2);
    });

    it('should construct correct query params with where filter', async () => {
      const mockResponse = {
        docs: [],
        totalDocs: 0,
        limit: 10,
        page: 1,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const whereFilter = {
        featured: { equals: true },
        active: { equals: true },
      };

      await payloadClient.find('courses', { where: whereFilter });

      const callUrl = (global.fetch as any).mock.calls[0][0];
      expect(callUrl).toContain('where=');
      expect(callUrl).toContain(encodeURIComponent(JSON.stringify(whereFilter)));
    });

    it('should handle limit parameter', async () => {
      const mockResponse = {
        docs: [],
        totalDocs: 0,
        limit: 5,
        page: 1,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await payloadClient.find('courses', { limit: 5 });

      const callUrl = (global.fetch as any).mock.calls[0][0];
      expect(callUrl).toContain('limit=5');
    });

    it('should handle depth parameter', async () => {
      const mockResponse = {
        docs: [],
        totalDocs: 0,
        limit: 10,
        page: 1,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await payloadClient.find('courses', { depth: 3 });

      const callUrl = (global.fetch as any).mock.calls[0][0];
      expect(callUrl).toContain('depth=3');
    });

    it('should handle sort parameter', async () => {
      const mockResponse = {
        docs: [],
        totalDocs: 0,
        limit: 10,
        page: 1,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await payloadClient.find('courses', { sort: '-createdAt' });

      const callUrl = (global.fetch as any).mock.calls[0][0];
      expect(callUrl).toContain('sort=-createdAt');
    });

    it('should handle multiple query parameters', async () => {
      const mockResponse = {
        docs: [],
        totalDocs: 0,
        limit: 3,
        page: 1,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await payloadClient.find('courses', {
        where: { featured: { equals: true } },
        limit: 3,
        depth: 2,
        sort: '-createdAt',
      });

      const callUrl = (global.fetch as any).mock.calls[0][0];
      expect(callUrl).toContain('where=');
      expect(callUrl).toContain('limit=3');
      expect(callUrl).toContain('depth=2');
      expect(callUrl).toContain('sort=-createdAt');
    });

    it('should work with empty options object', async () => {
      const mockResponse = {
        docs: [],
        totalDocs: 0,
        limit: 10,
        page: 1,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await payloadClient.find('courses', {});

      const callUrl = (global.fetch as any).mock.calls[0][0];
      expect(callUrl).toBe('http://cms:3000/api/courses');
    });

    it('should handle complex where filters', async () => {
      const mockResponse = {
        docs: [],
        totalDocs: 0,
        limit: 10,
        page: 1,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const complexWhere = {
        slug: { equals: 'desarrollo-web' },
        active: { equals: true },
        modality: { in: ['presencial', 'online'] },
      };

      await payloadClient.find('courses', { where: complexWhere });

      const callUrl = (global.fetch as any).mock.calls[0][0];
      expect(callUrl).toContain('where=');
      expect(callUrl).toContain(encodeURIComponent(JSON.stringify(complexWhere)));
    });
  });

  describe('find() method - Error handling', () => {
    it('should throw on 404 error', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(payloadClient.find('courses', {})).rejects.toThrow(
        'Failed to fetch courses: 404 Not Found'
      );
    });

    it('should throw on 500 error', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(payloadClient.find('courses', {})).rejects.toThrow(
        'Failed to fetch courses: 500 Internal Server Error'
      );
    });

    it('should include collection name in error', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
      });

      await expect(payloadClient.find('cycles', {})).rejects.toThrow(
        'Failed to fetch cycles: 403 Forbidden'
      );
    });

    it('should include status code in error', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      await expect(payloadClient.find('courses', {})).rejects.toThrow('401');
    });

    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(
        new Error('Network request failed')
      );

      await expect(payloadClient.find('courses', {})).rejects.toThrow(
        'Network request failed'
      );
    });

    it('should include URL in error message for debugging', async () => {
      (global.fetch as any).mockRejectedValueOnce(
        new Error('Connection refused')
      );

      await expect(payloadClient.find('courses', { limit: 5 })).rejects.toThrow(
        /URL: http:\/\/cms:3000\/api\/courses/
      );
    });
  });

  describe('findByID() method - Success cases', () => {
    it('should fetch single document by numeric ID', async () => {
      const mockCourse = { id: 1, name: 'Test Course', slug: 'test-course' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCourse,
      });

      const result = await payloadClient.findByID('courses', 1, 2);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/courses/1?depth=2'),
        expect.any(Object)
      );
      expect(result).toEqual(mockCourse);
    });

    it('should fetch single document by string ID', async () => {
      const mockCourse = { id: 'abc123', name: 'Test Course' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCourse,
      });

      const result = await payloadClient.findByID('courses', 'abc123', 1);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/courses/abc123?depth=1'),
        expect.any(Object)
      );
      expect(result).toEqual(mockCourse);
    });

    it('should handle depth parameter', async () => {
      const mockCourse = {
        id: 1,
        name: 'Test Course',
        cycle: { id: 10, name: 'Test Cycle' },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCourse,
      });

      const result = await payloadClient.findByID('courses', 1, 3);

      const callUrl = (global.fetch as any).mock.calls[0][0];
      expect(callUrl).toContain('depth=3');
      expect(result).toEqual(mockCourse);
    });

    it('should use depth=0 by default', async () => {
      const mockCourse = { id: 1, name: 'Test Course' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCourse,
      });

      await payloadClient.findByID('courses', 1);

      const callUrl = (global.fetch as any).mock.calls[0][0];
      expect(callUrl).toContain('depth=0');
    });

    it('should return document directly (not wrapped in response)', async () => {
      const mockCourse = {
        id: 1,
        name: 'Test Course',
        slug: 'test-course',
        active: true,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCourse,
      });

      const result = await payloadClient.findByID('courses', 1);

      // Should return the document directly, not wrapped in { docs: [...] }
      expect(result).toEqual(mockCourse);
      expect(result).not.toHaveProperty('docs');
    });
  });

  describe('findByID() method - Error handling', () => {
    it('should throw on 404 error', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(payloadClient.findByID('courses', 999)).rejects.toThrow(
        'Failed to fetch courses with ID 999: 404 Not Found'
      );
    });

    it('should include ID in error message', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(payloadClient.findByID('courses', 123)).rejects.toThrow(
        'ID 123'
      );
    });

    it('should handle string IDs in error messages', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(
        payloadClient.findByID('courses', 'abc-def-123')
      ).rejects.toThrow('ID abc-def-123');
    });

    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(
        new Error('Connection timeout')
      );

      await expect(payloadClient.findByID('courses', 1)).rejects.toThrow(
        'Connection timeout'
      );
    });

    it('should include URL in error for debugging', async () => {
      (global.fetch as any).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(payloadClient.findByID('courses', 1, 2)).rejects.toThrow(
        /URL: http:\/\/cms:3000\/api\/courses\/1/
      );
    });
  });

  describe('Query parameter construction', () => {
    it('should JSON stringify where filter correctly', async () => {
      const mockResponse = {
        docs: [],
        totalDocs: 0,
        limit: 10,
        page: 1,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const whereFilter = {
        nested: { property: { equals: 'value' } },
      };

      await payloadClient.find('courses', { where: whereFilter });

      const callUrl = (global.fetch as any).mock.calls[0][0];
      const expectedWhere = encodeURIComponent(JSON.stringify(whereFilter));
      expect(callUrl).toContain(expectedWhere);
    });

    it('should concatenate multiple params with &', async () => {
      const mockResponse = {
        docs: [],
        totalDocs: 0,
        limit: 10,
        page: 1,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await payloadClient.find('courses', {
        where: { active: { equals: true } },
        limit: 5,
        depth: 2,
      });

      const callUrl = (global.fetch as any).mock.calls[0][0];
      const params = callUrl.split('?')[1];

      expect(params).toContain('&');
      expect(params.split('&').length).toBeGreaterThanOrEqual(3);
    });

    it('should handle empty options object (no query params)', async () => {
      const mockResponse = {
        docs: [],
        totalDocs: 0,
        limit: 10,
        page: 1,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await payloadClient.find('courses', {});

      const callUrl = (global.fetch as any).mock.calls[0][0];
      expect(callUrl).not.toContain('?');
      expect(callUrl).toBe('http://cms:3000/api/courses');
    });

    it('should handle special characters in where filter', async () => {
      const mockResponse = {
        docs: [],
        totalDocs: 0,
        limit: 10,
        page: 1,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const whereFilter = {
        name: { contains: 'Test & Development' },
      };

      await payloadClient.find('courses', { where: whereFilter });

      const callUrl = (global.fetch as any).mock.calls[0][0];
      expect(callUrl).toContain('where=');
      // Should be properly URL encoded
      expect(callUrl).not.toContain('&Development');
    });
  });

  describe('Integration scenarios', () => {
    it('should handle real-world featured courses query', async () => {
      const mockResponse = {
        docs: [
          {
            id: 1,
            name: 'Desarrollo Web Full Stack',
            featured: true,
            active: true,
            cycle: { id: 10, name: 'DAW' },
          },
        ],
        totalDocs: 1,
        limit: 3,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await payloadClient.find('courses', {
        where: {
          featured: { equals: true },
          active: { equals: true },
        },
        limit: 3,
        depth: 2,
      });

      expect(result.docs).toHaveLength(1);
      expect(result.docs[0].featured).toBe(true);
    });

    it('should handle course detail by slug query', async () => {
      const mockResponse = {
        docs: [
          {
            id: 1,
            slug: 'desarrollo-web',
            name: 'Desarrollo Web',
            cycle: { id: 10, name: 'DAW', code: 'IFCD0110' },
            campuses: [
              { id: 1, name: 'Campus Madrid', city: 'Madrid' },
              { id: 2, name: 'Campus Barcelona', city: 'Barcelona' },
            ],
          },
        ],
        totalDocs: 1,
        limit: 1,
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await payloadClient.find('courses', {
        where: { slug: { equals: 'desarrollo-web' } },
        limit: 1,
        depth: 3,
      });

      expect(result.docs[0].slug).toBe('desarrollo-web');
      expect(result.docs[0].campuses).toHaveLength(2);
    });
  });

  describe('HTTP Headers', () => {
    it('should set Content-Type header on find()', async () => {
      const mockResponse = {
        docs: [],
        totalDocs: 0,
        limit: 10,
        page: 1,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await payloadClient.find('courses', {});

      const headers = (global.fetch as any).mock.calls[0][1].headers;
      expect(headers['Content-Type']).toBe('application/json');
    });

    it('should set Content-Type header on findByID()', async () => {
      const mockCourse = { id: 1, name: 'Test' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCourse,
      });

      await payloadClient.findByID('courses', 1);

      const headers = (global.fetch as any).mock.calls[0][1].headers;
      expect(headers['Content-Type']).toBe('application/json');
    });

    it('should use no-store cache strategy', async () => {
      const mockResponse = {
        docs: [],
        totalDocs: 0,
        limit: 10,
        page: 1,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await payloadClient.find('courses', {});

      const cache = (global.fetch as any).mock.calls[0][1].cache;
      expect(cache).toBe('no-store');
    });
  });
});
