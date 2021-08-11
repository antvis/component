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
        style: {
          fontSize: 40,
          fill: 'red',
        },
      },
      value: {
        text: initValueText,
        style: {
          fontSize: 50,
          fill: 'pink',
        },
      },
      spacing: 30,
    },
  });

  canvas.appendChild(statistic);

  test('basic', async () => {
    const { x, y, title, value, spacing } = statistic.attributes;

    const { text: titleText, style: titleStyle } = title;
    const { text: valueText, style: valueStyle } = value;

    expect(titleText).toBe(initTitleText);
    expect(valueText).toBe(initValueText);
    expect(titleStyle!.fontSize).toBe(40);
    expect(valueStyle!.fontSize).toBe(50);
    expect(titleStyle!.fill).toBe('red');
    expect(valueStyle!.fill).toBe('pink');
    expect(x).toBe(40);
    expect(y).toBe(50);
    expect(spacing).toBe(30);
  });

  test('formatter', async () => {
    statistic.update({
      title: {
        formatter: (text) => {
          return `${text} /$`;
        },
      },
      value: {
        formatter: (text) => {
          return `${text} /￥`;
        },
      },
    });

    expect(statistic.getNewText('title')).toBe(`${initTitleText} /$`);
    expect(statistic.getNewText('value')).toBe(`${initValueText} /￥`);
  });

  test('affix', async () => {
    const tag1 = new Tag({
      style: {
        x: 0,
        y: 8,
        text: 'Tag 1',
      },
    });

    const tag2 = new Tag({
      style: {
        x: 0,
        y: 8,
        text: 'Tag 2',
      },
    });

    statistic.update({
      value: {
        prefix: tag1,
        suffix: tag2,
      },
    });

    const {
      value: { prefix, suffix },
    } = statistic.attributes;

    expect(statistic.addAffixAdapter(tag1)).toBe(true);
    expect(statistic.addAffixAdapter(tag2)).toBe(true);
    const { height: prefixHeight, width: prefixWidth } = statistic.getGroupWidth(prefix);
    expect(prefixHeight).toBeCloseTo(25);
    expect(prefixWidth).toBeLessThan(42);
    const { height: suffixHeight, width: suffixWidth } = statistic.getGroupWidth(suffix);
    expect(suffixHeight).toBeCloseTo(25);
    // to be fix later
    // expect(suffixWidth).toBeLessThan(42);
  });
});
