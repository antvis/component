import { getRange, getStackedData } from '../../../../src/ui/sparkline/utils';

describe('getStackedData', () => {
  test('positive', async () => {
    const data = [
      [1, 2, 3, 4, 5],
      [2, 3, 4, 5, 1],
    ];
    const stackedData = getStackedData(data);
    const expectedData = [
      [1, 2, 3, 4, 5],
      [3, 5, 7, 9, 6],
    ];
    expect(stackedData).toStrictEqual(expectedData);
  });

  test('negative', async () => {
    let data = [
      [1, -2, -3, -4, 5],
      [-2, 3, -4, 5, -1],
    ];
    let stackedData = getStackedData(data);
    let expectedData = [
      [1, -2, -3, -4, 5],
      [-2, 3, -7, 5, -1],
    ];
    expect(stackedData).toStrictEqual(expectedData);

    data = [
      [1, -2, -3, -4, 5],
      [-2, 3, -4, 5, -1],
      [-3, -3, 0, -15, 10],
    ];
    stackedData = getStackedData(data);
    expectedData = [
      [1, -2, -3, -4, 5],
      [-2, 3, -7, 5, -1],
      [-5, -5, 0, -19, 15],
    ];
    expect(stackedData).toStrictEqual(expectedData);
  });
});

describe('getRange', () => {
  test('getRange', async () => {
    const data = [
      [1, 2, 3, 4, 5],
      [2, 3, 4, 5, 1],
    ];
    expect(getRange(data)).toStrictEqual([1, 5]);
  });
});
