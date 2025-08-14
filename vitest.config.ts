import { defineConfig } from 'vitest/config';
import viteBase from './vite.config';

export default defineConfig({
  ...viteBase({ mode: 'test' }),
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    exclude: ['e2e/**', 'node_modules/**', 'src/test/api/axios-interceptors.test.ts', 'src/test/utils/data-transforms.test.ts'],
    coverage: { 
      reporter: ['text', 'lcov'], 
      statements: 85 
    }
  }
});
