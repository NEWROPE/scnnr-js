import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import json from 'rollup-plugin-json'
import eslint from 'rollup-plugin-eslint'

import pkg from './package.json'

const input = 'src/index.js'

const plugins = [
  resolve({
    browser: true,
  }),
  json(),
  commonjs(),
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
    input: input,
    output: {
      file: pkg.main,
      format: 'umd'
    },
    name: pkg.name,
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
    input: input,
    external: ['axios'],
    output: [
      { file: pkg.module.replace('.esm', '.cjs'), format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    name: pkg.name,
    plugins: plugins.concat([
      eslint({
        exclude: 'src/**',
      }),
    ]),
  }
]

export default config
