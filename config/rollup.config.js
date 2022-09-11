import buble from 'rollup-plugin-buble';
import replace from 'rollup-plugin-replace';
// import typescript from 'rollup-plugin-typescript';
// import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import * as packageJson from '../package.json';

// import packageJson = require('../package.json');

// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
// var external = Object.keys(require('../package.json').dependencies);
const dependencies = packageJson.dependencies;
const external = Object.keys(dependencies);

export default config => {
  return {
    // input: 'src/index.ts',
    input: 'compiled/index.js',
    output: {
      format: config.format,
      file: config.dest,
    },
    external: external,
    plugins: [
      resolve(),
      commonjs(),
      // typescript({
      //   rollupCommonJSResolveHack: true,
      // }),
      buble(),
      replace({'process.browser': JSON.stringify(!!config.browser)})
    ]
  };
};
