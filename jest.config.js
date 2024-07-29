// Installing third-party modules by tnpm or cnpm will name modules with underscore as prefix.
// In this case _{module} is also necessary.
const esm = ['internmap', 'd3-*', 'lodash-es'].map((d) => `_${d}|${d}`).join('|');

module.exports = {
  testTimeout: 100000,
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jsdom',
  transform: {
    '\\.[jt]sx?$': [
      'ts-jest',
      {
        tsconfig: {
          target: 'esnext', // Increase test coverage.
          allowJs: true,
          sourceMap: true,
        },
      },
    ], 
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  testRegex: '/__tests__/.*(-|\\.)spec\\.ts?$',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!**/checkbox/**',
    '!**/button/**',
    '!**/breadcrumb/**',
    '!**/(countdown|statistic|link|toolbox)/**',
  ],
  // Transform esm to cjs.
  transformIgnorePatterns: [`<rootDir>/node_modules/(?!(${esm}))`],
};
