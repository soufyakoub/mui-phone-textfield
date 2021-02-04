import resolve from '@rollup/plugin-node-resolve';
import json from "@rollup/plugin-json";
import ts from "@wessberg/rollup-plugin-ts";
import smartAsset from "rollup-plugin-smart-asset";
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
		smartAsset({
			url: "copy",
			assetsPath: "../assets", // relative to the output directory.
			useHash: false,
			keepImport: true,
			sourceMap: true,
		}),
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
