const { FusesPlugin } = require("@electron-forge/plugin-fuses");
const { FuseV1Options, FuseVersion } = require("@electron/fuses");

module.exports = {
  packagerConfig: {
    asar: true,
    name: "LMS.Notify",
    executableName: "lms-notify",
    extraResource: ["./dist/inject"],
    appBundleId: "com.lms.notify",
    appCategoryType: "public.app-category.productivity",
    ignore: [
      /^\/src/,
      /^\/\.git/,
      /^\/node_modules\/\.bin/,
      /^\/\.vscode/,
      /^\/scripts/,
      /^\/\.github/,
      /^\/tsconfig\./,
      /^\/nodemon\.json$/,
      /\\.map$/,
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "LMS.Notify",
        authors: "Ahmed Ghait",
        description: "LMS Notify Desktop Application",
        setupExe: "LMS-Notify-Setup.exe",
        setupIcon: "./icon.ico",
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin", "win32"],
    },
    // {
    //   name: "@electron-forge/maker-dmg",
    //   config: {
    //     format: "ULFO",
    //     icon: "./icon.icns",
    //   },
    // },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
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
