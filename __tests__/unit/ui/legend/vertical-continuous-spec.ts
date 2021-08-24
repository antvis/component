import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Continuous } from '../../../../src/ui/legend';
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
  width: 600,
  height: 600,
  renderer,
});

const continuous = new Continuous({
  style: {
    x: 50,
    orient: 'vertical',
    title: {
      content: '连续图例',
    },
    label: {
      align: 'inside',
    },
    rail: {
      type: 'size',
      width: 30,
      height: 300,
      ticks: [20, 40, 60, 80],
    },
    min: 0,
    max: 100,
    start: 10,
    end: 90,
    color: [
      '#d0e3fa',
      '#acc7f6',
      '#8daaf2',
      '#6d8eea',
      '#4d73cd',
      '#325bb1',
      '#5a3e75',
      '#8c3c79',
      '#e23455',
      '#e7655b',
    ],
  },
});
canvas.appendChild(continuous);
canvas.render();

describe('vertical continuous', () => {
  test('basic', async () => {
    // @ts-ignore
    expect(continuous.startHandle!.attr('y')).toBe(30);
    // @ts-ignore
    expect(continuous.endHandle!.attr('y')).toBe(270);
  });
});
