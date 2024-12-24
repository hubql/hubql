import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
  entryPoints: ['src/store.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  external: ['react'],
  ...options,
}))
