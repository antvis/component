import { lineLen } from '../../../../src';

describe('length', () => {
  test('length', () => {
    expect(lineLen([0, 0], [30, 40])).toBeCloseTo(50);
    expect(lineLen([0, 0], [-30, 40])).toBeCloseTo(50);
    expect(lineLen([0, 0], [30, -40])).toBeCloseTo(50);
    expect(lineLen([0, 0], [-30, -40])).toBeCloseTo(50);

    expect(lineLen([30, 40], [0, 0])).toBeCloseTo(50);
    expect(lineLen([-30, 40], [0, 0])).toBeCloseTo(50);
    expect(lineLen([30, -40], [0, 0])).toBeCloseTo(50);
    expect(lineLen([-30, -40], [0, 0])).toBeCloseTo(50);
  });
});
