import { parsePosition } from '../../../src';

describe('pasePosition', () => {
  it('pasePosition', () => {
    expect(parsePosition('left-top')).toEqual(['l', 't']);
    expect(parsePosition('top')).toEqual(['t']);
  });
});
