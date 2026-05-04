import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/components/**', 'src/hooks/**', 'src/lib/**'],
      exclude: ['src/**/*.d.ts', 'src/test/**'],
      thresholds: { lines: 70 },
    },
  },
  resolve: {
    alias: {
      // Khớp với paths trong tsconfig.json của Next.js
      '@': path.resolve(__dirname, './src'),
    },
  },
})