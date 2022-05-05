import { deepAssign } from '../../../src';

describe('deepAssign', () => {
  it('deepAssign', () => {
    const fn = jest.fn();
    // undefined -> number
    expect(deepAssign({}, { value: 0 }, { value: undefined })).toEqual({ value: undefined });
    expect(deepAssign({}, { value: undefined }, { value: 0 })).toEqual({ value: 0 });
    // boolean -> boolean
    expect(deepAssign({}, { value: false }, { value: true })).toEqual({
      value: true,
    });
    expect(deepAssign({}, { value: true }, { value: false })).toEqual({
      value: false,
    });
    // null -> boolean
    expect(deepAssign({}, { value: true }, { value: null })).toEqual({
      value: null,
    });
    expect(deepAssign({}, { value: false }, { value: null })).toEqual({
      value: null,
    });
    // boolean => ''
    expect(deepAssign({}, { value: true }, { value: '' })).toEqual({
      value: '',
    });
    expect(deepAssign({}, { value: '' }, { value: false })).toEqual({
      value: false,
    });
    expect(deepAssign({}, { value: '' }, { value: true })).toEqual({
      value: true,
    });
    // string => string
    expect(deepAssign({}, { value: 'a' }, { value: 'b' })).toEqual({
      value: 'b',
    });
    // string => NaN
    expect(deepAssign({}, { value: NaN }, { value: 'NaN' })).toEqual({
      value: 'NaN',
    });
    // boolean => NaN
    expect(deepAssign({}, { value: true }, { value: NaN })).toEqual({
      value: NaN,
    });
    // fn
    expect(deepAssign({}, { value: 0 }, { value: undefined, callback: fn })).toEqual({
      value: undefined,
      callback: fn,
    });
    // Array
    expect(deepAssign({}, { value: 0, callback: fn }, { value: 1, callback: fn, list: [0, 2, 1] })).toEqual({
      value: 1,
      callback: fn,
      list: [0, 2, 1],
    });
    expect(deepAssign({}, { value: 0, callback: fn, list: [1] }, { value: 1, callback: fn, list: [0, 2, 1] })).toEqual({
      value: 1,
      callback: fn,
      list: [0, 2, 1],
    });
    // Date
    const targetDate = new Date();
    expect(deepAssign({}, { value: 1, callback: fn }, { value: targetDate, callback: fn, list: [0, 2, 1] })).toEqual({
      value: targetDate,
      callback: fn,
      list: [0, 2, 1],
    });
    const sourceDate = new Date();
    expect(deepAssign({}, { value: sourceDate, callback: fn }, { value: 1, callback: fn, list: [0, 2, 1] })).toEqual({
      value: 1,
      callback: fn,
      list: [0, 2, 1],
    });
    // RegExp
    expect(
      deepAssign({}, { value: 1, callback: fn }, { value: new RegExp('a', 'g'), callback: fn, list: [0, 2, 1] })
    ).toEqual({
      value: new RegExp('a', 'g'),
      callback: fn,
      list: [0, 2, 1],
    });
    expect(
      deepAssign({}, { value: new RegExp('a', 'g'), callback: fn }, { value: 1, callback: fn, list: [0, 2, 1] })
    ).toEqual({
      value: 1,
      callback: fn,
      list: [0, 2, 1],
    });
    // object
    expect(
      deepAssign(
        {},
        {
          value: null,
          callback: fn,
          data: {
            list: [
              {
                age: 19,
                name: 'xiaoming',
              },
            ],
          },
        },
        { value: undefined, callback: fn }
      )
    ).toEqual({
      value: undefined,
      callback: fn,
      data: {
        list: [
          {
            age: 19,
            name: 'xiaoming',
          },
        ],
      },
    });

    expect(
      deepAssign(
        {},
        {
          value: null,
          callback: fn,
          data: {
            list: [
              {
                age: 19,
                name: 'xiaoming',
              },
            ],
          },
        },
        {
          value: undefined,
          callback: fn,
          data: {
            list: [
              {
                age: 18,
                name: 'xiaoming',
              },
            ],
          },
        }
      )
    ).toEqual({
      value: undefined,
      callback: fn,
      data: {
        list: [
          {
            age: 18,
            name: 'xiaoming',
          },
        ],
      },
    });

    expect(
      deepAssign(
        {},
        {
          value: null,
          callback: fn,
          data: {
            list: [
              {
                age: 19,
                name: 'xiaoming',
              },
            ],
          },
        },
        {
          value: undefined,
          callback: fn,
          status: 200,
          data: {
            list: [
              {
                age: 18,
                name: 'xiaoming',
              },
            ],
          },
        }
      )
    ).toEqual({
      value: undefined,
      callback: fn,
      status: 200,
      data: {
        list: [
          {
            age: 18,
            name: 'xiaoming',
          },
        ],
      },
    });
    // MAX_MIX_LEVEL
    expect(
      deepAssign(
        {},
        {
          value: null,
          callback: fn,
          data: {
            list: [
              {
                age: 19,
                name: 'xiaoming',
              },
            ],
          },
        },
        {
          value: undefined,
          callback: fn,
          data: {
            list: [
              {
                age: 18,
                name: 'xiaoming',
              },
            ],
          },
        }
      )
    ).toEqual({
      value: undefined,
      callback: fn,
      data: {
        list: [
          {
            age: 18,
            name: 'xiaoming',
          },
        ],
      },
    });

    expect(
      deepAssign(
        {},
        {
          value: null,
          deep1: {
            deep2: {
              deep3: {
                deep4: {
                  deep5: {
                    deep6: {
                      name: 'kevin',
                      age: 18,
                    },
                  },
                },
              },
            },
          },
        },
        {
          value: undefined,
          deep1: {
            deep2: {
              deep3: {
                deep4: {
                  deep5: {
                    deep6: {
                      age: 19,
                    },
                  },
                },
              },
            },
          },
        }
      )
    ).toEqual({
      value: undefined,
      deep1: {
        deep2: {
          deep3: {
            deep4: {
              deep5: {
                deep6: {
                  age: 19,
                },
              },
            },
          },
        },
      },
    });
  });

  it('deepAssign(dist, src1, src2) mutable dist', () => {
    const dist = { a: 1 };
    const src1 = { a: 10, b: 24 };
    const src2 = { a: 3, c: 24 };

    expect(deepAssign(dist, src1, src2)).toBe(dist);
    expect(dist).toEqual({ a: 3, b: 24, c: 24 });

    const style1 = { len: 4, count: 0, style: { stroke: '#416180', strokeOpacity: 0.45, lineWidth: 0.5 } };
    const style2 = { count: 2 };
    expect(deepAssign({}, style1, style2)).toEqual({
      len: 4,
      count: 2,
      style: { stroke: '#416180', strokeOpacity: 0.45, lineWidth: 0.5 },
    });
  });

  it('deepAssign({}, { a: 1 }, { a: null|false|undefined })', () => {
    expect(deepAssign({}, { a: 1 }, { a: null })).toEqual({ a: null });
    expect(deepAssign({}, { a: 1 }, { a: false })).toEqual({ a: false });
    expect(deepAssign({}, { a: 1 }, { a: undefined })).toEqual({ a: undefined });
  });
});
