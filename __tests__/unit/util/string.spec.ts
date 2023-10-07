import { toUppercaseFirstLetter, toLowercaseFirstLetter, addPrefix, removePrefix } from '../../../src/util/string';

describe('string', () => {
  it('toUppercaseFirstLetter', () => {
    expect(toUppercaseFirstLetter('hello')).toBe('Hello');
    expect(toUppercaseFirstLetter('')).toBe('');
    expect(toUppercaseFirstLetter('h')).toBe('H');
  });

  it('toLowercaseFirstLetter', () => {
    expect(toLowercaseFirstLetter('Hello')).toBe('hello');
    expect(toLowercaseFirstLetter('')).toBe('');
    expect(toLowercaseFirstLetter('H')).toBe('h');
  });

  it('addPrefix', () => {
    expect(addPrefix('hello', 'get')).toBe('getHello');
    expect(addPrefix('hello', 'set')).toBe('setHello');
  });

  it('removePrefix', () => {
    expect(removePrefix('getHello')).toBe('hello');
    expect(removePrefix('setHello')).toBe('hello');
    expect(removePrefix('getHello', 'get')).toBe('hello');
    expect(removePrefix('setHello', 'set')).toBe('hello');
    expect(removePrefix('getHello', 'get', false)).toBe('Hello');
    expect(removePrefix('setHello', 'set', false)).toBe('Hello');
  });
});
