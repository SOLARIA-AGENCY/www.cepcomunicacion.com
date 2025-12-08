/**
 * useFeatureFlags - Hook for checking tenant module access
 *
 * Checks if a specific module is enabled for the current tenant.
 * Used to conditionally render UI components and routes.
 *
 * Usage:
 *   const { hasModule, isLoading } = useFeatureFlags()
 *   if (hasModule('campusVirtual')) { ... }
 */

import { useState, useEffect } from 'react'

export type ModuleKey = 'gestionAcademica' | 'marketing' | 'campusVirtual'

interface TenantModules {
  gestionAcademica: boolean
  marketing: boolean
  campusVirtual: boolean
}

interface FeatureFlagsState {
  modules: TenantModules | null
  isLoading: boolean
  error: Error | null
}

// Default modules (all enabled for development)
const DEFAULT_MODULES: TenantModules = {
  gestionAcademica: true,
  marketing: true,
  campusVirtual: true, // Enable by default for development
}

/**
 * Hook to access tenant feature flags/modules
 */
export function useFeatureFlags() {
  const [state, setState] = useState<FeatureFlagsState>({
    modules: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    async function fetchTenantModules() {
      try {
        // In production, this would fetch from API based on current user's tenant
        // For now, we use defaults (can be overridden via localStorage for testing)
        const storedModules = localStorage.getItem('tenant_modules')

        if (storedModules) {
          setState({
            modules: JSON.parse(storedModules),
            isLoading: false,
            error: null,
          })
        } else {
          // TODO: Replace with actual API call when tenant context is ready
          // const res = await fetch('/api/tenant/current')
          // const tenant = await res.json()
          // setState({ modules: tenant.modules, isLoading: false, error: null })

          setState({
            modules: DEFAULT_MODULES,
            isLoading: false,
            error: null,
          })
        }
      } catch (error) {
        setState({
          modules: DEFAULT_MODULES,
          isLoading: false,
          error: error as Error,
        })
      }
    }

    fetchTenantModules()
  }, [])

  /**
   * Check if a specific module is enabled
   */
  const hasModule = (module: ModuleKey): boolean => {
    if (state.isLoading || !state.modules) return false
    return state.modules[module] ?? false
  }

  /**
   * Check multiple modules at once
   */
  const hasModules = (modules: ModuleKey[]): boolean => {
    return modules.every(hasModule)
  }

  /**
   * Check if any of the specified modules is enabled
   */
  const hasAnyModule = (modules: ModuleKey[]): boolean => {
    return modules.some(hasModule)
  }

  return {
    modules: state.modules,
    isLoading: state.isLoading,
    error: state.error,
    hasModule,
    hasModules,
    hasAnyModule,
  }
}

/**
 * Server-side helper to check modules (for API routes)
 *
 * Usage in API route:
 *   const tenant = await getTenantFromRequest(req)
 *   if (!checkTenantModule(tenant, 'campusVirtual')) {
 *     return Response.json({ error: 'Module not enabled' }, { status: 403 })
 *   }
 */
export function checkTenantModule(
  tenant: { modules?: TenantModules } | null,
  module: ModuleKey
): boolean {
  if (!tenant?.modules) return false
  return tenant.modules[module] ?? false
}

/**
 * Helper to set modules in localStorage (for testing/demo)
 */
export function setTestModules(modules: Partial<TenantModules>) {
  const current = JSON.parse(localStorage.getItem('tenant_modules') || '{}')
  localStorage.setItem('tenant_modules', JSON.stringify({ ...current, ...modules }))
}

/**
 * Helper to clear test modules
 */
export function clearTestModules() {
  localStorage.removeItem('tenant_modules')
}
