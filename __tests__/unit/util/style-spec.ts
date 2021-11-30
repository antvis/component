import { createDom } from '@antv/dom-util';
import { getDefaultStyle, getStateStyle, applyStyleSheet } from '../../../src/util';

const style = {
  default: {
    fill: 'red',
    stroke: 'green',
    lineWidth: 10,
  },
  disabled: {
    fill: 'gray',
  },
  active: {
    fill: 'green',
    stroke: 'blue',
  },
};

describe('getStyle', () => {
  test('getDefaultStyle', async () => {
    expect(getDefaultStyle(style)).toStrictEqual(style.default);
  });

  test('getStateStyle', async () => {
    expect(getStateStyle(style)).toStrictEqual(style.default);
    expect(getStateStyle(style, 'active')).toStrictEqual(style.active);
    expect(getStateStyle(style, 'disabled')).toStrictEqual(style.disabled);
    expect(getStateStyle(style, 'active', true)).toStrictEqual({ ...style.default, ...style.active });
    expect(getStateStyle(style, 'disabled', true)).toStrictEqual({ ...style.default, ...style.disabled });
  });

  test('applyStyleSheet', async () => {
    const dom = createDom("<div class='a'><div class='b'><div class='c'></div><div class='d'></div></div></div>");
    const styleSheet = {
      '.a': {
        width: '100px',
      },
      '.b': {
        width: '100px',
        'background-color': 'red',
      },
      '.c': {
        width: '100px',
        padding: '0 0 0 0',
      },
      '.d': {
        width: '100px',
        'margin-left': '10px',
      },
    };
    applyStyleSheet(dom, styleSheet);

    expect(dom.style.width).toBe('100px');
    expect(dom.querySelector('.b').style.backgroundColor).toBe('red');
    expect(dom.querySelector('.c').style.padding).toBe('0px');
    expect(dom.querySelector('.d').style.marginLeft).toBe('10px');
  });
});
