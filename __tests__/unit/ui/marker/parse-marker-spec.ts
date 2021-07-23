import { parseMarker } from '../../../../src/ui/marker/utils';

describe('parseMarker', () => {
  test('symbol', async () => {
    expect(parseMarker('square')).toBe('symbol');
    expect(
      parseMarker((x, y, r) => {
        return [];
      })
    ).toBe('symbol');
  });

  test('img', async () => {
    expect(
      parseMarker(
        'data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7'
      )
    ).toBe('base64');

    expect(parseMarker('https://gw.alipayobjects.com/zos/rmsportal/fSPDqijMJrYFdODpgEBV.png')).toBe('url');
  });

  test('unknown', async () => {
    expect(parseMarker(undefined)).toBe('default');
  });
});
