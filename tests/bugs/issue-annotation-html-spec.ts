import { Canvas } from '@antv/g-canvas';
import Theme from '../../src/util/theme';
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
    html: `<div style="font-size:12px;font-family:${Theme.fontFamily};font-weight:400;padding:0;">2222</div>`,
    x: 400,
    y: 200,
    alignX: 'middle',
  });

  it('init', () => {
    html.init();
    html.render();
    const container = parent.children[0] as HTMLElement;
    expect(container.style.left).toBe('386px');
  });

  it('destroy', () => {
    html.destroy();
    expect(html.destroyed).toBe(true);
    expect(parent.children).toHaveLength(0);
  });
});
