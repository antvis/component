import { toPrecision, toThousands, toScientificNotation, toKNotation } from '../../../src';

describe('number', () => {
  test('toPrecision', async () => {
    expect(toPrecision(0.12345, 2)).toBe(0.12);
    expect(toPrecision(0.12345, 3)).toBe(0.123);
    expect(toPrecision(123.456, 1)).toBe(123.4);
  });

  test('toThousands', async () => {
    expect(toThousands(0.123)).toBe('0.123');
    expect(toThousands(123)).toBe('123');
    expect(toThousands(123456)).toBe('123,456');
  });

  test('toScientificNotation', async () => {
    expect(toScientificNotation(0.00001)).toBe('1e-5');
    expect(toScientificNotation(0)).toBe('0e+0');
    expect(toScientificNotation(123456)).toBe('1.23456e+5');
    expect(toScientificNotation(100000000)).toBe('1e+8');
    expect(toScientificNotation(-0)).toBe('0e+0');
    expect(toScientificNotation(-123456)).toBe('-1.23456e+5');
    expect(toScientificNotation(-100000000)).toBe('-1e+8');
  });

  test('toKNotation', async () => {
    expect(toKNotation(0.0001)).toBe('0.0001');
    expect(toKNotation(123)).toBe('123');
    expect(toKNotation(123456)).toBe('123K');
    expect(toKNotation(123456, 1)).toBe('123.4K');
    expect(toKNotation(1234567, 1)).toBe('1,234.5K');
    expect(toKNotation(100000000)).toBe('100,000K');

    expect(toKNotation(-123)).toBe('-123');
    expect(toKNotation(-123456)).toBe('-123K');
    expect(toKNotation(-123456, 1)).toBe('-123.4K');
    expect(toKNotation(-1234567, 1)).toBe('-1,234.5K');
    expect(toKNotation(-100000000)).toBe('-100,000K');
  });
});
