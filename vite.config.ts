import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsConfigPaths from 'vite-tsconfig-paths';

import packageJson from './package.json';

export default defineConfig(() => {
  return {
    publicDir: false,
    plugins: [
      tsConfigPaths(),
      dts({
        include: ['src'],
        exclude: ['src/setupTests.ts'],
      }),
    ],
    build: {
      lib: {
        entry: [resolve('src', 'index.ts')],
        name: 'index',
        formats: ['es', 'cjs'],
        fileName: (format, entryName) => `${entryName}.${format === 'cjs' ? 'cjs' : 'es.js'}`,
        target: 'esnext',
      },
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: Object.keys(packageJson.peerDependencies),
      },
      optimizeDeps: {
        exclude: Object.keys(packageJson.peerDependencies),
      },
      minify: true,
      esbuild: {
        minify: true,
      },
    },
  };
});
