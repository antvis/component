import { isPointInsideRectangle } from '../../../../src/ui/axis/utils/contain';

describe('isPointInsideRectangle', () => {
  const bbox1: any = [
    [0, 0],
    [100, 0],
    [100, 100],
    [0, 100],
  ];

  const bbox2: any = [
    [50, 50],
    [150, 50],
    [150, 150],
    [50, 150],
  ];

  test('isPointInsideRectangle', async () => {
    expect(isPointInsideRectangle(bbox1, [50, 50])).toBe(true);
    expect(isPointInsideRectangle(bbox1, [-1, -1])).toBe(false);
    expect(isPointInsideRectangle(bbox2, [100, 100])).toBe(true);
    expect(isPointInsideRectangle(bbox2, [49, 49])).toBe(false);
  });
});
