import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import pkg from './package.json'

var env = process.env.NODE_ENV
var config = [
	// browser-friendly UMD build
	{
		input: 'src/main.js',
		output: {
			file: pkg.browser,
			format: 'umd'
		},
		name: 'howLongUntilLunch',
		plugins: [
			resolve(), // so Rollup can find `ms`
      babel({
        exclude: 'node_modules/**'
      }),
      commonjs(), // so Rollup can convert `ms` to an ES module
      replace({
        'process.env.NODE_ENV': JSON.stringify(env)
      }),
      uglify({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      }),
    ]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify
	// `file` and `format` for each target)
	{
		input: 'src/main.js',
		external: ['ms'],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		]
	}
]

export default config
