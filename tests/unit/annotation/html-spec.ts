import { createDom } from '@antv/dom-util';
import { Canvas } from '@antv/g-canvas';
import HtmlAnnotation from '../../../src/annotation/html';

describe('html annotation /w string', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'cant';
  const canvas = new Canvas({
    container: 'cant',
    width: 500,
    height: 500,
  });
  const parent = document.createElement('div');
  dom.appendChild(parent);

  const htmlStr = '<span style="color:red">html annotation</span>';
  const html = new HtmlAnnotation({
    parent,
    html: htmlStr,
    x: 300,
    y: 200,
  });

  it('init', () => {
    html.init();
    expect(html.get('name')).toEqual('annotation');
    expect(html.get('type')).toBe('html');
  });

  it('render', () => {
    html.render();
    expect(parent.children).toHaveLength(1);
    const container = parent.children[0] as HTMLElement;
    expect(container.className).toBe('g2-html-annotation');
    expect(container.style.position).toBe('absolute');
    expect(container.style.left).toBe('300px');
    expect(container.style.top).toBe('200px');
    expect(container.innerHTML).toEqual(htmlStr);
  });

  it('update', () => {
    html.update({
      x: 400,
      y: 300,
    });
    html.render();
    expect(parent.children).toHaveLength(1);
    const container = parent.children[0] as HTMLElement;
    expect(container.className).toBe('g2-html-annotation');
    expect(container.style.position).toBe('absolute');
    expect(container.style.left).toBe('400px');
    expect(container.style.top).toBe('300px');
    expect(container.innerHTML).toEqual(htmlStr);
  });

  it('destroy', () => {
    html.destroy();
    expect(html.destroyed).toBe(true);
    expect(parent.children).toHaveLength(0);
  });
});

describe('html annotation /w callback', () => {
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  dom.id = 'cant';
  const canvas = new Canvas({
    container: 'cant',
    width: 500,
    height: 500,
  });
  const parent = document.createElement('div');
  dom.appendChild(parent);

  const htmlStr = '<span>html annotation</span>';
  const html = new HtmlAnnotation({
    parent,
    html: (container) => {
      const span = document.createElement('span');
      span.appendChild(document.createTextNode('html annotation'));
      container.appendChild(span);
    },
    x: 300,
    y: 200,
  });

  it('init', () => {
    html.init();
    expect(html.get('name')).toEqual('annotation');
    expect(html.get('type')).toBe('html');
  });

  it('render', () => {
    html.render();
    expect(parent.children).toHaveLength(1);
    const container = parent.children[0] as HTMLElement;
    expect(container.className).toBe('g2-html-annotation');
    expect(container.style.position).toBe('absolute');
    expect(container.style.left).toBe('300px');
    expect(container.style.top).toBe('200px');
    expect(container.innerHTML).toEqual('<span>html annotation</span>');
  });

  it('update', () => {
    html.update({
      x: 400,
      y: 300,
    });
    html.render();
    expect(parent.children).toHaveLength(1);
    const container = parent.children[0] as HTMLElement;
    expect(container.className).toBe('g2-html-annotation');
    expect(container.style.position).toBe('absolute');
    expect(container.style.left).toBe('400px');
    expect(container.style.top).toBe('300px');
    expect(container.innerHTML).toEqual(htmlStr);
  });

  it('createDom', () => {
    html.update({
      x: 400,
      y: 300,
      html: '\\n',
    });
    html.render();
    let container = parent.children[0] as HTMLElement;
    expect(container.innerHTML).toBe('\\n');
    expect(container.innerText).toBe('\\n');

    html.update({
      x: 400,
      y: 300,
      html: '\n',
    });
    html.render();
    container = parent.children[0] as HTMLElement;
    expect(container.innerHTML).toBe(`<div>\n</div>`);
    expect(container.innerText).toBe('');

    html.update({
      x: 400,
      y: 300,
      html: 123,
    });
    html.render();
    container = parent.children[0] as HTMLElement;
    expect(container.innerHTML).toBe('123');
  });

  it('destroy', () => {
    html.destroy();
    expect(html.destroyed).toBe(true);
    expect(parent.children).toHaveLength(0);
  });
});
