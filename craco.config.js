const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  babel: {
    presets: [["@babel/preset-react", { runtime: "automatic", importSource: "@emotion/react" }]],
    plugins: ["@emotion/babel-plugin"],
  },
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          webpackConfig.resolve.plugins.push(new TsconfigPathsPlugin({}));
          return webpackConfig;
        },
      },
    },
  ],
};
