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
      options: path.join(__dirname, 'src', 'options/index.tsx'),
    },
    mode: "production",
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
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
        {
          test: /\.html$/,
          loader: 'html-loader',
          exclude: /node_modules/,
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
      new HTMLPlugin({
        filename: 'index.html',
        chunks: ['index'],
        cache: false,
      }),
      new HTMLPlugin({
        template: path.join(__dirname, 'src/options/options.html'),
        filename: 'options.html',
        chunks: ['options'],
        cache: false,
      }),
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
