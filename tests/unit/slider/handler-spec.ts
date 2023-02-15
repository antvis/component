import { Canvas } from '@antv/g-canvas';
import { Handler } from '../../../src/slider/handler';

describe('handler', () => {
  const div = document.createElement('div');
  div.id = 'canvas';
  document.body.appendChild(div);

  const canvas = new Canvas({
    container: 'canvas',
    width: 400,
    height: 400,
  });

  const handler = new Handler({
    id: 'h',
    container: canvas.addGroup(),
    x: 50,
    y: 60,
    width: 8,
    height: 30,
  });

  it('init', () => {
    handler.init();
    expect(handler.get('x')).toBe(50);
    expect(handler.get('y')).toBe(60);
    expect(handler.get('width')).toBe(8);
    expect(handler.get('height')).toBe(30);
  });

  it('render', () => {
    handler.render();
    expect(handler.get('x')).toBe(50);
    expect(handler.get('y')).toBe(60);
    expect(handler.get('width')).toBe(8);
    expect(handler.get('height')).toBe(30);

    // background
    const background = handler.getElementByLocalId('background');
    const backgroundBBox = background.getBBox();
    expect(backgroundBBox.width).toBe(8);
    expect(backgroundBBox.height).toBe(30);

    // left line
    const leftLine = handler.getElementByLocalId('line-left');
    const leftLineBBox = leftLine.getBBox();
    expect(leftLineBBox.width).toBe(1);
    expect(leftLineBBox.height).toBe(30 / 2 + 1);

    // right line
    const rightLine = handler.getElementByLocalId('line-right');
    const rightLineBBox = rightLine.getBBox();
    expect(rightLineBBox.width).toBe(1);
    expect(rightLineBBox.height).toBe(30 / 2 + 1);
  });

  it('event', () => {
    const group = handler.get('group');
    const background = handler.getElementByLocalId('line-left');
    expect(background.attr('stroke')).toBe('#A6BDE1');
    group.emit('mouseenter');
    expect(background.attr('stroke')).toBe('#3485F8');
    group.emit('mouseleave');
    expect(background.attr('stroke')).toBe('#A6BDE1');
  });

  it('style', () => {
    handler.update({
      style: {
        fill: '#111',
        stroke: '#222',
        highLightFill: '#333',
      },
    });
    handler.render();
    expect(handler.getElementByLocalId('line-left').attr('stroke')).toBe('#222');
    expect(handler.getElementByLocalId('line-right').attr('stroke')).toBe('#222');
    expect(handler.getElementByLocalId('background').attr('fill')).toBe('#111');
  });

  it('handler init with style', () => {
    const handler1 = new Handler({
      id: 'h',
      container: canvas.addGroup(),
      x: 50,
      y: 60,
      width: 8,
      height: 30,
      style: {
        fill: 'red',
      },
    });

    handler1.init();
    handler1.render();
    expect(handler1.getElementByLocalId('background').attr('fill')).toBe('red');

    handler1.destroy();
  });

  afterAll(() => {
    handler.destroy();
  });
});
