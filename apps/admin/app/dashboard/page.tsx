'use client';

import { useState } from 'react';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'trial' | 'suspended' | 'cancelled';
  usersCount: number;
  coursesCount: number;
  createdAt: string;
  mrr: number;
}

const mockTenants: Tenant[] = [
  {
    id: '1',
    name: 'CEP Formacion',
    slug: 'cep-formacion',
    plan: 'professional',
    status: 'active',
    usersCount: 12,
    coursesCount: 45,
    createdAt: '2024-01-15',
    mrr: 299,
  },
  {
    id: '2',
    name: 'Academia Madrid',
    slug: 'academia-madrid',
    plan: 'starter',
    status: 'trial',
    usersCount: 3,
    coursesCount: 8,
    createdAt: '2025-11-20',
    mrr: 0,
  },
  {
    id: '3',
    name: 'Instituto Barcelona',
    slug: 'instituto-barcelona',
    plan: 'enterprise',
    status: 'active',
    usersCount: 28,
    coursesCount: 120,
    createdAt: '2024-06-10',
    mrr: 599,
  },
];

export default function DashboardPage() {
  const [tenants] = useState<Tenant[]>(mockTenants);

  const totalMRR = tenants.reduce((sum, t) => sum + t.mrr, 0);
  const activeTenants = tenants.filter(t => t.status === 'active').length;
  const trialTenants = tenants.filter(t => t.status === 'trial').length;

  const getPlanBadge = (plan: Tenant['plan']) => {
    const styles: Record<string, string> = {
      starter: 'bg-slate-600 text-slate-200',
      professional: 'bg-indigo-600/20 text-indigo-400',
      enterprise: 'bg-purple-600/20 text-purple-400',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[plan]}`}>
        {plan.charAt(0).toUpperCase() + plan.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status: Tenant['status']) => {
    const styles: Record<string, string> = {
      active: 'bg-green-600/20 text-green-400',
      trial: 'bg-yellow-600/20 text-yellow-400',
      suspended: 'bg-red-600/20 text-red-400',
      cancelled: 'bg-slate-600/20 text-slate-400',
    };
    const labels: Record<string, string> = {
      active: 'Activo',
      trial: 'Trial',
      suspended: 'Suspendido',
      cancelled: 'Cancelado',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Mock Data Indicator */}
      <div className="px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-2">
        <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span className="text-amber-500 text-sm font-medium">Mock Data - Desarrollo</span>
      </div>

      {/* Global Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 backdrop-blur p-4 rounded-xl border border-slate-700/50">
          <p className="text-slate-400 text-xs font-medium">Total Tenants</p>
          <p className="text-2xl font-bold text-white mt-1">{tenants.length}</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur p-4 rounded-xl border border-slate-700/50">
          <p className="text-slate-400 text-xs font-medium">Activos</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{activeTenants}</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur p-4 rounded-xl border border-slate-700/50">
          <p className="text-slate-400 text-xs font-medium">En Trial</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{trialTenants}</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur p-4 rounded-xl border border-slate-700/50">
          <p className="text-slate-400 text-xs font-medium">MRR Total</p>
          <p className="text-2xl font-bold text-white mt-1">${totalMRR}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-5 rounded-xl">
          <h3 className="text-white font-semibold">Onboarding Pendiente</h3>
          <p className="text-indigo-200 text-sm mt-1">2 tenants necesitan completar setup</p>
          <button className="mt-4 px-4 py-2 bg-white text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors">
            Ver pendientes
          </button>
        </div>
        <div className="bg-slate-800/50 backdrop-blur p-5 rounded-xl border border-slate-700/50">
          <h3 className="text-white font-semibold">Tickets de Soporte</h3>
          <p className="text-slate-400 text-sm mt-1">3 tickets abiertos requieren atencion</p>
          <button className="mt-4 px-4 py-2 bg-slate-700 text-white rounded-lg text-sm font-medium hover:bg-slate-600 transition-colors">
            Ver tickets
          </button>
        </div>
        <div className="bg-slate-800/50 backdrop-blur p-5 rounded-xl border border-slate-700/50">
          <h3 className="text-white font-semibold">Pagos Fallidos</h3>
          <p className="text-slate-400 text-sm mt-1">1 pago rechazado en los ultimos 7 dias</p>
          <button className="mt-4 px-4 py-2 bg-slate-700 text-white rounded-lg text-sm font-medium hover:bg-slate-600 transition-colors">
            Gestionar
          </button>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-white">Tenants Recientes</h2>
            <p className="text-slate-400 text-sm">Gestiona tus academias registradas</p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors text-sm font-medium">
            + Nuevo Tenant
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/80">
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Tenant</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Plan</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Estado</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Usuarios</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">Cursos</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase">MRR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{tenant.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{tenant.name}</p>
                        <p className="text-slate-500 text-sm">{tenant.slug}.academix.com</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getPlanBadge(tenant.plan)}</td>
                  <td className="px-6 py-4">{getStatusBadge(tenant.status)}</td>
                  <td className="px-6 py-4 text-slate-300">{tenant.usersCount}</td>
                  <td className="px-6 py-4 text-slate-300">{tenant.coursesCount}</td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${tenant.mrr > 0 ? 'text-green-400' : 'text-slate-500'}`}>
                      {tenant.mrr > 0 ? `$${tenant.mrr}/mo` : 'Trial'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
