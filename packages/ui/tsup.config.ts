import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
  entryPoints: ['./src/components/ui/button.tsx'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  external: ['react'],
  ...options,
}))
