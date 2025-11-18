import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e40af', // Professional blue
          dark: '#1e3a8a',
          light: '#3b82f6',
        },
        secondary: {
          DEFAULT: '#059669', // Success green
          dark: '#047857',
          light: '#10b981',
        },
        accent: {
          DEFAULT: '#ea580c', // Call-to-action orange
          dark: '#c2410c',
          light: '#f97316',
        },
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        // CEP Formación Course Type Colors
        'cep-rosa': {
          DEFAULT: '#f2014b', // Rosa CEP - PRIVADO/CICLOS
          dark: '#d6013f',
        },
        'cep-ocupados': {
          DEFAULT: '#10b981', // Verde - TRABAJADORES OCUPADOS
          dark: '#059669',
        },
        'cep-desempleados': {
          DEFAULT: '#3b82f6', // Azul - TRABAJADORES DESEMPLEADOS
          dark: '#2563eb',
        },
        'cep-teleformacion': {
          DEFAULT: '#ffa800', // Naranja - TELEFORMACIÓN
          dark: '#e69500',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
          xl: '3rem',
          '2xl': '4rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },
    },
  },
  plugins: [],
};

export default config;
