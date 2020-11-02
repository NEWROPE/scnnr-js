import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import { terser } from "rollup-plugin-terser"
import json from '@rollup/plugin-json'
import { eslint } from 'rollup-plugin-eslint'

import pkg from './package.json'

const input = 'src/index.js'

const plugins = (bundle) => [
  resolve({
    browser: true,
  }),
  json(),
  commonjs(),
  babel({
    babelrc: false,
    babelHelpers: bundle ? 'bundled' : 'runtime',
    presets: [
      [
        '@babel/preset-env',
        {
          'modules': false
        },
      ],
    ],
    plugins: bundle ? [] : ['@babel/plugin-transform-runtime'],
    exclude: 'node_modules/**',
  }),
]
var config = [
  // browser-friendly UMD build
  {
    input: input,
    output: {
      name: pkg.name,
      file: pkg.main,
      format: 'umd',
      exports: 'default',
    },
    plugins: plugins(true).concat([
      terser(),
    ]),
  },

  // browser-friendly ES module build
  {
    input: input,
    output: {
      name: pkg.name,
      file: pkg.main.replace('umd', 'esm'),
      format: 'es',
      exports: 'named',
    },
    plugins: plugins(true), // TODO: minifying
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have four entries in the configuration array
  // instead of three, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: input,
    external: ['axios'],
    output: [
      { name: pkg.name, file: pkg.module.replace('.esm', '.cjs'), format: 'cjs', exports: 'default' },
      { name: pkg.name, file: pkg.module, format: 'es', exports: 'named' },
    ],
    plugins: plugins(false).concat([
      eslint({
        exclude: 'src/**',
      }),
    ]),
  }
]

export default config
