import path from "path";

export default {
  mode: "development",
  entry: {
    mapa: "./src/js/mapa.js",
  },
  output: {
    path: path.resolve("public/js"),
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
