import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser'; 

const plugins = [
  commonjs(),
  typescript({
    useTsconfigDeclarationDir: true,
    tsconfigOverride: { exclude: ['**/__tests__/**', '**/setupTests.*'] },
  }),
  terser(),
];

const config = {
  plugins,
  input: "src/index.ts",
  output: [
    { file: "dist/index.umd.js", format: 'umd', sourcemap: true, name: 'webrtcMock' },
    { file: "dist/index.es5.js", format: 'es', sourcemap: true },
  ],
};

export default config;
