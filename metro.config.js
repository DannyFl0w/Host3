// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Resolver conflictos de Firebase
config.resolver.alias = {
  '@react-native-firebase/app': false,
  '@react-native-firebase/auth': false,
  '@react-native-firebase/firestore': false,
};

// Desactivar package.json exports si hay problemas
config.resolver.unstable_enablePackageExports = false;

module.exports = config;