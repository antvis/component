import HtmlCrosshair from '../../../src/crosshair/html';
const dom = document.createElement('div');
document.body.appendChild(dom);
dom.id = 'crosshair';
dom.style.height = '500px';

describe('test html crosshair', () => {
  const crosshair = new HtmlCrosshair({
    parent: dom,
    visible: false,
  });
  crosshair.init();
  const container = crosshair.getContainer();
  it('init', () => {
    expect(container.style.position).toBe('relative');
    expect(container.style.pointerEvents).toBe('none');
    expect(container.style.display).toBe('none');
  });

  it('show hide', () => {
    crosshair.show();
    expect(container.style.display).toBe('');
    crosshair.hide();
    expect(container.style.display).toBe('none');
    crosshair.show();
  });

  it('render', () => {
    crosshair.render();
    expect(container.childNodes.length).toBe(1);
    const el = container.childNodes[0] as HTMLElement;
    expect(el.style.position).toBe('absolute');
  });

  it('update start end', () => {
    const el = container.childNodes[0] as HTMLElement;
    crosshair.update({
      start: {x: 100, y: 0},
      end: {x: 100, y: 300}
    });
    const rect = el.getBoundingClientRect();
    expect(rect.width).toBe(1);
    expect(rect.height).toBe(300);
  });

  it('update text', () => {
    crosshair.update({
      start: {x: 100, y: 0},
      end: {x: 100, y: 300},
      text: {
        content: 'this is text',
      }
    });
    expect(container.childNodes.length).toBe(2);
    const textEl = container.childNodes[1] as HTMLElement;
    let rect = textEl.getBoundingClientRect();
    expect(parseInt(textEl.style.left)).toBeCloseTo(Math.floor(100 - rect.width / 2));
    crosshair.update({
      text: {
        content: 'this is text',
        align: 'left'
      }
    });
    rect = textEl.getBoundingClientRect();
    expect(parseInt(textEl.style.left)).toBeCloseTo(Math.floor(100));

    crosshair.update({
      text: {
        content: 'this is text',
        align: 'right'
      }
    });
    rect = textEl.getBoundingClientRect();
    expect(parseInt(textEl.style.left)).toBeCloseTo(Math.floor(100 - rect.width));

    crosshair.update({
      text: {
        position: 'end',
        content: 'this is text',
        align: 'right'
      }
    });
    rect = textEl.getBoundingClientRect();
    expect(parseInt(textEl.style.left)).toBeCloseTo(Math.floor(100 - rect.width));
  });

  it('update style', () => {
    crosshair.update({
      domStyles: {
        'g2-crosshair-line': {
          color: 'red'
        }
      }
    });
    const lineEl = container.childNodes[0] as HTMLElement;
    expect(lineEl.style.color).toBe('red');
  });

  it('update horizontal', () => {
    crosshair.update({
      start: {x: 100, y: 100},
      end: {x: 300, y: 100}
    });
    const lineEl = container.childNodes[0] as HTMLElement;
    let rect = lineEl.getBoundingClientRect();
    expect(lineEl.style.left).toBe('100px');
    expect(lineEl.style.width).toBe('200px');
    expect(rect.width).toBe(200);
  });

  it('destroy', () => {
    const count = dom.childNodes.length;
    crosshair.destroy();
    expect(dom.childNodes.length).toBe(count - 1);
  });
});