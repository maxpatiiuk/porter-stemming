import type { Options } from 'tsup';
import { defineConfig } from 'tsup';

export default defineConfig((cliOptions: Options) => ({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  // It's a best practice to let the final bundler down-level as needed
  target: 'es2022',
  dts: true,
  outDir: 'dist',
  minify: false,
  clean: true,
  ...cliOptions,
}));
