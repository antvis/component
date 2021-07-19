import { getDefaultStyle, getStateStyle } from '../../../src/util';

const defaultStyle = {
  fill: 'red',
  stroke: 'green',
  lineWidth: 10,
};
const active = {
  fill: 'green',
  stroke: 'blue',
};

const inactive = {
  fill: 'gray',
};

describe('getStyle', () => {
  test('getDefaultStyle', async () => {
    expect(getDefaultStyle(defaultStyle)).toStrictEqual(defaultStyle);
    expect(getDefaultStyle({ ...defaultStyle, active })).toStrictEqual(defaultStyle);
    expect(getDefaultStyle({ ...defaultStyle, active, inactive })).toStrictEqual(defaultStyle);
  });

  test('getStateStyle', async () => {
    expect(getStateStyle(defaultStyle)).toStrictEqual(defaultStyle);
    expect(getStateStyle({ ...defaultStyle, active })).toStrictEqual(defaultStyle);
    expect(getStateStyle({ ...defaultStyle, active }, 'active')).toStrictEqual(active);
    expect(getStateStyle({ ...defaultStyle, inactive }, 'inactive')).toStrictEqual(inactive);
    expect(getStateStyle({ ...defaultStyle, active }, 'active', true)).toStrictEqual({ ...defaultStyle, ...active });
    expect(getStateStyle({ ...defaultStyle, inactive }, 'inactive', true)).toStrictEqual({
      ...defaultStyle,
      ...inactive,
    });
  });
});
