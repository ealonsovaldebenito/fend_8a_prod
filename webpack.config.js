const path = require("path")

module.exports = {
  entry: "./src/index.tsx", // Punto de entrada
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    alias: {
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Regla para los archivos TypeScript y TSX
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/, // Regla para archivos CSS
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
}
