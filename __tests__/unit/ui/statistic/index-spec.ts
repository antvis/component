import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Statistic, Tag } from '../../../../src';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const initTitleText = 'basic statistic title';
const initValueText = 'basic statistic value';

describe('statistic', () => {
  const div = createDiv();

  const canvas = new Canvas({
    container: div,
    width: 300,
    height: 300,
    renderer,
  });

  const statistic = new Statistic({
    style: {
      x: 40,
      y: 50,
      title: {
        text: initTitleText,
        textStyle: {
          default: {
            fontSize: 40,
            fill: 'red',
          },
        },
      },
      value: {
        text: initValueText,
        textStyle: {
          default: {
            fontSize: 50,
            fill: 'pink',
          },
        },
      },
      spacing: 30,
    },
  });

  canvas.appendChild(statistic);

  test('basic', () => {
    const { x, y, title, value, spacing } = statistic.attributes;

    const { text: titleText, textStyle: titleStyle } = title;
    const { text: valueText, textStyle: valueStyle } = value;

    expect(titleText).toBe(initTitleText);
    expect(valueText).toBe(initValueText);
    expect(titleStyle).toEqual({
      default: {
        fontSize: 40,
        fill: 'red',
      },
    });
    expect(valueStyle).toEqual({
      default: {
        fontSize: 50,
        fill: 'pink',
      },
    });
    expect(x).toBe(40);
    expect(y).toBe(50);
    expect(spacing).toBe(30);
  });

  test('marker', () => {
    statistic.update({
      value: {
        text: '1,128',
        spacing: 4,
        marker: {
          symbol: 'triangle',
          fill: 'rgb(63, 134, 0)',
          size: 14,
        },
      },
    });

    const valueShapeCfg = statistic.getValueShapeCfg();

    expect(valueShapeCfg.marker).toEqual({
      symbol: 'triangle',
      fill: 'rgb(63, 134, 0)',
      size: 14,
    });
    expect(valueShapeCfg.spacing).toBe(4);
  });
});
