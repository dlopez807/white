// var HTMLWebpackPlugin = require('html-webpack-plugin');
// var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
// 	template: __dirname + 'index.html',
// 	filename: 'index.html',
// 	inject: 'body'
// });
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	// entry: {
	// 	white: [
	// 		'webpack-dev-server/client?http://localhost:7268',
	// 		 __dirname + '/app.js'
	// 	]
	// },
	entry: './style.scss',
	module: {
		// loaders: [
		// 	// {
		// 	// 	test: /\.js$/,
		// 	// 	exclude: /node_modules/,
		// 	// 	loader: 'babel-loader'
		// 	// },
		// 	{
		// 		test: /\.scss$/,
		// 		exclude: /node_modules/,
		// 		loader: ExtractTextPlugin.extract('css!sass')
		// 	}
		// ]
		rules: [
			/*
			your other rules for JavaScript transpiling go in here
			*/
			{ // regular css files
				test: /\.css$/,
				loader: ExtractTextPlugin.extract({
					loader: 'css-loader?importLoaders=1',
			}),
			},
			{ // sass / scss loader for webpack
				test: /\.(sass|scss)$/,
				loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
			}
		]
	},
	output: {
		filename: 'index_bundle.js',
		path: __dirname + '/public'
	},
	plugins: [
		//HTMLWebpackPluginConfig,
		new ExtractTextPlugin({
			filename: '/style.css',
	    	allChunks: true
		})
	]
};