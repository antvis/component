import { getItemsBBox } from '../../../../src/util/layout/utils';

describe('utils', () => {
  it('getItemsBBox', () => {
    const items = [
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
      {
        x: 100,
        y: 100,
        width: 50,
        height: 70,
      },
    ];
    const bbox = getItemsBBox(items);
    expect(bbox).toEqual({
      x: 0,
      y: 0,
      width: 150,
      height: 170,
    });

    const items2 = [
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
      {
        x: -10,
        y: -10,
        width: 100,
        height: 100,
      },
    ];
    const bbox2 = getItemsBBox(items2);
    expect(bbox2).toEqual({
      x: -10,
      y: -10,
      width: 110,
      height: 110,
    });
  });
});
