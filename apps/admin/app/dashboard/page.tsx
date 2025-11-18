'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout, apiClient } from '@/lib/api';
import type { Course, User as UserType } from '@cepcomunicacion/types';

interface User {
  id: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    courses: 0,
    users: 0,
    courseRuns: 0,
  });
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);

  useEffect(() => {
    async function checkAuth() {
      try {
        const userData = await getCurrentUser();
        if (userData && userData.user) {
          setUser(userData.user);

          // Load dashboard data
          await loadDashboardData();
        } else {
          // Not authenticated, redirect to login
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  const loadDashboardData = async () => {
    try {
      // Get courses count
      const coursesResponse = await apiClient.getCourses({ limit: 1 });
      const coursesCount = coursesResponse.total || 0;

      // Get users count (if available)
      let usersCount = 0;
      try {
        const usersResponse = await apiClient.find('users', { limit: 1 });
        usersCount = usersResponse.total || 0;
      } catch (error) {
        console.warn('Users endpoint not available:', error);
      }

      // Get course runs count
      let courseRunsCount = 0;
      try {
        const courseRunsResponse = await apiClient.getCourseRuns();
        courseRunsCount = courseRunsResponse.total || 0;
      } catch (error) {
        console.warn('Course runs endpoint not available:', error);
      }

      // Get recent courses
      const recentCoursesResponse = await apiClient.getCourses({ limit: 5 });

      setStats({
        courses: coursesCount,
        users: usersCount,
        courseRuns: courseRunsCount,
      });
      setRecentCourses(recentCoursesResponse.docs || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="text-sm text-gray-600 mt-1">Bienvenido, {user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Cursos</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.courses}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Usuarios</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.users}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Convocatorias</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.courseRuns}</p>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            ¡Dashboard en Construcción! 🚧
          </h2>
          <p className="text-blue-700">
            Este es el panel de administración personalizado para CEP Comunicación. Estamos en la
            Semana 1 de desarrollo (Setup & Auth).
          </p>
          <div className="mt-4 text-sm text-blue-600">
            <p>
              <strong>Usuario:</strong> {user.email}
            </p>
            <p>
              <strong>Rol:</strong> {user.role}
            </p>
            <p>
              <strong>ID:</strong> {user.id}
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Cursos</h3>
            <p className="text-sm text-gray-600 mb-4">Gestionar cursos y convocatorias</p>
            <button className="text-blue-600 hover:underline text-sm font-medium">
              Ir a Cursos →
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Estudiantes</h3>
            <p className="text-sm text-gray-600 mb-4">Ver y administrar estudiantes</p>
            <button className="text-blue-600 hover:underline text-sm font-medium">
              Ir a Estudiantes →
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Leads</h3>
            <p className="text-sm text-gray-600 mb-4">Gestionar leads y conversiones</p>
            <button className="text-blue-600 hover:underline text-sm font-medium">
              Ir a Leads →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
