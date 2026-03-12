import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['generated/**/*.test.ts', 'src/__tests__/**/*.test.ts'],
    globals: true,
    testTimeout: 30000,
    passWithNoTests: true,
  },
})
