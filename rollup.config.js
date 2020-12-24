import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import postcss_assets from "postcss-assets";
import cssnano from "cssnano";
import json from "@rollup/plugin-json";
import ts from "@wessberg/rollup-plugin-ts";
import { terser } from "rollup-plugin-terser";
import path from "path";
import pkg from "./package.json";

const production = process.env.NODE_ENV === "production";
const extensions = ['.ts', '.tsx', '.js', '.json'];
const externals = [
	...Object.keys(pkg.peerDependencies),
	...Object.keys(pkg.dependencies),
];

export default {
	input: path.join(__dirname, "src", 'index.tsx'),
	output: [
		production && {
			file: pkg.main,
			format: 'cjs',
			exports: "named",
			sourcemap: true,
		},
		{
			file: pkg.module,
			format: 'esm',
			sourcemap: true,
		}
	],
	external: id => new RegExp(externals.join("|")).test(id),
	plugins: [
		resolve({ extensions }),
		postcss({ plugins: [postcss_assets(), production && cssnano()] }),
		json(),
		ts({
			transpiler: "babel",
			exclude: "node_modules/**/*",
			tsconfig: resolvedConfig => ({ ...resolvedConfig, declaration: production }),
		}),
		production && terser(),
	],
	watch: {
		exclude: /node_modules/,
	},
};
