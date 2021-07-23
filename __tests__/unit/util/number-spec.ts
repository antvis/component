import { toPrecision } from '../../../src';

describe('number', () => {
  test('toPrecision', async () => {
    expect(toPrecision(0.12345, 2)).toBe(0.12);
    expect(toPrecision(0.12345, 3)).toBe(0.12);
  });
});
