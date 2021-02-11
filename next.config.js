const path = require('path')

module.exports = {
  webpack: (config, options) => {
    if(!config.resolve) config.resolve = {}
    config.resolve.alias = {
      ...(config.resolve && config.resolve.alias ? config.resolve.alias : {}),
      '~': path.resolve(__dirname, './src'),
    }
    return config
  }
}