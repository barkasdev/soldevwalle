const { override } = require("customize-cra");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path"); // Import path

const overrideEntry = (config) => {
  config.entry = {
    main: "./src/popup", // the extension UI
    background: "./public/background.js", // Keep background entry
    content: "./src/content",
  };
  return config;
};

const overrideOutput = (config) => {
  config.output = {
    ...config.output,
    filename: "static/js/[name].js",
    chunkFilename: "static/js/[name].js",
  };
  return config;
};

const addCopyPlugin = (config) => {
  config.plugins.push(
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/utils/wasm"), // ✅ Ensure WASM files are copied
          to: "static/wasm", // ✅ Ensure manifest.json references this path
        },
        {
          from: path.resolve(__dirname, "public/background.js"), // ✅ Ensure background.js is copied
          to: "background.js", // ✅ Place in the root of the build folder
        },
      ],
    })
  );
  return config;
};

module.exports = {
  webpack: (config) => override(overrideEntry, overrideOutput, addCopyPlugin)(config),
};
