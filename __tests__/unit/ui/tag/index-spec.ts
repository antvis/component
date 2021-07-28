import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { head, last } from '@antv/util';
import { Tag } from '../../../../src';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

describe('tag', () => {
  const div = createDiv();

  const canvas = new Canvas({
    container: div,
    width: 500,
    height: 300,
    renderer,
  });

  const tag = new Tag({
    attrs: {
      x: 0,
      y: 0,
      text: 'tag',
    },
  });
  canvas.appendChild(tag);

  test('defaultOptions', () => {
    expect(tag.getConfig().attrs).toMatchObject(Tag.defaultOptions.attrs);
  });

  test('padding', () => {
    tag.update({ padding: 6 });
    // @ts-ignore
    const rect = tag.textShape.getBoundingClientRect();
    expect(rect.top).toBe(6);
    expect(rect.left).toBe(6);
  });

  test('add marker', () => {
    tag.update({ spacing: 10, marker: { symbol: 'triangle', size: 12 } });
    // @ts-ignore
    const rect = tag.textShape.getBoundingClientRect();
    expect(rect.top).toBe(6);
    expect(rect.left).not.toBe(6);

    // @ts-ignore
    const { width: mWidth, left: mLeft } = tag.markerShape.getBoundingClientRect();
    expect(rect.left).toBe(6 + 10 + mWidth);
    expect(mLeft).toBe(6);
  });

  test('marker and text is vertical align', () => {
    tag.update({ textStyle: { default: { fontSize: 32 } }, marker: { symbol: 'circle', size: 10 } });
    // @ts-ignore
    const { height: tHeight, top: tTop } = tag.textShape.getBoundingClientRect();
    // @ts-ignore
    const { height: mHeight, top: mTop } = tag.markerShape.getBoundingClientRect();
    expect(tHeight / 2 + tTop).toBe(mHeight / 2 + mTop);
  });

  test('text', () => {
    tag.update({ text: 'hello' });
    // @ts-ignore
    expect(tag.textShape.attr('text')).toBe('hello');
  });

  test('textStyle', () => {
    tag.update({ textStyle: { default: { fill: 'red' }, active: { fill: 'yellow' } } });
    // @ts-ignore
    expect(tag.textShape.attr('fill')).toBe('red');
    tag.emit('mouseenter');

    // @ts-ignore
    expect(tag.textShape.attr('fill')).toBe('yellow');
    tag.emit('mouseleave');
  });

  test('backgrounStyle', () => {
    tag.update({ backgroundStyle: { default: { fill: 'red' }, active: { fill: 'blue' } } });
    // @ts-ignore
    expect(tag.backgroundShape.attr('fill')).toBe('red');
    tag.emit('mouseenter');

    // @ts-ignore
    expect(tag.backgroundShape.attr('fill')).toBe('blue');
  });

  afterAll(() => {
    tag.destroy();
  });
});
