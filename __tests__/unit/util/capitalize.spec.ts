import { capitalize } from '../../../src/util';

describe('capitalize', () => {
  it('capitalize', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('capitalize empty string', () => {
    expect(capitalize('')).toBe('');
  });
});
