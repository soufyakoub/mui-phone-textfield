import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import postcss_assets from "postcss-assets";
import cssnano from "cssnano";
import json from "@rollup/plugin-json";
import typescript from 'rollup-plugin-typescript2';
import { terser } from "rollup-plugin-terser";
import path from "path";

const production = process.env.NODE_ENV === "production";
const extensions = ['.ts', '.tsx', '.js', '.json'];

export default {
	input: path.join(__dirname, "src", 'index.tsx'),
	output: {
		file: path.join(__dirname, "dist", 'bundle.js'),
		format: 'cjs',
		exports: "named"
	},
	external: id => /react|@material-ui/.test(id),
	plugins: [
		resolve({ extensions }),
		typescript(),
		json(),
		babel({ extensions, babelHelpers: "bundled", exclude: /node_modules/ }),
		commonjs(),
		postcss({ plugins: [postcss_assets(), production && cssnano()] }),
		production && terser()
	],
};
