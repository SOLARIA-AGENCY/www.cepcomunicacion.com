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
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
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
  const response = await fetch(`${API_URL}/users/me`, {
    credentials: 'include',
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}
