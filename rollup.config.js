import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import pkg from './package.json'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

const extensions = ['.js', '.jsx', '.ts', '.tsx']

export default {
    input: './src/index.ts',
    // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
    // https://rollupjs.org/guide/en#external-e-external
    // external: ['react', 'react-final-form', 'final-form'],

    plugins: [
        peerDepsExternal(),
        // Allows node_modules resolution
        resolve({ extensions }),

        // Allow bundling cjs modules. Rollup doesn't understand cjs
        commonjs(),

        // Compile TypeScript/JavaScript files
        babel({ extensions, exclude: ['node_modules/**'] })
    ],

    output: [
        {
            file: pkg.main,
            format: 'cjs'
        },
        {
            file: pkg.module,
            format: 'es'
        }
        // {
        //     file: pkg.browser,
        //     format: 'iife',
        //     name,
        //
        //     // https://rollupjs.org/guide/en#output-globals-g-globals
        //     globals: {}
        // }
    ]
}
