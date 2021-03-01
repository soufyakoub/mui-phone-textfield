import resolve from '@rollup/plugin-node-resolve';
import json from "@rollup/plugin-json";
import ts from "@wessberg/rollup-plugin-ts";
import externalAssets from "rollup-plugin-external-assets";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

const isProduction = process.env.NODE_ENV === "production";
const externals = [
	...Object.keys(pkg.peerDependencies),
	...Object.keys(pkg.dependencies),
];

export default {
	input: "src/index.tsx",
	output: [
		isProduction && {
			dir: "dist",
			entryFileNames: "cjs/bundle.js",
			format: 'cjs',
			exports: "named",
			sourcemap: true,
		},
		{
			dir: "dist",
			entryFileNames: "esm/bundle.js",
			format: 'es',
			sourcemap: true,
		}
	],
	external: id => new RegExp(externals.join("|")).test(id),
	plugins: [
		externalAssets("src/assets/*.png"),
		resolve({
			extensions: ['.ts', '.tsx', '.js', '.json'],
		}),
		json(),
		ts({
			transpiler: "babel",
			exclude: "node_modules/**/*",
			tsconfig: resolvedConfig => ({ ...resolvedConfig, declaration: isProduction }),
		}),
		isProduction && terser(),
	],
	watch: {
		exclude: /node_modules/,
	},
};
