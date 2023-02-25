import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['index.ts'],
  format:['cjs','esm'],
  dts:true,
  splitting: false,
  treeshake: true,
  sourcemap: true,
})