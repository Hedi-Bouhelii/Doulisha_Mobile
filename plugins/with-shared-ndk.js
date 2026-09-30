const { withProjectBuildGradle } = require('expo/config-plugins');

const MARKER = '// doulisha: shared NDK';

/**
 * Native modules that compile C++ without naming an NDK (expo-updates) would
 * use the Android Gradle plugin's default NDK, a second 1 GB download next to
 * React Native's. This makes them use React Native's version; modules that
 * name their own still override it.
 */
module.exports = function withSharedNdk(config) {
  return withProjectBuildGradle(config, (mod) => {
    if (!mod.modResults.contents.includes(MARKER)) {
      mod.modResults.contents += `
${MARKER} (plugins/with-shared-ndk.js)
subprojects { sub ->
  sub.plugins.withId('com.android.library') {
    sub.android.ndkVersion = rootProject.ext.ndkVersion
  }
}
`;
    }
    return mod;
  });
};
