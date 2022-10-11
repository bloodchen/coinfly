import babel from "@rollup/plugin-babel";
import commonjs from '@rollup/plugin-commonjs';
import { terser } from "rollup-plugin-terser";
import resolve from '@rollup/plugin-node-resolve';
import versionInjector from 'rollup-plugin-version-injector';

export default [
{
  input: ['src/coinfly.js'],
  output: {
    file:"dist/coinfly.min.js",
    format: "umd",
    name: 'coinfly'
  },
  plugins: [ 
  versionInjector(),
  resolve(),
  babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
  commonjs(),
  //terser() 
  ],
},
 
];