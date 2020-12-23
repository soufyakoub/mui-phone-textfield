const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = env => ({
	mode: env.NODE_ENV === "production" ? "production" : "development",
	entry: path.resolve(__dirname, "index.js"),
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: '[name].[chunkhash].js',
		publicPath: env.NODE_ENV === "production"
			// This is the base path in the github-pages examples website. (the name of the github repository)
			? "/mui-phone-textfield"
			: "/",
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
		open: true
	},
});
