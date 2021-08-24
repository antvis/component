import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Arc } from '../../../../src';
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

const arc = new Arc({
  style: {
    startAngle: -90,
    endAngle: 180,
    radius: 100,
    center: [200, 200],
  },
});

canvas.appendChild(arc);

function createData(values: number[], texts?: string[], states?: State[], ids?: string[]): TickDatum[] {
  return values.map((value, idx) => {
    const datum: TickDatum = { value };
    if (texts && texts.length > idx) datum.text = texts[idx];
    if (states && states.length > idx) datum.state = states[idx];
    if (ids && ids.length > idx) datum.id = ids[idx];
    return datum;
  });
}

describe('arc', () => {
  test('basic', async () => {
    arc.update({
      title: {
        content: '弧形轴',
        position: 'center',
        offset: [0, 50],
      },
      axisLine: {
        arrow: {
          start: {
            symbol: 'diamond',
            size: 10,
          },
          end: {
            symbol: 'axis-arrow',
            size: 10,
          },
        },
      },
      ticks: createData([0, 0.2, 0.4, 0.6, 0.8], ['A', 'B', 'C', 'D', 'E']),
      label: {
        alignTick: false,
        offset: [0, 20],
      },
      subTickLine: {
        count: 0,
      },
    });
    // @ts-ignore
    const [CMD1, CMD2, CMD3] = arc.axisLine.attr('path');

    // 圆心
    expect(CMD1).toStrictEqual(['M', 200, 200]);
    // 起点
    expect(CMD2).toStrictEqual(['L', 200, 100]);
    // 曲线
    expect(CMD3).toStrictEqual(['A', 100, 100, 0, 1, 1, 100, 200]);
  });

  test('arrow', async () => {
    // @ts-ignore
    expect(arc.axisEndArrow.getEulerAngles()).toBeCloseTo(-90);
  });

  test('ticks', async () => {
    // @ts-ignore
    const [[, x1, y1], [, x2, y2]] = arc.tickLinesGroup.children[0]!.attr('path');
    expect(x2 - x1).toBeCloseTo(0);
    expect(Math.abs(y2 - y1)).toBe(10);
  });

  test('autoRotate', async () => {
    // 默认布局下应该不会有碰撞
    arc.update({
      label: {
        formatter: () => {
          return '这是一段很长的文本';
        },
        rotate: 10,
        autoRotate: true,
        autoEllipsis: false,
        autoHide: false,
      },
    });
  });

  test('autoEllipsis', async () => {
    arc.update({
      label: {
        type: 'text',
        minLength: 20,
        maxLength: 50,
        autoRotate: false,
        autoEllipsis: true,
        autoHide: false,
      },
    });
    // @ts-ignore
    expect(arc.labelsGroup.children[0]!.attr('text')).toBe('这是一...');
  });

  test('autoHide', async () => {
    // 默认布局下应该不会有碰撞
    arc.update({
      startAngle: 0,
      endAngle: 360,
      label: {
        rotate: 0,
        alignTick: true,
        autoEllipsis: false,
        autoRotate: false,
      },
    });
  });
});
