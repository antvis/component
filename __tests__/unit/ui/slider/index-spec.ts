import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Slider } from '../../../../src';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer();

const div = createDiv();

const canvas = new Canvas({
  container: div,
  width: 800,
  height: 300,
  renderer,
});

const slider = new Slider({
  style: {
    x: 50,
    y: 50,
    width: 400,
    height: 40,
    values: [0.3, 0.7],
  },
});

describe('slider', () => {
  test('basic', async () => {
    expect(slider.getValues()).toStrictEqual([0.3, 0.7]);

    slider.setValues([0, 1]);
    expect(slider.getValues()).toStrictEqual([0, 1]);

    slider.setValues([-0.5, 1]);
    expect(slider.getValues()).toStrictEqual([-0.5, 1]);

    slider.setValues([-0.5, 1.5]);
    expect(slider.getValues()).toStrictEqual([-0.5, 1.5]);

    slider.setValues([-0.5, 0]);
    expect(slider.getValues()).toStrictEqual([-0.5, 0]);

    slider.setValues([-2, -1]);
    expect(slider.getValues()).toStrictEqual([-2, -1]);

    canvas.appendChild(slider);
    slider.destroy();
  });

  test('vertical', async () => {
    slider.update({
      x: 50,
      y: 50,
      width: 40,
      height: 400,
      orientation: 'vertical',
      values: [0.3, 0.7],
    });
  });

  test('custom icon', async () => {
    slider.update({
      x: 50,
      y: 50,
      width: 400,
      height: 40,
      values: [0.3, 0.7],
      handleIconSize: 15,
      formatter: (value) => `${value * 100}%`,
    });
  });

  test('vertical', async () => {
    slider.update({
      x: 50,
      y: 50,
      width: 40,
      height: 400,
      orientation: 'vertical',
      values: [0.3, 0.7],
    });
  });

  test('slider with sparkline', async () => {
    slider.update({
      x: 50,
      y: 50,
      width: 400,
      height: 40,
      values: [0.3, 0.7],
      sparklineData: [
        [1, 3, 2, -4, 1, 3, 2, -4],
        [5, 1, 5, -8, 5, 1, 5, -8],
      ],
    });
  });
});

slider.destroy();
canvas.destroy();
