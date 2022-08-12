import { Canvas } from '@antv/g-canvas';
import HtmlAnnotation from '../../src/annotation/html';

describe('html annotation alignX', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'cant';
  new Canvas({
    container: 'cant',
    width: 500,
    height: 500,
  });
  const parent = document.createElement('div');
  dom.appendChild(parent);

  const html = new HtmlAnnotation({
    parent,
    html: '2222',
    x: 400,
    y: 200,
    alignX: 'middle',
  });

  it('init', () => {
    // 添加自定义的匹配器
    expect.extend({
      toBeWithinRange(received, floor, ceiling) {
        const pass = received >= floor && received <= ceiling;
        if (pass) {
          return {
            message: () =>
              `expected ${received} not to be within range ${floor} - ${ceiling}`,
            pass: true,
          };
        } else {
          return {
            message: () =>
              `expected ${received} to be within range ${floor} - ${ceiling}`,
            pass: false,
          };
        }
      },
    });

    html.init();
    html.render();
    const container = parent.children[0] as HTMLElement;
    // @ts-ignore
    expect(Number(container.style.left.replace('px', ''))).toBeWithinRange(380, 390);
  });

  it('destroy', () => {
    html.destroy();
    expect(html.destroyed).toBe(true);
    expect(parent.children).toHaveLength(0);
  });
});
