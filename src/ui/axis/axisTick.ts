import { vec2, ext } from '@antv/matrix-util';
import { multi, DegToRad } from '../../util';
import { AxisOrient, AxisTickLineCfg, Point, TickDatum } from './types';
import { getSign } from './utils';

const { abs, cos, sin } = Math;

export function getArcTickPoints(
  center: [number, number],
  radius: number,
  angle: number,
  orient: AxisOrient,
  len = 0
): Point[] {
  const [cx, cy] = center;
  const radian = angle * DegToRad;
  const rx = radius * cos(radian);
  const ry = radius * sin(radian);

  const sign = getSign(orient, -1, 1);
  const rx1 = (radius + multi(sign, len)) * cos(radian);
  const ry1 = (radius + multi(sign, len)) * sin(radian);
  return [
    [cx + rx, cy + ry],
    [cx + rx1, cy + ry1],
  ];
}

export function getTickPoints(endPoints: Point[], value: number, orient: AxisOrient, len = 0): Point[] {
  const [[spx, spy], [epx, epy]] = endPoints;
  const [x1, y1] = [value * (epx - spx) + spx, value * (epy - spy) + spy];

  // 轴向量方向: 从左到右，从下到上
  const axesVector = vec2.normalize([0, 0], [abs(epx - spx), -abs(epy - spy)]) as Point;
  const sign = getSign(orient, -1, 1);
  const [dx, dy] = vec2.scale([0, 0], ext.vertical([], axesVector, false /** 顺时针，增量 */) as Point, len);

  return [
    [x1, y1],
    [x1 + multi(sign, dx), y1 + multi(sign, dy)],
  ];
}

type AxisTickOptions = AxisTickLineCfg & {
  /** End Points of axes. */
  endPoints: Point[];
  /** Orient of axis */
  orient: 'top' | 'bottom' | 'left' | 'right';
  /** Ticks value. */
  ticks: TickDatum[];

  axisType?: string;

  // For arc axis.
  center?: Point;
  radius?: number;
  startAngle?: number;
  endAngle?: number;
};

export function getAxisTicks(options: AxisTickOptions) {
  const {
    ticks,
    endPoints,
    orient,
    len: tickLength = 0,
    axisType,
    style,
    center = [0, 0],
    radius = 0,
    startAngle = 0,
    endAngle = 0,
  } = options;

  return Array.from(ticks).map((datum) => {
    let [[x, y], [x2, y2]] = getTickPoints(endPoints, datum.value, orient, tickLength);
    if (axisType === 'arc') {
      const tickAngle = (endAngle - startAngle) * datum.value + startAngle;
      [[x, y], [x2, y2]] = getArcTickPoints(center, radius, tickAngle, orient, tickLength);
    }
    return {
      visibility: 'visible' as any,
      ...style,
      id: `tick-${datum.id}`,
      x1: x,
      y1: y,
      x2,
      y2,
    };
  });
}
