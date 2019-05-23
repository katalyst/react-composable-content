import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import copy from 'rollup-plugin-copy'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import json from 'rollup-plugin-json';
import pkg from './package.json';

const input = './src/index.js';
const extensions = ['.js', '.jsx'];

// Treat as externals all not relative and not absolute paths
// e.g. 'react'
const excludeAllExternals = id => !id.startsWith('.') && !id.startsWith('/');

const getBabelOptions = ({ useESModules }) => ({
  exclude: 'node_modules/**',
  runtimeHelpers: true,
  plugins: [
    ['@babel/plugin-transform-runtime', { corejs: 2, useESModules }],
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-proposal-object-rest-spread",
    ["@babel/plugin-proposal-class-properties", { "spec": true }],
  ],
});

export default [
  // CommonJS (cjs) build
  // - External packages aren't bundled
  {
    input,
    output: { file: pkg.main, format: 'cjs' },
    external: excludeAllExternals,
    plugins: [
      json(),
      resolve({ extensions }),
      babel(getBabelOptions({ useESModules: false })),
      copy({
        targets: [
          'src/icons',
          'src/icons.js',
        ],
        outputFolder: 'dist',
      }),
      sizeSnapshot(),
    ],
  },
]