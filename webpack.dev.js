const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
	mode: "development",

	devServer: {
		static: "./dist",
		port: 3000,
	},

	module: {
		rules: [
			{
				test: /\.s[ac]ss$/i,
				use: ["style-loader", "css-loader", "sass-loader"],
			},
		],
	},
});
