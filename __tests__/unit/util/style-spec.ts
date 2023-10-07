import { createDom } from '@antv/dom-util';
import { applyStyleSheet } from '../../../src/util';

describe('getStyle', () => {
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
    expect(dom.querySelector('.c').style.padding).toBe('0px 0px 0px 0px');
    expect(dom.querySelector('.d').style.marginLeft).toBe('10px');
  });
});
