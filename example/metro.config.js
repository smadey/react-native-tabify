/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path')
// const metro = require('metro')

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    // blacklistRE: metro.createBlacklist([path.resolve(__dirname, '../node_modules')]),
    extraNodeModules: new Proxy({}, {
      get: (target, name) => path.join(__dirname, `node_modules/${name}`),
    }),
  },
  watchFolders: [
    path.resolve(__dirname, '..'),
  ],
}
