const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');
const dotenv = require('dotenv');

module.exports = (env) => {
  // 根据传入的环境变量加载相应的.env文件
  const envFile = env.production ? '.env.prod' : '.env.local';
  const envVariables = dotenv.config({ path: envFile }).parsed;

  // 将环境变量转换为webpack能够处理的格式
  const envKeys = Object.keys(envVariables).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(envVariables[next]);
    return prev;
  }, {});

  return {
    entry: {
      index: "./src/index.tsx",
      content_script: path.join(__dirname, 'src', 'contentScript.ts'),
    },
    mode: "production",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                compilerOptions: {noEmit: false},
              }
            }],
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: [
            "style-loader",
            "css-loader",
            "postcss-loader"
          ]

        },
      ],
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {from: "manifest.json", to: "../manifest.json"},
          {from: "src/assets", to: "../assets"}
        ],
      }),
      new webpack.DefinePlugin(envKeys),
      ...getHtmlPlugins(["index"]),
    ],
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      path: path.join(__dirname, "dist/js"),
      filename: "[name].js",
    },
  }
};

function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HTMLPlugin({
        title: "React extension",
        filename: `${chunk}.html`,
        chunks: [chunk],
      })
  );
}