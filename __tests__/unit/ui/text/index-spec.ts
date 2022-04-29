import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Text } from '../../../../src';
import { createDiv } from '../../../utils';
import { TEXT_INHERITABLE_PROPS } from '../../../../src/util';

const renderer = new CanvasRenderer();

const div = createDiv();

const canvas = new Canvas({
  container: div,
  width: 600,
  height: 600,
  renderer,
});

const text = new Text({
  style: {
    ...TEXT_INHERITABLE_PROPS,
    x: 100,
    y: 10,
    text: 'ABDPabdp\nABDASDPabdp\nABDPabdp',
    fontSize: 60,
    fontColor: 'red',
    fontFamily: 'sans-serif',
    // overflow: 'none',
    textAlign: 'center',
    verticalAlign: 'middle',
  },
});

canvas.appendChild(text);

describe('text', () => {
  test('font', () => {
    // @ts-ignore
    const { fontSize, fill, fontFamily } = text.textShape.attributes;
    expect(fontSize).toBe(60);
    expect(fill).toBe('red');
    expect(fontFamily).toBe('sans-serif');
  });
  test('align', () => {
    text.update({
      width: 300,
      height: 300,
      textAlign: 'start',
      verticalAlign: 'top',
    });
    // @ts-ignore
    const { x, y } = text.textShape.attributes;
    expect(x).toBe(0);
    expect(y).toBe(text.textHeight / 2);
  });
  test('overflow', () => {
    // @ts-ignore
    expect(text.clipRect).toBe(undefined);
    text.update({ overflow: 'clip' });
    // @ts-ignore
    expect(text.clipRect instanceof Object).toBe(true);
  });
  test('transform', () => {
    // @ts-ignore
    expect(text.text[0]).toBe('A');
    // @ts-ignore
    expect(text.text[4]).toBe('a');
    text.update({
      transform: 'lowercase',
    });
    // @ts-ignore
    expect(text.text[0]).toBe('a');
    // @ts-ignore
    expect(text.text[4]).toBe('a');

    text.update({
      transform: 'uppercase',
    });
    // @ts-ignore
    expect(text.text[0]).toBe('A');
    // @ts-ignore
    expect(text.text[4]).toBe('A');
  });
  test('background', () => {
    // @ts-ignore
    expect(text.backgroundShape.attr('stroke')).toBe('');
    text.update({
      backgroundStyle: {
        lineWidth: 1,
        stroke: '#000',
        fill: 'yellow',
      },
    });
    // @ts-ignore
    expect(text.backgroundShape.attr('fill')).toBe('yellow');
    // @ts-ignore
    expect(text.backgroundShape.attr('stroke')).toBe('#000');
  });
});
