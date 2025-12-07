'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AcademixLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // DEV MODE: Authentication bypassed - any credentials accepted
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate brief loading for UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // Store mock user in localStorage for demo
    localStorage.setItem('academix-user', JSON.stringify({
      email: email || 'admin@academix.com',
      role: 'admin', // Must match dashboard role check
      name: 'Demo User'
    }));

    // Redirect to dashboard (no auth validation)
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-indigo-600/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-purple-600/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md w-full">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/30">
            <span className="text-white font-bold text-3xl">A</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            ACADEMIX
          </h1>
          <p className="text-slate-400">Portal de Gestión SaaS</p>
          <p className="text-xs text-slate-500 mt-1">Solo acceso autorizado para administradores de plataforma</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-8 shadow-xl">
          {/* Login Form - DEV MODE: Any credentials accepted */}
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Dev Mode Banner */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-xs text-amber-400 text-center">
                🔓 DEV MODE: Autenticación desactivada - Cualquier credencial es válida
              </p>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Email de administrador
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="admin@academix.com"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verificando acceso...
                </span>
              ) : 'Acceder al Portal'}
            </button>
          </form>

          {/* Separator */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-slate-700"></div>
            <span className="px-4 text-xs text-slate-500">ACCESO RESTRINGIDO</span>
            <div className="flex-1 border-t border-slate-700"></div>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 text-center">
              Este portal es exclusivo para administradores de la plataforma ACADEMIX.
              <br />
              Si eres administrador de un tenant, accede desde tu panel específico.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            ACADEMIX SaaS Platform • SOLARIA AGENCY
          </p>
        </div>
      </div>
    </div>
  );
}
