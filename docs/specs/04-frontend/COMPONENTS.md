# Frontend Component Specification

**Project:** CEPComunicacion.com v2 - Plataforma Integral de Gestión Formativa
**Document:** React Frontend Component Specification (Atomic Design)
**Version:** 1.0.0
**Date:** 2025-10-21
**Author:** SOLARIA AGENCY - Dirección de Tecnología
**Status:** ✅ Complete

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Atomic Design Methodology](#2-atomic-design-methodology)
3. [Technology Stack](#3-technology-stack)
4. [Design System](#4-design-system)
5. [Atoms](#5-atoms)
6. [Molecules](#6-molecules)
7. [Organisms](#7-organisms)
8. [Templates](#8-templates)
9. [Pages](#9-pages)
10. [State Management](#10-state-management)
11. [Routing Structure](#11-routing-structure)
12. [Analytics Integration](#12-analytics-integration)
13. [Accessibility](#13-accessibility)
14. [Performance](#14-performance)
15. [Testing Strategy](#15-testing-strategy)
16. [Acceptance Criteria](#16-acceptance-criteria)

---

## 1. Executive Summary

### 1.1 Purpose

This document defines the **complete React frontend component architecture** for CEPComunicacion v2 using **Atomic Design principles**. Every component is specified with TypeScript interfaces, props documentation, and usage examples.

### 1.2 Design Philosophy

**Principles:**

1. **Atomic Design**: Build UI from smallest atoms to complete pages
2. **Component Composition**: Reusable, composable building blocks
3. **TypeScript First**: Strong typing for all props and state
4. **Accessibility**: WCAG 2.1 AA compliant
5. **Performance**: Lazy loading, code splitting, React.memo where needed
6. **Testability**: Every component is unit testable

### 1.3 Component Hierarchy

```
Atoms (20+)
  ├─→ Button, Input, Label, Badge, Icon, etc.
  └─→ Building blocks - no dependencies

Molecules (15+)
  ├─→ SearchBar, FilterChip, Card, FormField, etc.
  └─→ Combine 2-3 atoms

Organisms (10+)
  ├─→ Header, Footer, LeadForm, FilterPanel, CourseCard, etc.
  └─→ Complex components combining molecules

Templates (5)
  ├─→ PageLayout, LandingLayout, DashboardLayout, etc.
  └─→ Page structure without content

Pages (8)
  ├─→ Home, Cursos, CursoDetail, Sedes, Contacto, etc.
  └─→ Complete views with real data
```

---

## 2. Atomic Design Methodology

### 2.1 Level Definitions

**Atoms (Smallest Units):**
- Single-purpose components
- No dependencies on other components
- Examples: Button, Input, Icon, Badge

**Molecules (Simple Combinations):**
- Combine 2-3 atoms
- Specific functionality
- Examples: SearchBar (Input + Button), FormField (Label + Input + Error)

**Organisms (Complex Sections):**
- Combine molecules + atoms
- Represent distinct UI sections
- Examples: Header (Logo + Nav + SearchBar), FilterPanel (multiple FilterChips)

**Templates (Page Layouts):**
- Define page structure
- No real content (props or slots)
- Examples: PageLayout (Header + Main + Footer), DashboardLayout (Sidebar + Content)

**Pages (Complete Views):**
- Use templates with real data
- Connected to state management
- Examples: HomePage, CursosPage, LeadFormPage

### 2.2 Directory Structure

```
apps/web/src/
├── components/
│   ├── atoms/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Badge/
│   │   └── ...
│   ├── molecules/
│   │   ├── SearchBar/
│   │   ├── FilterChip/
│   │   ├── FormField/
│   │   └── ...
│   ├── organisms/
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── LeadForm/
│   │   ├── FilterPanel/
│   │   └── ...
│   ├── templates/
│   │   ├── PageLayout/
│   │   ├── LandingLayout/
│   │   └── ...
│   └── pages/
│       ├── Home/
│       ├── Cursos/
│       ├── CursoDetail/
│       └── ...
├── hooks/
│   ├── useAuth.ts
│   ├── useCourses.ts
│   ├── useLeads.ts
│   └── ...
├── lib/
│   ├── api.ts          # API client
│   ├── analytics.ts    # GA4, Meta Pixel
│   ├── utils.ts        # Utilities
│   └── ...
└── App.tsx
```

---

## 3. Technology Stack

### 3.1 Core Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18+ | UI library |
| **TypeScript** | 5+ | Type safety |
| **Vite** | 5+ | Build tool + dev server |
| **TailwindCSS** | 3+ | Utility-first CSS |
| **TanStack Query** | 5+ | Data fetching + caching |
| **React Router** | 6+ | Client-side routing |
| **Zod** | 3+ | Schema validation |
| **React Hook Form** | 7+ | Form state management |
| **Framer Motion** | 11+ | Animations |
| **hCaptcha React** | 1+ | CAPTCHA integration |

### 3.2 Development Tools

- **Storybook**: Component documentation + visual testing
- **Vitest**: Unit testing
- **Playwright**: E2E testing
- **ESLint**: Code linting
- **Prettier**: Code formatting

---

## 4. Design System

### 4.1 Color Palette

**Primary Colors (Glassmorphism iOS 22+):**

```typescript
// apps/web/src/design-system/colors.ts

export const colors = {
  // Primary brand colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Main brand color
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Secondary colors
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7', // Accent purple
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },

  // Neutrals (glass backgrounds)
  glass: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(0, 0, 0, 0.1)',
  },

  // Semantic colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};
```

### 4.2 Typography

**Font Stack:**

```typescript
// apps/web/src/design-system/typography.ts

export const fonts = {
  sans: [
    'Inter',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'sans-serif',
  ].join(', '),

  mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'].join(', '),
};

export const fontSizes = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px
};
```

### 4.3 Spacing Scale

**8px Grid System:**

```typescript
export const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
};
```

### 4.4 Glassmorphism Styles

**GlassCard Base Styles:**

```typescript
// apps/web/src/design-system/glassmorphism.ts

export const glassStyles = {
  backdrop: 'backdrop-blur-md backdrop-saturate-150',
  background: 'bg-white/10 dark:bg-black/10',
  border: 'border border-white/20 dark:border-white/10',
  shadow: 'shadow-xl shadow-black/5',
  hover: 'hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300',
};

export const glassmorphismClass = Object.values(glassStyles).join(' ');
```

---

## 5. Atoms

### 5.1 Button

**Purpose:** Primary interactive element for actions.

**TypeScript Interface:**

```typescript
// apps/web/src/components/atoms/Button/Button.tsx

import { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'text-primary-500 hover:bg-primary-50 focus:ring-primary-500',
    danger: 'bg-error text-white hover:bg-red-600 focus:ring-red-500',
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed';

  const classes = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? 'w-full' : '',
    disabled || isLoading ? disabledStyles : '',
    className,
  ].join(' ');

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <LoadingSpinner size={size} />
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
```

**Usage Examples:**

```tsx
// Primary button
<Button variant="primary">Enviar</Button>

// With loading state
<Button variant="primary" isLoading>
  Cargando...
</Button>

// With icon
<Button variant="secondary" leftIcon={<ChevronLeftIcon />}>
  Volver
</Button>

// Outline full width
<Button variant="outline" fullWidth>
  Ver todos los cursos
</Button>
```

### 5.2 Input

**Purpose:** Text input field for forms.

```typescript
// apps/web/src/components/atoms/Input/Input.tsx

import { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, helperText, className = '', ...props }, ref) => {
    const baseStyles = 'w-full px-4 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500';
    const errorStyles = error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300';

    return (
      <div className="w-full">
        <input
          ref={ref}
          className={`${baseStyles} ${errorStyles} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? 'error-message' : helperText ? 'helper-text' : undefined}
          {...props}
        />
        {error && (
          <p id="error-message" className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id="helper-text" className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

### 5.3 Badge

**Purpose:** Status indicator or tag.

```typescript
// apps/web/src/components/atoms/Badge/Badge.tsx

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  dot?: boolean;
}

export function Badge({ variant = 'default', children, dot = false }: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]}`}>
      {dot && <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
```

### 5.4 Icon

**Purpose:** Consistent icon rendering using Heroicons.

```typescript
// apps/web/src/components/atoms/Icon/Icon.tsx

import * as HeroIcons from '@heroicons/react/24/outline';

export type IconName = keyof typeof HeroIcons;

export interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 20, className = '' }: IconProps) {
  const IconComponent = HeroIcons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <IconComponent width={size} height={size} className={className} />;
}
```

**Usage:**

```tsx
<Icon name="MagnifyingGlassIcon" size={20} />
<Icon name="ChevronRightIcon" size={16} className="text-primary-500" />
```

---

## 6. Molecules

### 6.1 SearchBar

**Purpose:** Search input with icon and clear button.

```typescript
// apps/web/src/components/molecules/SearchBar/SearchBar.tsx

import { useState } from 'react';
import { Input } from '../../atoms/Input';
import { Icon } from '../../atoms/Icon';

export interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
}

export function SearchBar({
  placeholder = 'Buscar...',
  onSearch,
  debounceMs = 300,
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  // Debounce search
  const debouncedSearch = useDebouncedCallback((value: string) => {
    onSearch(value);
  }, debounceMs);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative">
      <Icon
        name="MagnifyingGlassIcon"
        size={20}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="pl-10 pr-10"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Limpiar búsqueda"
        >
          <Icon name="XMarkIcon" size={20} />
        </button>
      )}
    </div>
  );
}
```

### 6.2 FilterChip

**Purpose:** Toggle filter chip with active state.

```typescript
// apps/web/src/components/molecules/FilterChip/FilterChip.tsx

export interface FilterChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  count?: number;
}

export function FilterChip({ label, isActive, onClick, count }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
        ${isActive
          ? 'bg-primary-500 text-white shadow-lg'
          : 'bg-white/10 text-gray-700 hover:bg-white/20 backdrop-blur-sm border border-white/20'
        }
      `}
      aria-pressed={isActive}
    >
      {label}
      {count !== undefined && (
        <span className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
          ({count})
        </span>
      )}
    </button>
  );
}
```

### 6.3 FormField

**Purpose:** Complete form field with label, input, and error.

```typescript
// apps/web/src/components/molecules/FormField/FormField.tsx

import { forwardRef, InputHTMLAttributes } from 'react';
import { Input } from '../../atoms/Input';

export interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helperText, required, id, ...props }, ref) => {
    const inputId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="w-full">
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
        <Input
          ref={ref}
          id={inputId}
          error={error}
          helperText={helperText}
          required={required}
          {...props}
        />
      </div>
    );
  }
);

FormField.displayName = 'FormField';
```

### 6.4 GlassCard

**Purpose:** Glassmorphism card component (iOS 22+ style).

```typescript
// apps/web/src/components/molecules/GlassCard/GlassCard.tsx

import { ReactNode } from 'react';
import { glassmorphismClass } from '../../../design-system/glassmorphism';

export interface GlassCardProps {
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  className?: string;
}

export function GlassCard({
  children,
  padding = 'md',
  hover = false,
  className = '',
}: GlassCardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        ${glassmorphismClass}
        ${paddingStyles[padding]}
        ${hover ? 'hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
```

---

## 7. Organisms

### 7.1 Header

**Purpose:** Global navigation header with logo, menu, and search.

```typescript
// apps/web/src/components/organisms/Header/Header.tsx

import { Link } from 'react-router-dom';
import { SearchBar } from '../../molecules/SearchBar';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';

export interface HeaderProps {
  onSearch: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Cursos', href: '/cursos' },
    { label: 'Ciclos FP', href: '/ciclos' },
    { label: 'Sedes', href: '/sedes' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contacto', href: '/contacto' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="CEP Formación"
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              CEP Formación
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search + CTA */}
          <div className="hidden md:flex items-center gap-4">
            <div className="w-64">
              <SearchBar onSearch={onSearch} placeholder="Buscar cursos..." />
            </div>
            <Button variant="primary" size="sm">
              Solicitar Información
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú"
          >
            <Icon name={mobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'} size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
          <nav className="flex flex-col gap-2 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
```

### 7.2 LeadForm

**Purpose:** Lead capture form with validation and CAPTCHA.

```typescript
// apps/web/src/components/organisms/LeadForm/LeadForm.tsx

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { FormField } from '../../molecules/FormField';
import { Button } from '../../atoms/Button';
import { useMutation } from '@tanstack/react-query';
import { createLead } from '../../../lib/api';

const leadSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre debe tener menos de 100 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^\+?[0-9]{9,15}$/, 'Teléfono inválido'),
  message: z.string().max(1000, 'El mensaje debe tener menos de 1000 caracteres').optional(),
  consentGiven: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar la política de privacidad',
  }),
});

export type LeadFormData = z.infer<typeof leadSchema>;

export interface LeadFormProps {
  courseRunId: string;
  campaignId?: string;
  onSuccess?: () => void;
}

export function LeadForm({ courseRunId, campaignId, onSuccess }: LeadFormProps) {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: LeadFormData & { captchaToken: string }) =>
      createLead(data),
    onSuccess: () => {
      reset();
      setCaptchaToken(null);
      onSuccess?.();
      toast.success('¡Gracias! Nos pondremos en contacto pronto.');
    },
    onError: (error) => {
      toast.error('Error al enviar el formulario. Inténtalo de nuevo.');
    },
  });

  const onSubmit = (data: LeadFormData) => {
    if (!captchaToken) {
      toast.error('Por favor completa el CAPTCHA');
      return;
    }

    mutation.mutate({
      ...data,
      courseRunId,
      campaignId,
      captchaToken,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        label="Nombre completo"
        {...register('name')}
        error={errors.name?.message}
        required
      />

      <FormField
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        required
      />

      <FormField
        label="Teléfono"
        type="tel"
        {...register('phone')}
        error={errors.phone?.message}
        helperText="Ejemplo: +34612345678"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mensaje (opcional)
        </label>
        <textarea
          {...register('message')}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Cuéntanos más sobre tus necesidades..."
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      <div>
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            {...register('consentGiven')}
            className="mt-1"
          />
          <span className="text-sm text-gray-600">
            Acepto la{' '}
            <a href="/politica-privacidad" className="text-primary-500 underline">
              política de privacidad
            </a>{' '}
            y el tratamiento de mis datos personales.
            <span className="text-red-500 ml-1">*</span>
          </span>
        </label>
        {errors.consentGiven && (
          <p className="mt-1 text-sm text-red-600">{errors.consentGiven.message}</p>
        )}
      </div>

      <HCaptcha
        sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
        onVerify={(token) => setCaptchaToken(token)}
        onExpire={() => setCaptchaToken(null)}
        theme="light"
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={mutation.isPending}
        disabled={!captchaToken}
      >
        Solicitar Información
      </Button>
    </form>
  );
}
```

### 7.3 FilterPanel

**Purpose:** Multi-select filter panel for course listing.

```typescript
// apps/web/src/components/organisms/FilterPanel/FilterPanel.tsx

import { FilterChip } from '../../molecules/FilterChip';

export interface Filter {
  key: string;
  label: string;
  options: Array<{
    value: string;
    label: string;
    count?: number;
  }>;
}

export interface FilterPanelProps {
  filters: Filter[];
  activeFilters: Record<string, string[]>;
  onChange: (filterKey: string, value: string) => void;
  onClear: () => void;
}

export function FilterPanel({
  filters,
  activeFilters,
  onChange,
  onClear,
}: FilterPanelProps) {
  const totalActiveFilters = Object.values(activeFilters).flat().length;

  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filtros</h2>
        {totalActiveFilters > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-sm text-primary-500 hover:text-primary-600"
          >
            Limpiar ({totalActiveFilters})
          </button>
        )}
      </div>

      {filters.map((filter) => (
        <div key={filter.key} className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">{filter.label}</h3>
          <div className="flex flex-wrap gap-2">
            {filter.options.map((option) => (
              <FilterChip
                key={option.value}
                label={option.label}
                count={option.count}
                isActive={activeFilters[filter.key]?.includes(option.value) || false}
                onClick={() => onChange(filter.key, option.value)}
              />
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
```

### 7.4 CourseCard

**Purpose:** Course display card with image, title, summary, and CTA.

```typescript
// apps/web/src/components/organisms/CourseCard/CourseCard.tsx

import { Link } from 'react-router-dom';
import { GlassCard } from '../../molecules/GlassCard';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { Course } from '../../../types/course';

export interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <GlassCard hover padding="none" className="overflow-hidden">
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.image || '/placeholder-course.jpg'}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <Badge
          variant="info"
          className="absolute top-4 right-4"
        >
          {course.offerType}
        </Badge>
      </div>

      {/* Course Content */}
      <div className="p-6 space-y-4">
        <Link to={`/cursos/${course.slug}`}>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-primary-500 transition-colors">
            {course.title}
          </h3>
        </Link>

        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
          {course.summary}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          {course.duration && (
            <span className="flex items-center gap-1">
              <Icon name="ClockIcon" size={16} />
              {course.duration}
            </span>
          )}
          {course.price && (
            <span className="flex items-center gap-1 font-semibold text-primary-500">
              {course.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </span>
          )}
        </div>

        <Button variant="outline" fullWidth asChild>
          <Link to={`/cursos/${course.slug}`}>
            Ver detalles
          </Link>
        </Button>
      </div>
    </GlassCard>
  );
}
```

### 7.5 Footer

**Purpose:** Global footer with links, contact info, social media.

```typescript
// apps/web/src/components/organisms/Footer/Footer.tsx

import { Link } from 'react-router-dom';
import { Icon } from '../../atoms/Icon';

export function Footer() {
  const sections = [
    {
      title: 'Cursos',
      links: [
        { label: 'Telemáticos', href: '/cursos?offerType=telematico' },
        { label: 'Ocupados', href: '/cursos?offerType=ocupados' },
        { label: 'Desempleados', href: '/cursos?offerType=desempleados' },
        { label: 'Ciclos FP', href: '/ciclos' },
      ],
    },
    {
      title: 'Empresa',
      links: [
        { label: 'Sobre Nosotros', href: '/sobre-nosotros' },
        { label: 'Sedes', href: '/sedes' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contacto', href: '/contacto' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Política de Privacidad', href: '/politica-privacidad' },
        { label: 'Aviso Legal', href: '/aviso-legal' },
        { label: 'Política de Cookies', href: '/politica-cookies' },
        { label: 'Términos y Condiciones', href: '/terminos-condiciones' },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <img
              src="/logo-white.svg"
              alt="CEP Formación"
              className="h-8 w-auto"
            />
            <p className="text-sm text-gray-400">
              Tu centro de formación profesional en España. Más de 20 años formando profesionales.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com/cepformacion" className="hover:text-white transition-colors">
                <Icon name="FacebookIcon" size={20} />
              </a>
              <a href="https://twitter.com/cepformacion" className="hover:text-white transition-colors">
                <Icon name="TwitterIcon" size={20} />
              </a>
              <a href="https://linkedin.com/company/cepformacion" className="hover:text-white transition-colors">
                <Icon name="LinkedInIcon" size={20} />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {sections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-white font-semibold">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} CEP Formación. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
```

---

## 8. Templates

### 8.1 PageLayout

**Purpose:** Standard page layout with header, main, and footer.

```typescript
// apps/web/src/components/templates/PageLayout/PageLayout.tsx

import { ReactNode } from 'react';
import { Header } from '../../organisms/Header';
import { Footer } from '../../organisms/Footer';

export interface PageLayoutProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function PageLayout({ children, maxWidth = 'xl' }: PageLayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-5xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={(query) => console.log('Search:', query)} />

      <main className="flex-grow">
        <div className={`${maxWidthClasses[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
```

---

## 9. Pages

### 9.1 Home Page

**Purpose:** Landing page with hero, course highlights, stats.

```typescript
// apps/web/src/components/pages/Home/HomePage.tsx

import { PageLayout } from '../../templates/PageLayout';
import { Button } from '../../atoms/Button';
import { CourseCard } from '../../organisms/CourseCard';
import { GlassCard } from '../../molecules/GlassCard';
import { useQuery } from '@tanstack/react-query';
import { getCourses } from '../../../lib/api';

export function HomePage() {
  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses', { status: 'published', limit: 6 }],
    queryFn: () => getCourses({ status: 'published', limit: 6 }),
  });

  return (
    <PageLayout maxWidth="2xl">
      {/* Hero Section */}
      <section className="relative h-[600px] -mx-4 sm:-mx-6 lg:-mx-8 mb-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/hero-bg.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-secondary-900/80" />

        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Impulsa tu Carrera Profesional
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              Formación bonificada, ciclos FP y cursos privados. Más de 20 años formando profesionales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg">
                Ver Cursos
              </Button>
              <Button variant="outline" size="lg">
                Solicitar Información
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          { label: 'Años de Experiencia', value: '20+' },
          { label: 'Alumnos Formados', value: '50.000+' },
          { label: 'Cursos Disponibles', value: '200+' },
        ].map((stat) => (
          <GlassCard key={stat.label} padding="lg" className="text-center">
            <p className="text-4xl font-bold text-primary-500 mb-2">{stat.value}</p>
            <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
          </GlassCard>
        ))}
      </section>

      {/* Featured Courses */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Cursos Destacados
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses?.docs.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>
    </PageLayout>
  );
}
```

---

## 10. State Management

### 10.1 TanStack Query Setup

```typescript
// apps/web/src/lib/queryClient.ts

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

### 10.2 Custom Hooks

```typescript
// apps/web/src/hooks/useCourses.ts

import { useQuery } from '@tanstack/react-query';
import { getCourses, GetCoursesParams } from '../lib/api';

export function useCourses(params?: GetCoursesParams) {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: () => getCourses(params),
  });
}

// apps/web/src/hooks/useAuth.ts

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Verify token and fetch user
      fetchCurrentUser().then(setUser);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginUser(email, password);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return { user, login, logout, isAuthenticated: !!user };
}
```

---

## 11. Routing Structure

### 11.1 React Router Setup

```typescript
// apps/web/src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './components/pages/Home';
import { CursosPage } from './components/pages/Cursos';
import { CursoDetailPage } from './components/pages/CursoDetail';
import { SedesPage } from './components/pages/Sedes';
import { BlogPage } from './components/pages/Blog';
import { ContactoPage } from './components/pages/Contacto';
import { NotFoundPage } from './components/pages/NotFound';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cursos" element={<CursosPage />} />
        <Route path="/cursos/:slug" element={<CursoDetailPage />} />
        <Route path="/ciclos" element={<CiclosPage />} />
        <Route path="/sedes" element={<SedesPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="/politica-privacidad" element={<PrivacyPolicyPage />} />
        <Route path="/aviso-legal" element={<LegalNoticePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 12. Analytics Integration

### 12.1 Google Analytics 4

```typescript
// apps/web/src/lib/analytics.ts

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export function initGA4(measurementId: string) {
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    anonymize_ip: true, // RGPD compliance
    cookie_flags: 'SameSite=None;Secure',
  });
}

export function trackPageView(path: string) {
  window.gtag('config', import.meta.env.VITE_GA4_MEASUREMENT_ID, {
    page_path: path,
  });
}

export function trackEvent(eventName: string, params?: Record<string, any>) {
  window.gtag('event', eventName, params);
}

// Usage in React Router
useEffect(() => {
  trackPageView(location.pathname);
}, [location]);
```

### 12.2 Meta Pixel

```typescript
export function initMetaPixel(pixelId: string) {
  (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function() {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');
}

export function trackLeadSubmission(leadId: string) {
  window.fbq('track', 'Lead', {
    content_name: 'Course Lead',
    value: 0.00,
    currency: 'EUR',
  });

  trackEvent('lead_submission', {
    lead_id: leadId,
  });
}
```

---

## 13. Accessibility

### 13.1 WCAG 2.1 AA Compliance Checklist

- [ ] **Perceivable**
  - [ ] All images have `alt` text
  - [ ] Color contrast ratio ≥ 4.5:1 for text
  - [ ] Text resizable up to 200% without loss of functionality
  - [ ] Captions for video/audio content

- [ ] **Operable**
  - [ ] All functionality available via keyboard
  - [ ] No keyboard traps
  - [ ] Skip to main content link
  - [ ] Focus indicators visible

- [ ] **Understandable**
  - [ ] Language declared (`<html lang="es">`)
  - [ ] Consistent navigation
  - [ ] Error messages clear and actionable
  - [ ] Labels for form inputs

- [ ] **Robust**
  - [ ] Valid HTML5
  - [ ] ARIA roles used correctly
  - [ ] Compatible with assistive technologies

### 13.2 Keyboard Navigation

```typescript
// apps/web/src/hooks/useKeyboardNav.ts

export function useKeyboardNav(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Close modals, dropdowns
      }
      if (e.key === 'Tab') {
        // Trap focus in modals
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}
```

---

## 14. Performance

### 14.1 Code Splitting

```typescript
// apps/web/src/App.tsx

import { lazy, Suspense } from 'react';

const CursosPage = lazy(() => import('./components/pages/Cursos'));
const BlogPage = lazy(() => import('./components/pages/Blog'));

export function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cursos" element={<CursosPage />} />
        <Route path="/blog" element={<BlogPage />} />
      </Routes>
    </Suspense>
  );
}
```

### 14.2 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **LCP (Largest Contentful Paint)** | < 2.5s | Core Web Vitals |
| **FID (First Input Delay)** | < 100ms | Core Web Vitals |
| **CLS (Cumulative Layout Shift)** | < 0.1 | Core Web Vitals |
| **TTI (Time to Interactive)** | < 3.5s | Lighthouse |
| **Bundle Size (gzipped)** | < 250 KB | Initial load |

### 14.3 Image Optimization

```typescript
// Use next-gen formats with fallback
<picture>
  <source srcSet="/hero.webp" type="image/webp" />
  <source srcSet="/hero.jpg" type="image/jpeg" />
  <img src="/hero.jpg" alt="Hero" loading="lazy" />
</picture>
```

---

## 15. Testing Strategy

### 15.1 Unit Tests (Vitest)

```typescript
// apps/web/src/components/atoms/Button/Button.test.tsx

import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByText('Primary');
    expect(button).toHaveClass('bg-primary-500');
  });

  it('shows loading spinner when isLoading=true', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });
});
```

### 15.2 E2E Tests (Playwright)

```typescript
// apps/web/e2e/leadForm.spec.ts

import { test, expect } from '@playwright/test';

test('lead form submission', async ({ page }) => {
  await page.goto('/cursos/gestion-proyectos');

  // Fill form
  await page.fill('input[name="name"]', 'Test User');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="phone"]', '+34612345678');
  await page.check('input[name="consentGiven"]');

  // Complete CAPTCHA (use test key in development)
  await page.frame({ name: 'hcaptcha-iframe' })?.click('[data-testid="captcha-checkbox"]');

  // Submit
  await page.click('button[type="submit"]');

  // Verify success message
  await expect(page.getByText('¡Gracias! Nos pondremos en contacto pronto.')).toBeVisible();
});
```

---

## 16. Acceptance Criteria

### 16.1 Functional Requirements

- [ ] **Atomic Design Structure**
  - [ ] 20+ atoms implemented
  - [ ] 15+ molecules implemented
  - [ ] 10+ organisms implemented
  - [ ] 5 templates implemented
  - [ ] 8 pages implemented

- [ ] **Components**
  - [ ] All components have TypeScript interfaces
  - [ ] All components have Storybook stories
  - [ ] All components have unit tests (>80% coverage)

- [ ] **Forms**
  - [ ] Lead form validates with Zod
  - [ ] CAPTCHA integration works
  - [ ] Error messages displayed correctly
  - [ ] Success/error toasts shown

- [ ] **Navigation**
  - [ ] React Router configured for all pages
  - [ ] Mobile menu works
  - [ ] Search bar functional
  - [ ] Breadcrumbs on detail pages

- [ ] **Analytics**
  - [ ] GA4 tracking page views
  - [ ] Meta Pixel tracking conversions
  - [ ] RGPD consent banner implemented
  - [ ] Cookie preferences saved

### 16.2 Performance Requirements

- [ ] **Core Web Vitals**
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1

- [ ] **Bundle Size**
  - [ ] Initial bundle < 250 KB (gzipped)
  - [ ] Code splitting for routes
  - [ ] Lazy loading for non-critical components

### 16.3 Accessibility Requirements

- [ ] **WCAG 2.1 AA**
  - [ ] Color contrast ≥ 4.5:1
  - [ ] Keyboard navigation works
  - [ ] Screen reader tested (VoiceOver, NVDA)
  - [ ] ARIA labels on interactive elements

---

**Document Control:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-10-21 | SOLARIA AGENCY | Initial frontend component specification |

**Approval Signatures:**

- [ ] **Technical Lead**: _______________ Date: ___________
- [ ] **UI/UX Designer**: _______________ Date: ___________
- [ ] **Accessibility Specialist**: _______________ Date: ___________
- [ ] **Client (CEP FORMACIÓN)**: _______________ Date: ___________

---

**End of Frontend Component Specification**
