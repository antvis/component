import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { LineCrosshair } from '../../../../src';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

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
    expect(line.attr('x')).toBe(100);
    expect(line.attr('y')).toBe(50);
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

  test('setPointer', () => {
    line.setPointer([200, 200]);
    // 水平移动只改变x坐标
    expect(line.attr('x')).toBe(200);
    expect(line.attr('y')).toBe(50);
  });

  test('vertical', () => {
    line.update({
      startPos: [50, 100],
      endPos: [400, 100],
    });

    expect(line.attr('x')).toBe(50);
    expect(line.attr('y')).toBe(100);
    // @ts-ignore
    expect(line.crosshairShape.attr('path')).toStrictEqual([['M', 0, 0], ['L', 350, 0], ['Z']]);

    line.setPointer([200, 200]);
    // 水平移动只改变x坐标
    expect(line.attr('x')).toBe(50);
    expect(line.attr('y')).toBe(200);
  });
});
