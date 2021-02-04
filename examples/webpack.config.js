const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = env => ({
	mode: env.NODE_ENV === "production" ? "production" : "development",
	entry: path.resolve(__dirname, "index.js"),
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: '[chunkhash].js',
		publicPath: env.NODE_ENV === "production"
			// This is the base path in the github-pages examples website. (the name of the github repository)
			? "/mui-phone-textfield"
			// Using a relative path here so that after `npm run dev`,
			// the `index.html` file can be inspected in the browser without launching a server.
			: "",
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader'
				},
				exclude: /node_modules/
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				loader: 'file-loader',
				options: {
					outputPath: "images",
				},
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "index.html"),
		})
	],
	devServer: {
		contentBase: path.join(__dirname, 'public'),
		port: 3000,
		liveReload: true,
		open: true,
		watchOptions: {
			ignored: /node_modules/,
		},
	},
	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all',
			maxInitialRequests: Infinity,
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name(module) {
						// Get the package name.
						// Example: node_modules/package-name/not/this/part.js
						// or node_modules/package-name
						const package_name = module.context.match(/[\\/]node_modules[\\/](.+?)([\\/]|$)/)[1];

						// npm package names are URL-safe, but some servers don't like @ symbols.
						return package_name.replace('@', '');
					},
				},
			},
		},
	},
});
