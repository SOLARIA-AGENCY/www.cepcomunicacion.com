/**
 * API Client for Payload CMS
 * Handles authentication and API requests
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

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
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
    credentials: 'include', // Important: include cookies
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.errors[0]?.message || 'Login failed');
  }

  return response.json();
}

/**
 * Logout from Payload CMS
 * POST /api/users/logout
 */
export async function logout(): Promise<void> {
  // Clear dev session if exists
  if (typeof window !== 'undefined') {
    localStorage.removeItem('dev_session');
  }

  const response = await fetch(`${API_URL}/users/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }
}

/**
 * Get current user
 * GET /api/users/me
 */
export async function getCurrentUser() {
  // DEVELOPMENT BYPASS: Check for dev session in localStorage
  if (
    (process.env.NODE_ENV === 'development' ||
      process.env.NEXT_PUBLIC_ENABLE_DEV_LOGIN === 'true') &&
    typeof window !== 'undefined'
  ) {
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

  const response = await fetch(`${API_URL}/users/me`, {
    credentials: 'include',
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}
