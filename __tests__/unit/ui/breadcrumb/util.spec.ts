import {} from 'ts-jest';
import { transformPadding } from '../../../../src/ui/breadcrumb/util';

describe('breadcrumb utils', () => {
  it('test transformPadding', () => {
    let padding = transformPadding();
    expect(padding).toEqual([0, 0, 0, 0]);

    padding = transformPadding(8);
    expect(padding).toEqual([8, 8, 8, 8]);

    padding = transformPadding([8]);
    expect(padding).toEqual([8, 8, 8, 8]);

    padding = transformPadding([1, 2]);
    expect(padding).toEqual([1, 2, 1, 2]);

    padding = transformPadding([1, 2, 3]);
    expect(padding).toEqual([1, 2, 3, 2]);

    padding = transformPadding([1, 2, 3, 4]);
    expect(padding).toEqual([1, 2, 3, 4]);

    // @ts-ignore
    expect(() => transformPadding('abc')).toThrowError(new Error('padding must be number or array'));
  });
});
