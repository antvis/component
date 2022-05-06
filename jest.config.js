// Installing third-party modules by tnpm or cnpm will name modules with underscore as prefix.
// In this case _{module} is also necessary.
const esm = ['internmap', 'd3-*', 'lodash-es'].map((d) => `_${d}|${d}`).join('|');

module.exports = {
  runner: 'jest-electron/runner',
  testEnvironment: 'jest-electron/environment',
  testTimeout: 30000,
  preset: 'ts-jest/presets/js-with-ts',
  globals: {
    'ts-jest': {
      tsConfig: {
        target: 'esnext', // Increase test coverage.
        allowJs: true,
        sourceMap: true,
      },
    },
  },
  collectCoverage: true,
  testRegex: '/__tests__/.*(-|\\.)spec\\.ts?$',
  setupFilesAfterEnv: ['./jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!**/checkbox/**',
    '!**/button/**',
    '!**/breadcrumb/**',
    '!**/(countdown|statistic|link|toolbox)/**',
  ], // Transform esm to cjs.
  transformIgnorePatterns: [`<rootDir>/node_modules/(?!(${esm}))`],
};
