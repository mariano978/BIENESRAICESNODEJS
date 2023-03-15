import path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
export default {
  mode: "development",
  entry: {
    mapa: "./src/js/mapa.js",
    tooltip: "./src/js/tooltip.js",
  },
  output: {
    path: path.resolve("public/js"),
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
