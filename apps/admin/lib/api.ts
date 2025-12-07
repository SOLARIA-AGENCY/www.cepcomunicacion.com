/**
 * API Client for Payload CMS
 * Handles authentication and API requests
 */

import { PayloadClient } from '@cepcomunicacion/api-client';

// CRITICAL: Do NOT include /api - PayloadClient adds it automatically
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

// Create shared API client instance
export const apiClient = new PayloadClient(API_URL);

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
  token: string;
  exp: number;
}

export interface ApiError {
  errors: Array<{
    message: string;
  }>;
}

/**
 * Login to Payload CMS
 * POST /api/users/login
 *
 * DEVELOPMENT MODE: Allow admin/admin bypass
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  // DEVELOPMENT BYPASS: Allow admin@cepcomunicacion.com/admin123 login without backend
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_ENABLE_DEV_LOGIN === 'true'
  ) {
    if (credentials.email === 'admin@cepcomunicacion.com' && credentials.password === 'admin123') {
      const devUser = {
        id: 'dev-admin',
        email: 'admin@cepcomunicacion.com',
        role: 'admin',
      };

      // Store dev session in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('dev_session', JSON.stringify(devUser));
      }

      return {
        message: 'Login successful (DEV MODE)',
        user: devUser,
        token: 'dev-token-' + Date.now(),
        exp: Date.now() + 86400000, // 24 hours
      };
    }
  }

  // Production authentication via Payload CMS
  try {
    const result = await apiClient.login(credentials.email, credentials.password);

    // Set auth token on client
    apiClient.setAuthToken(result.token);

    return {
      message: 'Login successful',
      user: result.user,
      token: result.token,
      exp: Date.now() + 86400000, // 24 hours
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Login failed');
  }
}

/**
 * Logout from Payload CMS
 * POST /api/users/logout
 */
export async function logout(): Promise<void> {
  // Clear all session types
  if (typeof window !== 'undefined') {
    localStorage.removeItem('academix-user');
    localStorage.removeItem('dev_session');
  }

  // Clear auth token
  apiClient.clearAuthToken();

  try {
    await apiClient.logout();
  } catch (error) {
    // Don't throw error for logout, just log it
    console.warn('Logout API call failed:', error);
  }
}

/**
 * Get current user
 * GET /api/users/me
 */
export async function getCurrentUser() {
  // DEVELOPMENT BYPASS: Check for dev session in localStorage
  // Supports both 'academix-user' (ACADEMIX Portal login) and 'dev_session' (legacy)
  if (
    (process.env.NODE_ENV === 'development' ||
      process.env.NEXT_PUBLIC_ENABLE_DEV_LOGIN === 'true') &&
    typeof window !== 'undefined'
  ) {
    // Check ACADEMIX Portal login first
    const academixUser = localStorage.getItem('academix-user');
    if (academixUser) {
      try {
        const user = JSON.parse(academixUser);
        return { user }; // Match Payload CMS response format
      } catch {
        localStorage.removeItem('academix-user');
      }
    }
    // Fallback to legacy dev_session
    const devSession = localStorage.getItem('dev_session');
    if (devSession) {
      try {
        const user = JSON.parse(devSession);
        return { user }; // Match Payload CMS response format
      } catch {
        // Invalid session, clear it
        localStorage.removeItem('dev_session');
      }
    }
  }

  try {
    const user = await apiClient.getMe();
    return { user };
  } catch (error) {
    return null;
  }
}
