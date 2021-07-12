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

describe('scrollbar', () => {
  test('basic', async () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const height = 100;
    const thumbLen = 30;
    const scrollbar = new Scrollbar({
      attrs: {
        height,
        thumbLen,
        x: 100,
        y: 5,
        value: 0.5,
        width: 20,
      },
    });
    expect(scrollbar.getValue()).toBe(0.5);

    const { padding } = scrollbar.attributes;
    const [top, , bottom] = padding;
    const verticalPadding = top + bottom;

    let value = 0.2;
    scrollbar.setValue(value);
    expect(scrollbar.getValue()).toBe(value);
    expect(scrollbar.lastChild.attributes.y).toBeCloseTo(
      top + (height - verticalPadding - thumbLen) * clamp(value, 0, 1),
      1
    );

    value = 0.1;
    scrollbar.setValue(value);
    expect(scrollbar.getValue()).toBe(value);
    expect(scrollbar.lastChild.attributes.y).toBeCloseTo(
      top + (height - verticalPadding - thumbLen) * clamp(value, 0, 1),
      1
    );

    value = 0.9;
    scrollbar.setValue(value);
    expect(scrollbar.getValue()).toBe(value);
    expect(scrollbar.lastChild.attributes.y).toBeCloseTo(
      top + (height - verticalPadding - thumbLen) * clamp(value, 0, 1),
      1
    );

    value = 10;
    scrollbar.setValue(value);
    expect(scrollbar.getValue()).toBe(value);
    expect(scrollbar.lastChild.attributes.y).toBeCloseTo(
      top + (height - verticalPadding - thumbLen) * clamp(value, 0, 1),
      1
    );

    value = -10086;
    scrollbar.setValue(value);
    expect(scrollbar.getValue()).toBe(value);
    expect(scrollbar.lastChild.attributes.y).toBeCloseTo(
      top + (height - verticalPadding - thumbLen) * clamp(value, 0, 1),
      1
    );

    canvas.appendChild(scrollbar);

    // scrollbar.destroy();
    // canvas.destroy();
  });

  test('horizontal', async () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const width = 100;
    const thumbLen = 30;

    const scrollbar = new Scrollbar({
      attrs: {
        width,
        thumbLen,
        x: 10,
        y: 50,
        orient: 'horizontal',
        height: 20,
        value: 0.5,
      },
    });

    expect(scrollbar.getValue()).toBe(0.5);

    const { padding } = scrollbar.attributes;
    const [, right, , left] = padding;

    const horizonPadding = left + right;

    let value = 0.2;
    scrollbar.setValue(value);
    expect(scrollbar.getValue()).toBe(value);
    expect(scrollbar.lastChild.attributes.x).toBeCloseTo(
      left + (width - horizonPadding - thumbLen) * clamp(value, 0, 1),
      1
    );

    value = 0.1;
    scrollbar.setValue(value);
    expect(scrollbar.getValue()).toBe(value);
    expect(scrollbar.lastChild.attributes.x).toBeCloseTo(
      left + (width - horizonPadding - thumbLen) * clamp(value, 0, 1),
      1
    );

    value = 0.9;
    scrollbar.setValue(value);
    expect(scrollbar.getValue()).toBe(value);
    expect(scrollbar.lastChild.attributes.x).toBeCloseTo(
      left + (width - horizonPadding - thumbLen) * clamp(value, 0, 1),
      1
    );

    value = 10;
    scrollbar.setValue(value);
    expect(scrollbar.getValue()).toBe(value);
    expect(scrollbar.lastChild.attributes.x).toBeCloseTo(
      left + (width - horizonPadding - thumbLen) * clamp(value, 0, 1),
      1
    );

    value = -10086;
    scrollbar.setValue(value);
    expect(scrollbar.getValue()).toBe(value);
    expect(scrollbar.lastChild.attributes.x).toBeCloseTo(
      left + (width - horizonPadding - thumbLen) * clamp(value, 0, 1),
      1
    );

    scrollbar.addEventListener('valuechange', (e) => {
      console.log('scroll: ', e);
    });

    canvas.appendChild(scrollbar);
    // scrollbar.destroy();
    // canvas.destroy();
  });
});
