import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import json from 'rollup-plugin-json'
import eslint from 'rollup-plugin-eslint'

import pkg from './package.json'

const env = process.env.NODE_ENV
const plugins = [
  resolve({
    browser: true,
  }), // so Rollup can find `ms`
  json(),
  commonjs(), // so Rollup can convert `ms` to an ES module
  babel({
    babelrc: false,
    presets: [
      [
        'env',
        {
          'modules': false
        },
      ],
    ],
    plugins: ['external-helpers'],
    exclude: 'node_modules/**'
  }),
]
var config = [
  // browser-friendly UMD build
  {
    input: 'src/index.js',
    output: {
      file: pkg.browser,
      format: 'umd'
    },
    name: 'Scnnr',
    plugins: plugins.concat([
      uglify({
        compress: {
          pure_getters: true,
          warnings: true,
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
    input: 'src/index.js',
    external: ['axios'],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    name: 'Scnnr',
    plugins: plugins.concat([
      eslint({
        exclude: 'src/**',
      }),
    ]),
  }
]

export default config
