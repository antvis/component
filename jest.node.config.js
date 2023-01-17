// Installing third-party modules by tnpm or cnpm will name modules with underscore as prefix.
// In this case _{module} is also necessary.
const esm = ['internmap', 'd3-*', 'lodash-es', 'jsdom'].map((d) => `_${d}|${d}`).join('|');

module.exports = {
  testTimeout: 30000,
  preset: 'ts-jest/presets/js-with-ts',
  globals: {
    'ts-jest': {
      tsconfig: {
        target: 'es6',
        allowJs: true,
        sourceMap: true,
      },
    },
    DOMRect: class DOMRect {
      bottom = 0;
      left = 0;
      right = 0;
      top = 0;
      constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
      }
      static fromRect(other) {
        return new DOMRect(other.x, other.y, other.width, other.height);
      }
      toJSON() {
        return JSON.stringify(this);
      }
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  collectCoverage: false,
  testRegex: '(/__tests__/integration/.*\\.(test|spec))\\.(ts|tsx|js)$',
  // Transform esm to cjs.
  transformIgnorePatterns: [`<rootDir>/node_modules/(?!(${esm}))`],
};
