import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import postcss_assets from "postcss-assets";
import cssnano from "cssnano";
import { terser } from "rollup-plugin-terser";
import path from "path";

export default {
	input: path.join(__dirname, "src", 'index.js'),
	output: {
		file: path.join(__dirname, "dist", 'bundle.js'),
		format: 'cjs',
		exports: "named"
	},
	external: id => /react|@material-ui/.test(id),
	plugins: [
		resolve(),
		babel({ babelHelpers: "bundled", exclude: /node_modules/ }),
		commonjs(),
		postcss({ plugins: [postcss_assets(), cssnano()] }),
		terser()
	],
};
