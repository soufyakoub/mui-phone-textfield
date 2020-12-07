const path = require('path');

module.exports = {
	mode: "development",
	entry: path.resolve(__dirname, "index.js"),
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'bundle.js',
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
	devServer: {
		contentBase: path.join(__dirname, 'public'),
		port: 3000,
		liveReload: true,
		open: true
	},
};
