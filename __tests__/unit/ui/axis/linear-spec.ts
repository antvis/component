import { Canvas, Text } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Linear } from '../../../../src';
import { createDiv } from '../../../utils';
import type { StyleState as State } from '../../../../src/types';
import type { TickDatum } from '../../../../src/ui/axis/types';

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

const linear = new Linear({
  style: {
    startPos: [50, 50],
    endPos: [450, 50],
  },
});

canvas.appendChild(linear);

function createData(values: number[], texts?: string[], states?: State[], ids?: string[]): TickDatum[] {
  return values.map((value, idx) => {
    const datum: TickDatum = { value };
    if (texts && texts.length > idx) datum.text = texts[idx];
    if (states && states.length > idx) datum.state = states[idx];
    if (ids && ids.length > idx) datum.id = ids[idx];
    return datum;
  });
}

describe('linear', () => {
  test('basic', () => {
    linear.update({
      title: {
        content: '直线轴线',
        offset: [0, -40],
        position: 'start',
      },
      axisLine: {
        arrow: {
          end: {
            symbol: 'axis-arrow',
            size: 10,
          },
        },
      },
      label: {
        alignTick: false,
        offset: [0, 20],
      },
      subTickLine: {
        count: 4,
      },
      ticks: createData([0, 0.2, 0.4, 0.6, 0.8], ['A', 'B', 'C', 'D', 'E']),
    });
    // @ts-ignore
    expect(linear.tickLinesGroup.children.length).toBe(5);
    // @ts-ignore
    expect(linear.labelsGroup.children.length).toBe(5);
    // @ts-ignore
    expect(linear.subTickLinesGroup.children.length).toBe(4 * 5);
    // @ts-ignore
    expect(linear.tickLinesGroup.children[0]!.attr('stroke')).toBe('black');
    linear.update({
      tickLine: {
        appendTick: true,
        style: {
          default: {
            stroke: 'red',
          },
        },
      },
    });
    // @ts-ignore
    expect(linear.tickLinesGroup.children.length).toBe(6);
    // @ts-ignore
    expect(linear.tickLinesGroup.children[0]!.attr('stroke')).toBe('red');
  });
  test('vertical', () => {
    linear.update({
      startPos: [250, 50],
      endPos: [250, 450],
      title: {
        offset: [0, 0],
      },
    });
    // @ts-ignore
    const { axisLine } = linear;
    const linePath = axisLine.attr('path');
    expect(linePath[0]).toStrictEqual(['M', 250, 50]);
    expect(linePath[1]).toStrictEqual(['L', 250, 450]);
  });
  test('oblique', () => {
    linear.update({
      startPos: [50, 50],
      endPos: [450, 450],
      title: {
        offset: [0, 0],
      },
      label: {
        align: 'radial',
      },
    });
  });
  test('ticks', () => {
    // @ts-ignore
    const [[, x1, y1], [, x2, y2]] = linear.tickLinesGroup.children[0]!.attr('path');
    expect((y2 - y1) / (x2 - x1)).toBeCloseTo(-1);
  });
  test('title', () => {
    // @ts-ignore
    expect(linear.titleShape.attr('text')).toBe('直线轴线');
  });
  test('line', () => {
    linear.update({
      title: {
        offset: [0, -40],
      },
      startPos: [50, 50],
      endPos: [450, 50],
    });
    // @ts-ignore
    const { axisLine } = linear;
    expect(axisLine.attr('x')).toBe(50);
    expect(axisLine.attr('y')).toBe(50);
    const linePath = axisLine.attr('path');
    expect(linePath[0]).toStrictEqual(['M', 50, 50]);
    expect(linePath[1]).toStrictEqual(['L', 450, 50]);
  });
  test('arrow', () => {
    // @ts-ignore
    expect(linear.axisEndArrow.getEulerAngles()).toBeCloseTo(0);
  });
  test('label', () => {
    linear.update({
      label: {
        alignTick: true,
        formatter: ({ value, text }: TickDatum) => {
          return `${value}-${text}`;
        },
      },
      tickLine: {
        appendTick: false,
      },
    });
    // @ts-ignore
    expect(linear.labelsGroup.children[0]!.attr('text')).toBe('0-A');
    // @ts-ignore
    expect(linear.labelsGroup.children[1]!.attr('text')).toBe('0.2-B');
    // @ts-ignore
    expect(linear.labelsGroup.children[2]!.attr('text')).toBe('0.4-C');
    // @ts-ignore
    expect(linear.labelsGroup.children[3]!.attr('text')).toBe('0.6-D');
    // @ts-ignore
    expect(linear.labelsGroup.children[4]!.attr('text')).toBe('0.8-E');
  });
  test('autoRotate', () => {
    linear.update({
      label: {
        formatter: () => {
          return '这是一段很长的文本';
        },
        autoRotate: true,
        autoEllipsis: false,
        autoHide: false,
      },
    });
    // @ts-ignore
    expect(linear.labelsGroup.children[0]!.getEulerAngles()).toBeCloseTo(30);
  });
  test('autoHide', () => {
    linear.update({
      label: {
        autoRotate: false,
        autoEllipsis: false,
        autoHide: true,
      },
    });
    // @ts-ignore
    const group = linear.labelsGroup.children! as Text[];
    expect(group[0]!.attr('visibility')).toBe('visible');
    expect(group[1]!.attr('visibility')).toBe('hidden');
    expect(group[2]!.attr('visibility')).toBe('visible');
    expect(group[3]!.attr('visibility')).toBe('hidden');
    expect(group[4]!.attr('visibility')).toBe('visible');
  });
  test('autoEllipsis text', () => {
    // 没有现在最大长度
    linear.update({
      label: {
        formatter: () => {
          return '这是一段很长的文本';
        },
        type: 'text',
        autoRotate: false,
        autoEllipsis: true,
        autoHide: false,
      },
    });
    // @ts-ignore
    expect(linear.labelsGroup.children[0]!.attr('text')).toBe('这是一段很长的文本');
    linear.update({
      label: {
        minLength: 50,
        maxLength: 100,
      },
    });
    // @ts-ignore
    const bounds = linear.labels[0].getBounds()!;
    const [x1] = bounds.getMin();
    const [x2] = bounds.getMax();
    expect(x2 - x1).toBeGreaterThanOrEqual(50);
    expect(x2 - x1).toBeLessThanOrEqual(100);
  });
  test('autoEllipsis time', () => {
    linear.update({
      ticks: createData(
        [0, 0.2, 0.4, 0.6, 0.8, 1],
        ['2021-08-11', '2021-09-11', '2021-10-11', '2021-11-11', '2021-12-11', '2022-01-11']
      ),
      label: {
        type: 'time',
        autoRotate: false,
        autoEllipsis: true,
        autoHide: false,
        style: {
          default: {
            fontSize: 20,
          },
        },
        formatter: (tick) => tick.text!,
      },
    });
    // @ts-ignore
    const group = linear.labelsGroup.children! as Text[];
    expect(group[0].attr('text')).toBe('2021-08-11');
    expect(group[1].attr('text')).toBe('09-11');
  });
  test('autoEllipsis number', () => {
    linear.update({
      ticks: createData([0, 0.2, 0.4, 0.6, 0.8, 1]),
      label: {
        type: 'number',
        style: {
          default: {
            fontSize: 20,
          },
        },
        formatter: ({ value }: TickDatum) => String(value * 5000),
      },
    });
    // @ts-ignore
    let group = linear.labelsGroup.children! as Text[];
    expect(group[0].attr('text')).toBe('0');
    expect(group[1].attr('text')).toBe('1,000');
    linear.update({
      label: {
        minLength: 30,
        maxLength: 100,
        formatter: ({ value }: TickDatum) => String(value * 10000000),
      },
    });
    // @ts-ignore
    group = linear.labelsGroup.children! as Text[];
    expect(group[1].attr('text')).toBe('2,000K');
    expect(group[5].attr('text')).toBe('10,000K');
    linear.update({
      label: {
        minLength: 30,
        maxLength: 100,
        formatter: ({ value }: TickDatum) => String(value * 1e10),
      },
    });
    // @ts-ignore
    group = linear.labelsGroup.children! as Text[];
    expect(group[1].attr('text')).toBe('2e+9');
    expect(group[5].attr('text')).toBe('1e+10');
  });
});
