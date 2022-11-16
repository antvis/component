import { transpose } from '../../../src/util';

describe('transpose', () => {
  it('transpose', () => {
    expect(
      transpose([
        [1, 2, 3],
        [4, 5, 6],
      ])
    ).toEqual([
      [1, 4],
      [2, 5],
      [3, 6],
    ]);
  });
});
