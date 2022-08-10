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
    html.init();
    html.render();
    const container = parent.children[0] as HTMLElement;
    expect(container.style.left).toBe('381px');
  });

  it('destroy', () => {
    html.destroy();
    expect(html.destroyed).toBe(true);
    expect(parent.children).toHaveLength(0);
  });
});
