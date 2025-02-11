const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: {
		index: "./src/auth/index.js",
		app: "./src/app/app.js",
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].[contenthash].js",
		clean: true,
	},

	module: {
		rules: [
			{
				test: /\.(?:js|mjs|cjs)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						targets: "defaults",
						presets: [["@babel/preset-env"]],
					},
				},
			},
			{
				test: /\.html$/i,
				loader: "html-loader",
				options: {
					postprocessor: content => {
						const isTemplateLiteralSupported = content[0] === "`";

						return content
							.replace(/<%=/g, isTemplateLiteralSupported ? `\${` : '" +')
							.replace(/%>/g, isTemplateLiteralSupported ? "}" : '+ "');
					},
				},
			},
			{
				test: /\.(png|svg|jpe?g|gif)$/i,
				type: "asset/resource",
				generator: {
					filename: "img/[hash][ext]",
				},
			},
			{
				test: /\.(woff(2)?|eot|ttf|otf)$/i,
				type: "asset/resource",
				generator: {
					filename: "fonts/[hash][ext]",
				},
			},
		],
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/auth/index.html",
			filename: "index.html",
			chunks: ["index"],
		}),
		new HtmlWebpackPlugin({
			template: "./src/app/app.html",
			filename: "app.html",
			chunks: ["app"],
		}),
	],
};
