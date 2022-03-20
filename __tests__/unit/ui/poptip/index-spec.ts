import { Poptip } from '../../../../src';

Array.from(document.getElementsByClassName(Poptip.tag)).forEach((poptip) => {
  poptip.remove();
});

const poptip = new Poptip({
  style: {
    domStyles: {
      '.gui-poptip': {
        width: '100px',
        height: '30px',
      },
    },
    offset: [10, 10],
    text: '测试1',
  },
});

describe('poptip', () => {
  test('basic', async () => {
    expect(poptip.getContainer().getElementsByClassName('gui-poptip-text')[0].textContent).toBe('测试1');

    poptip.showTip(200, 300, { text: '测试2' });
    expect(poptip.getContainer().getElementsByClassName('gui-poptip-text')[0].textContent).toBe('测试2');
    expect(poptip.getContainer().style).toMatchObject({
      left: '210px',
      top: '310px',
    });
  });

  test('update', () => {
    poptip.hideTip();
    poptip.update({ text: '测试3', follow: true });
    poptip.showTip(180, 300, { offset: [20, 20] });

    expect(poptip.getContainer().getElementsByClassName('gui-poptip-text')[0].textContent).toBe('测试3');
    expect(poptip.getContainer().style).toMatchObject({
      left: '200px',
      top: '320px',
    });
  });
});
