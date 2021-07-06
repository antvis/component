import { DisplayObject } from '@antv/g';
import { applyAttrs, isPC } from '../../../src/util';

describe('platform', () => {
  const USER_AGENTS_PC = {
    WinChrome:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
    MacChrome:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_0) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11',
    Ubuntu18_04Chrome:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Safari/537.36',

    WinFireFox: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:6.0) Gecko/20100101 Firefox/6.0',
    MACFireFox: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:2.0.1) Gecko/20100101 Firefox/4.0.1',
    Ubuntu18_04FireFox: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:73.0) Gecko/20100101 Firefox/73.0',

    MACSafari:
      'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50',
    WinSafari:
      'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50',
  };

  const USER_AGENTS_MOBILE = {
    IPhone:
      'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5',
    IPAD: 'Mozilla/5.0 (iPad; U; CPU OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5',
    Android:
      'Mozilla/5.0 (Linux; U; Android 2.3.7; en-us; Nexus One Build/FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',
  };
  test('PC', () => {
    Object.entries(USER_AGENTS_PC).forEach((item) => {
      expect(isPC(item[1])).toBe(true);
    });
  });
  test('Mobild', () => {
    Object.entries(USER_AGENTS_MOBILE).forEach((item) => {
      expect(isPC(item[1])).toBe(false);
    });
  });
});

describe('applyAttrs', () => {
  test('init', () => {
    const DO = new DisplayObject({
      attrs: {
        x: 1,
        y: 2,
        width: 10,
        height: 100,
      },
    });
    const { x, y, width, height } = DO.attributes;
    expect(x).toBe(1);
    expect(y).toBe(2);
    expect(width).toBe(10);
    expect(height).toBe(100);
  });

  test('changeAttrs', () => {
    const DO = new DisplayObject({
      attrs: {
        x: 1,
        y: 2,
        width: 10,
        height: 100,
      },
    });

    applyAttrs(DO, {
      x: 100,
      y: 20,
    });
    const { x, y, width, height } = DO.attributes;
    expect(x).toBe(100);
    expect(y).toBe(20);
    expect(width).toBe(10);
    expect(height).toBe(100);
  });
});
