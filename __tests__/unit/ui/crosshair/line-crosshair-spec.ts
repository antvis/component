import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { LineCrosshair } from '../../../../src';
import { createDiv } from '../../../utils';
import { delay } from '../../../utils/delay';

const renderer = new CanvasRenderer();

const div = createDiv();

const canvas = new Canvas({
  container: div,
  width: 500,
  height: 500,
  renderer,
});

const line = new LineCrosshair({
  style: {
    startPos: [100, 50],
    endPos: [100, 400],
    lineStyle: {
      lineWidth: 2,
    },
    text: {
      text: '123',
      position: 'start',
    },
  },
});

canvas.appendChild(line);

describe('line-crosshair', () => {
  test('basic', () => {
    // @ts-ignore
    expect(line.shapesGroup.attr('x')).toBe(100);
    // @ts-ignore
    expect(line.shapesGroup.attr('y')).toBe(50);
    // @ts-ignore
    expect(line.tagShape.attr('text')).toBe('123');
    // @ts-ignore
    expect(line.crosshairShape.attr('path')).toStrictEqual([['M', 0, 0], ['L', 0, 350], ['Z']]);
  });

  test('setText', () => {
    line.setText('new Text');
    // @ts-ignore
    expect(line.tagShape.attr('text')).toBe('new Text');
  });

  test('setPointer', async () => {
    line.setPointer([200, 200]);
    await delay(20);
    // 水平移动只改变 x 坐标
    // @ts-ignore
    expect(line.shapesGroup.attr('x')).toBe(200);
    // @ts-ignore
    expect(line.shapesGroup.attr('y')).toBe(50);
  });

  test('horizontal', async () => {
    line.update({
      startPos: [50, 100],
      endPos: [400, 100],
    });

    // @ts-ignore
    expect(line.shapesGroup.attr('x')).toBe(50);
    // pointer y is 200
    // @ts-ignore
    expect(line.shapesGroup.attr('y')).toBe(200);
    // @ts-ignore
    expect(line.crosshairShape.attr('path')).toStrictEqual([['M', 0, 0], ['L', 350, 0], ['Z']]);

    line.setPointer([240, 250]);
    await delay(20);
    // 水平移动只改变 y 坐标
    // @ts-ignore
    expect(line.shapesGroup.attr('x')).toBe(50);
    // @ts-ignore
    expect(line.shapesGroup.attr('y')).toBe(250);
  });

  afterAll(() => {
    line.destroy();
  });
});
