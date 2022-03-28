import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Scrollbar } from '../../../../src';
import { createDiv } from '../../../utils';

const clamp = (value: number, min: number, max: number) => {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
};

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const div = createDiv();

const canvas = new Canvas({
  container: div,
  width: 300,
  height: 300,
  renderer,
});

const height = 100;
const thumbLen = 30;
const scrollbar = new Scrollbar({
  style: {
    height,
    thumbLen,
    x: 100,
    y: 5,
    value: 0.5,
    width: 20,
  },
});

canvas.appendChild(scrollbar);

describe('scrollbar', () => {
  test('basic', async () => {
    expect(scrollbar.getValue()).toBe(0.5);

    // @ts-ignore
    const [top, , bottom] = scrollbar.padding;
    const verticalPadding = top + bottom;

    let value = 0.2;
    scrollbar.setValue(value);
    expect(scrollbar.getValue()).toBe(value);

    // @ts-ignore
    expect(scrollbar.getElementsByName('thumb')[0].attr('y')).toBeCloseTo(
      top + (height - verticalPadding - thumbLen) * clamp(value, 0, 1),
      1
    );

    value = 0.1;
    scrollbar.setValue(value);
    expect(scrollbar.getValue()).toBe(value);
    // @ts-ignore
    expect(scrollbar.getElementsByName('thumb')[0].attr('y')).toBeCloseTo(
      top + (height - verticalPadding - thumbLen) * clamp(value, 0, 1),
      1
    );

    value = 0.9;
    scrollbar.setValue(value);
    expect(scrollbar.getValue()).toBe(value);
    // @ts-ignore
    expect(scrollbar.getElementsByName('thumb')[0].attr('y')).toBeCloseTo(
      top + (height - verticalPadding - thumbLen) * clamp(value, 0, 1),
      1
    );

    value = 10;
    scrollbar.setValue(value);
    expect(scrollbar.getValue()).toBe(1);
    // @ts-ignore
    expect(scrollbar.getElementsByName('thumb')[0].attr('y')).toBeCloseTo(
      top + (height - verticalPadding - thumbLen) * clamp(value, 0, 1),
      1
    );

    value = -10086;
    scrollbar.setValue(value);
    expect(scrollbar.getValue()).toBe(0);
    // @ts-ignore
    expect(scrollbar.getElementsByName('thumb')[0].attr('y')).toBeCloseTo(
      top + (height - verticalPadding - thumbLen) * clamp(value, 0, 1),
      1
    );
  });

  test('horizontal', async () => {
    const width = 100;
    const thumbLen = 30;
    scrollbar.update({
      width,
      thumbLen,
      x: 10,
      y: 50,
      orient: 'horizontal',
      height: 20,
      value: 0.5,
    });

    expect(scrollbar.getValue()).toBe(0.5);

    // @ts-ignore
    const [, right, , left] = scrollbar.padding;
    const horizonPadding = left + right;

    let value = 0.2;
    scrollbar.setValue(value);
    expect(scrollbar.getValue()).toBe(value);
    // @ts-ignore
    expect(scrollbar.getElementsByName('thumb')[0].attr('x')).toBeCloseTo(
      left + (width - horizonPadding - thumbLen) * clamp(value, 0, 1),
      1
    );

    value = 0.1;
    scrollbar.setValue(value);
    expect(scrollbar.getValue()).toBe(value);
    // @ts-ignore
    expect(scrollbar.getElementsByName('thumb')[0].attr('x')).toBeCloseTo(
      left + (width - horizonPadding - thumbLen) * clamp(value, 0, 1),
      1
    );

    value = 0.9;
    scrollbar.setValue(value);
    expect(scrollbar.getValue()).toBe(value);
    // @ts-ignore
    expect(scrollbar.getElementsByName('thumb')[0].attr('x')).toBeCloseTo(
      left + (width - horizonPadding - thumbLen) * clamp(value, 0, 1),
      1
    );

    value = 10;
    scrollbar.setValue(value);
    expect(scrollbar.getValue()).toBe(1);
    // @ts-ignore
    expect(scrollbar.getElementsByName('thumb')[0].attr('x')).toBeCloseTo(
      left + (width - horizonPadding - thumbLen) * clamp(value, 0, 1),
      1
    );

    value = -10086;
    scrollbar.setValue(value);
    expect(scrollbar.getValue()).toBe(0);
    // @ts-ignore
    expect(scrollbar.getElementsByName('thumb')[0].attr('x')).toBeCloseTo(
      left + (width - horizonPadding - thumbLen) * clamp(value, 0, 1),
      1
    );

    scrollbar.addEventListener('valueChanged', (e: any) => {
      e;
    });

    canvas.appendChild(scrollbar);
  });

  test('position', () => {
    scrollbar.update({
      x: 10,
      y: 20,
    });

    expect(scrollbar.attr('x')).toBe(10);
    expect(scrollbar.attr('y')).toBe(20);

    // @ts-ignore
    const track = scrollbar.trackShape;
    expect(track.attr('x')).toBe(0);
    expect(track.attr('y')).toBe(0);
  });
});

// scrollbar.destroy();
// canvas.destroy();
