import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    name: 'cms',
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    globalSetup: ['./tests/teardown.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
    testTimeout: 30000, // API tests may take longer
  },
  resolve: {
    alias: {
      '@payload-config/lib': path.resolve(__dirname, './@payload-config/lib'),
      '@payload-config/hooks': path.resolve(__dirname, './@payload-config/hooks'),
      '@payload-config/components': path.resolve(__dirname, './@payload-config/components'),
      '@payload-config': path.resolve(__dirname, './src/payload.config.ts'),
      '@/lib': path.resolve(__dirname, './@payload-config/lib'),
      '@/hooks': path.resolve(__dirname, './@payload-config/hooks'),
      '@/components': path.resolve(__dirname, './@payload-config/components'),
      '@/types': path.resolve(__dirname, './types'),
      '@': path.resolve(__dirname, './'),
    },
  },
});
