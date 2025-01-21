// const { override } = require('customize-cra')
// const { manifest } = require('webextension-polyfill')

// const overrideEntry = (config) => {
//   config.entry = {
//     main: './src/popup', // the extension UI
//     background: './src/background',
//     content: './src/content',
//     //manifest: './src/manifest',
//   }
//   console.log("did a thing")
//   return config
// }

// const overrideOutput = (config) => {
//   config.output = {
//     ...config.output,
//     filename: 'static/js/[name].js',
//     chunkFilename: 'static/js/[name].js',
//     hashDigestLength: 0
//   }
//   console.log("did another thing")
//   return config
// }

// module.exports = {
//   webpack: (config) => override(overrideEntry, overrideOutput)(config),
// }

const { override } = require('customize-cra')

const overrideEntry = (config) => {
  config.entry = {
    main: './src/popup', // the extension UI
    background: './src/background',
    content: './src/content',
  }
  return config
}

const overrideOutput = (config) => {
  config.output = {
    ...config.output,
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].js',
  }

  return config
}

module.exports = {
  webpack: (config) => override(overrideEntry, overrideOutput)(config),
}