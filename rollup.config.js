import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import json from '@rollup/plugin-json'
import { eslint } from 'rollup-plugin-eslint'

import pkg from './package.json'

const input = 'src/index.js'

const plugins = (mode) => [
  resolve({
    browser: true,
  }),
  json(),
  commonjs(),
  babel({
    babelrc: false,
    babelHelpers: mode === 'browser' ? 'bundled' : 'runtime',
    presets: [
      [
        '@babel/preset-env',
        {
          'modules': false
        },
      ],
    ],
    plugins: mode === 'browser' ? [] : ['@babel/plugin-transform-runtime'],
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
      exports: 'auto',
    },
    plugins: plugins('browser').concat([
      uglify({
        warnings: true,
        compress: {
          pure_getters: true,
        }
      }),
    ]),
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: input,
    external: ['axios', /@babel\/runtime/],
    output: [
      { name: pkg.name, file: pkg.module.replace('.esm', '.cjs'), format: 'cjs', exports: 'auto' },
      { name: pkg.name, file: pkg.module, format: 'es', exports: 'auto' }
    ],
    plugins: plugins('node').concat([
      eslint({
        exclude: 'src/**',
      }),
    ]),
  }
]

export default config
