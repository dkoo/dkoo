const path = require( 'path' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );

module.exports = {
	mode: 'development',
	entry: {
		'main'     : './assets/js/main.js',
		'load-more': './assets/js/load-more.js'
	},
	output: {
		path: path.resolve( __dirname, 'dist' ),
		filename: '[name].js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							babelrc: true,
						}
					}
				]
			},
			{
				test: /\.css$/,
				include: path.resolve( './assets/css/' ),
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							url: false,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
						},
					},
				],

			}
		]
	},
	stats: {
		colors: true
	},
	plugins: [
		new CleanWebpackPlugin(),

		new MiniCssExtractPlugin( {
			filename: 'styles.css',
			chunkFilename: '[id].css'
		} ),

		new CopyWebpackPlugin( [
			{
				from: '**/*.{jpg,jpeg,png,gif,svg,eot,ttf,woff,woff2}',
				to: '[path][name].[ext]',
				context: path.resolve( process.cwd(), './assets/css' )
			}
		] )
	]
}
