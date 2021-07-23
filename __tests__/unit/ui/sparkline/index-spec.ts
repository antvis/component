import { get } from '@antv/util';
import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Sparkline } from '../../../../src';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const div = createDiv();

// @ts-ignore
const canvas = new Canvas({
  container: div,
  width: 300,
  height: 300,
  renderer,
});

const sparkline = new Sparkline({
  attrs: {
    x: 10,
    y: 10,
    width: 300,
    height: 50,
    smooth: false,
    data: [
      [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
      [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
      [-10, 3, 4, 10, 15, 13, 3, 3, 10, 12],
    ],
  },
});
canvas.appendChild(sparkline);

describe('sparkline', () => {
  test('basic line', async () => {
    const path0 = sparkline.getElementsByName('sparkline')[0].firstChild.attr('path');
    const y = (val) => {
      return (1 - (val + 10) / 25) * 50;
    };
    expect(path0[0][1]).toBe(0);
    expect(path0.slice(-1)[0][1]).toBe(300);
    expect(path0[4][2]).toBe(0);
    expect(path0[1][2]).toBe(y(2));
    expect(path0[2][2]).toBe(y(3));
    expect(path0[3][2]).toBe(y(4));
    expect(path0[4][2]).toBe(y(15));
    expect(path0[5][2]).toBe(y(10));
  });

  test('stack line', () => {
    sparkline.update({
      x: 10,
      y: 10,
      width: 300,
      height: 50,
      smooth: false,
      isStack: true,
      data: [
        [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
        [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
        [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
      ],
    });
  });

  test('stack curve', () => {
    sparkline.update({
      x: 10,
      y: 10,
      width: 300,
      height: 50,
      smooth: true,
      isStack: true,
      data: [
        [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
        [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
        [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
      ],
    });
  });

  test('area line', () => {
    sparkline.update({
      x: 10,
      y: 10,
      width: 300,
      height: 50,
      smooth: false,
      areaStyle: {
        lineWidth: 0,
        opacity: 0.5,
      },
      data: [
        [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
        [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
        [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
      ],
    });
  });

  test('area curve', () => {
    sparkline.update({
      x: 10,
      y: 10,
      width: 300,
      height: 50,
      smooth: true,
      areaStyle: {
        lineWidth: 0,
        opacity: 0.5,
      },
      data: [
        [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
        [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
        [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
      ],
    });
  });

  test('area stack line', () => {
    sparkline.update({
      x: 10,
      y: 10,
      width: 300,
      height: 50,
      smooth: false,
      isStack: true,
      areaStyle: {
        lineWidth: 0,
        opacity: 0.5,
      },
      data: [
        [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
        [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
        [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
      ],
    });
  });

  test('area stack curve', () => {
    sparkline.update({
      x: 10,
      y: 10,
      width: 300,
      height: 50,
      smooth: true,
      isStack: true,
      areaStyle: {
        lineWidth: 0,
        opacity: 0.5,
      },
      data: [
        [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
        [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
        [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
      ],
    });
  });

  test('basic bar', () => {
    sparkline.update({
      x: 10,
      y: 10,
      type: 'column',
      width: 300,
      height: 50,
      data: [
        [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
        [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
        [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
      ],
    });
  });

  test('stack bar', () => {
    sparkline.update({
      x: 10,
      y: 10,
      type: 'column',
      width: 300,
      height: 50,
      isStack: true,
      data: [
        [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
        [5, 7, 10, 3, -10, 6, 10, 1, 5, 0],
        [1, 3, 4, 10, -15, 13, 3, 3, -10, 12],
      ],
    });
  });

  test('group bar', () => {
    sparkline.update({
      x: 10,
      y: 10,
      type: 'column',
      width: 300,
      height: 50,
      isStack: false,
      isGroup: true,
      data: [
        [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
        [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
        [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
      ],
    });
  });

  test('stack group bar', () => {
    sparkline.update({
      x: 10,
      y: 10,
      type: 'column',
      width: 300,
      height: 50,
      isStack: true,
      isGroup: true,
      data: [
        [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
        [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
        [1, 3, 4, 10, 15, 13, 3, 3, 10, 12],
      ],
    });
  });

  test('color', () => {
    sparkline.update({
      x: 10,
      y: 10,
      type: 'column',
      width: 300,
      height: 50,
      isStack: true,
      isGroup: true,
      color: [
        '#678ef2',
        '#7dd5a9',
        '#616f8f',
        '#edbf45',
        '#6c5ff0',
        '#83c6e8',
        '#8c61b4',
        '#f19d56',
        '#479292',
        '#f19ec2',
      ],
      data: [
        [10, 2, 3, 4, 15, 10, 5, 0, 3, 1],
        [5, 7, 10, 3, 10, 6, 10, 1, 5, 0],
        [1, 3, 4, 10, 15, -13, 3, 3, 10, 12],
      ],
    });
  });

  test('destroy', () => {
    sparkline.destroy();
    canvas.destroy();
  });
});
