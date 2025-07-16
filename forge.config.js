const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: './assets/mosque.ico', // Add icon to packager config
  },
  rebuildConfig: {},
  makers: [
    // Temporarily commented out Squirrel maker due to build error
    // {
    //   name: '@electron-forge/maker-squirrel',
    //   config: {
    //     name: 'athan-app',
    //     authors: 'Numair Hussain',
    //     description: 'Islamic Prayer Times App',
    //     iconUrl: 'https://raw.githubusercontent.com/NumairHussain/AthanApp/main/assets/mosque.ico',
    //     setupIcon: './assets/mosque.ico',
    //     loadingGif: './assets/mosque.ico',
    //     noMsi: true
    //   },
    //   platforms: ['win32']
    // },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
    {
      name: '@electron-forge/maker-wix',
      config: {
        language: 1033,
        manufacturer: 'NHProd', // Match package.json publisherDisplayName
        scope: 'perUser',
        programFilesFolderName: 'AthanApp',
        shortcutFolderName: 'AthanApp',
        name: 'AthanApp', // Clean package name without suffixes
        ui: {
          chooseDirectory: false
        }
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
