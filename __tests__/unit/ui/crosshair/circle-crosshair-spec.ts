import { CircleCrosshair } from '../../../../src';
import { delay } from '../../../utils/delay';
import { createCanvas } from '../../../utils/render';

const canvas = createCanvas();
const circle = new CircleCrosshair({
  style: {
    center: [250, 250],
    defaultRadius: 50,
    lineStyle: {
      lineWidth: 1,
    },
  },
});
canvas.appendChild(circle);

describe('circle-crosshair', () => {
  test('basic', async () => {
    // @ts-ignore
    expect(circle.crosshairShape.attr('path')).toStrictEqual([
      ['M', 200, 250],
      ['A', 50, 50, 0, 1, 0, 300, 250],
      ['A', 50, 50, 0, 1, 0, 200, 250],
      ['Z'],
    ]);
  });

  test('update', () => {
    circle.update({
      center: [50, 50],
    });
    const crosshairShape = circle.querySelector('.crosshair-path') as any;
    expect(crosshairShape.attr('path')).toStrictEqual([
      ['M', 0, 50],
      ['A', 50, 50, 0, 1, 0, 100, 50],
      ['A', 50, 50, 0, 1, 0, 0, 50],
      ['Z'],
    ]);
  });

  test('setPointer', async () => {
    circle.setPointer([50, 150]);
    await delay(20);
    // @ts-ignore
    expect(circle.crosshairShape.attr('path')).toStrictEqual([
      ['M', -50, 50],
      ['A', 100, 100, 0, 1, 0, 150, 50],
      ['A', 100, 100, 0, 1, 0, -50, 50],
      ['Z'],
    ]);
  });

  afterAll(() => {
    circle.destroy();
  });
});
