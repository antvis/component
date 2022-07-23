import { vec2, ext } from '@antv/matrix-util';
import { DisplayObjectConfig } from '@antv/g';
import type { Vector2 } from '../../types';
import { ifNegative, ifPositive, mid, multi, maybeAppend } from '../../util';
import { createComponent } from '../../util/create';
import { Marker } from '../marker';
import {
  autoHideTickLine,
  calcOptimizedTicks,
  getSign,
  ifLeft,
  ifRight,
  ifTop,
  ifX,
  ifY,
  processOverlap,
} from './utils';
import type { AxisLabelCfg, AxisOrient, LinearAxisStyleProps } from './types';
import { AXIS_BASE_DEFAULT_OPTIONS } from './constant';
import { renderTitle } from './guides/axisTitle';
import { renderTicks } from './guides/axisTicks';
import { renderAxisLabels } from './guides/axisLabels';
import { renderAxisLine } from './guides/axisLine';
import { renderGrid } from './guides/axisGrid';

type LinearOptions = DisplayObjectConfig<LinearAxisStyleProps>;
export { LinearOptions };

// 注册轴箭头
// ->
Marker.registerSymbol('axis-arrow', (x0: number, y0: number, r: number) => {
  const x = x0 + 2 * r;
  const y = y0;
  return [
    ['M', x0, y0],
    ['L', x, y],
    ['L', x - r, y - r],
    ['L', x + r, y],
    ['L', x - r, y + r],
    ['L', x, y],
  ];
});

export function getTickEndPoints(
  startPoint: Vector2,
  length: number,
  verticalVector: any = [0, 0]
): [Vector2, Vector2] {
  const [x, y] = startPoint;
  const [dx, dy] = vec2.scale([0, 0], verticalVector, length);
  return [
    [x, y],
    [x + dx, y + dy],
  ];
}

function inferAxisPosition(axesVector: any = [0, 0], verticalFactor = 1) {
  let position = 'bottom';
  if (Math.abs(axesVector[0]) > Math.abs(axesVector[1])) position = verticalFactor === 1 ? 'bottom' : 'top';
  else position = verticalFactor === -1 ? 'left' : 'right';

  return position;
}

function getEndPoints(startPos?: Vector2, endPos?: Vector2): [Vector2, Vector2] {
  return [startPos || [0, 0], endPos || [0, 0]];
}

function getTickPoints(endPoints: Vector2[], value: number, orient: AxisOrient, len = 0): Vector2[] {
  const [[spx, spy], [epx, epy]] = endPoints;
  const [x1, y1] = [value * (epx - spx) + spx, value * (epy - spy) + spy];

  // 轴向量方向: 从左到右，从下到上
  const axesVector = vec2.normalize([0, 0], [Math.abs(epx - spx), -Math.abs(epy - spy)]) as Vector2;
  const sign = getSign(orient, -1, 1);
  const [dx, dy] = vec2.scale([0, 0], ext.vertical([], axesVector as any, false /** 顺时针，增量 */) as Vector2, len);

  return [
    [x1, y1],
    [x1 + multi(sign, dx), y1 + multi(sign, dy)],
  ];
}

function getLabelAttrs(
  ticks: any[],
  endPoints: any[],
  axisPosition: string,
  labelCfg?: AxisLabelCfg | null,
  tickLineCfg?: any
) {
  const tickLength = tickLineCfg?.len || 0;
  const orient: any = axisPosition;
  const { formatter, tickPadding = 0, offset = 0, alignTick = true, rotate = 0 } = labelCfg || {};

  const sign = getSign(orient, -1, 1);
  const data: any = Array.from(ticks).map((datum, idx) => {
    let value = datum.value;
    if (!alignTick) {
      value = mid((idx === ticks.length - 1 ? 1 : ticks[idx + 1]?.value) + value);
    }
    const [, [x, y]] = getTickPoints(endPoints, value, orient, tickLength + tickPadding);
    const text = formatter ? formatter(datum, idx) : datum.text;
    let textAlign: any = ifX(orient, 'center', ifLeft(orient, 'end', 'start'));
    if (rotate) {
      textAlign = ifLeft(
        orient,
        'end',
        ifRight(orient, 'start', ifPositive(multi(sign, rotate), 'left', ifNegative(multi(sign, rotate), 'right')))
      );
    }

    return {
      id: `label-${datum.id}`,
      // orient,
      x: x + ifX(orient, offset, 0)!,
      y: y + ifY(orient, offset, 0)!,
      text,
      textAlign,
      textBaseline: ifY(orient, 'middle', ifTop(orient, 'bottom', 'top')),
      transform: `rotate(${rotate || 0}deg)`,
    };
  });

  return data as any[];
}

function getTitlePosition(
  endPoints: [Vector2, Vector2],
  axisPosition: string,
  offsetX: number,
  offsetY: number,
  cfg?: any
): {
  x: number;
  y: number;
  textAlign: string;
  textBaseline: string;
} {
  const [start, end] = endPoints;
  const [x1, y1] = start;
  const [x2, y2] = end;

  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);
  let x = minX;
  let y = minY;
  let ox = 0;
  let oy = 0;
  let textBaseline = 'bottom';
  let textAlign = 'start';
  if (axisPosition === 'left' || axisPosition === 'right') {
    ox = offsetX + (cfg?.titlePadding || 0);
    if (cfg?.titleAnchor === 'center') y = (y1 + y2) / 2;
    if (cfg?.titleAnchor === 'end') (y = maxY), (textBaseline = 'top');
    if (axisPosition === 'left') (textAlign = 'end'), (ox *= -1);
  } else {
    oy = offsetY + (cfg?.titlePadding || 0);
    if (cfg?.titleAnchor === 'center') (x = (x1 + x2) / 2), (textAlign = 'center');
    if (cfg?.titleAnchor === 'end') (x = maxX), (textAlign = 'end');
    if (axisPosition === 'top') oy *= -1;
    if (axisPosition === 'bottom') textBaseline = 'top';
  }

  if (cfg?.positionX !== undefined) (x = minX + cfg.positionX), (textAlign = 'start');
  if (cfg?.positionY !== undefined) (y = minY + cfg.positionY), (textBaseline = 'bottom');

  return { x: x + ox, y: y + oy, textAlign, textBaseline };
}

function getTickLines(ticks: any[], endPoints: any[], axisPosition: any, tickLength: number) {
  return Array.from(ticks).map((datum) => {
    const [[x1, y1], [x2, y2]] = getTickPoints(endPoints, datum.value, axisPosition, tickLength);
    return { x1, y1, x2, y2, id: `tick-${datum.id}`, data: datum };
  });
}

function getSubTickLines(ticks: any[], points: any[], orient: any, subTickCount = 0, subTickLength = 0) {
  return Array.from(ticks)
    .map((datum: any, idx) => {
      if (idx === ticks.length - 1) return [];
      return Array(subTickCount)
        .fill(null)
        .map((d: any, subIdx) => {
          const step = ((ticks[idx + 1]?.value || 1) - datum.value) / (subTickCount + 1);
          const value = datum.value + step * (subIdx + 1);
          const [[x1, y1], [x2, y2]] = getTickPoints(points, value, orient, subTickLength);
          return { id: `sub-${datum.id}-${subIdx}`, x1, y1, x2, y2 };
        });
    })
    .flat();
}

export const Linear = createComponent<LinearAxisStyleProps>(
  {
    render(attributes, container) {
      const {
        startPos,
        endPos,
        verticalFactor,
        ticksThreshold,
        appendTick,
        axisLine,
        ticks = [],
        label = {},
        tickLine,
        subTickLine,
        title,
        grid,
      } = attributes;
      const points = getEndPoints(startPos, endPos);
      const [[x1, y1], [x2, y2]] = points;
      const axesVector = vec2.normalize([0, 0], [x2 - x1, y2 - y1]);
      const axisPosition = inferAxisPosition(axesVector, verticalFactor || 1);
      const optimizedTicks = calcOptimizedTicks(ticks, ticksThreshold, appendTick);

      renderGrid(container, grid);

      const axisLineGroup = maybeAppend(container, '.axis-line-group', 'g').attr('className', 'axis-line-group').node();
      renderAxisLine(axisLineGroup, `M${x1},${y1} L${x2},${y2}`, points, axisLine);

      const axisTickGroup = maybeAppend(container, '.axis-tick-group', 'g').attr('className', 'axis-tick-group').node();
      const tickItems = getTickLines(optimizedTicks, points, axisPosition, tickLine?.len || 0);
      renderTicks(axisTickGroup, tickItems, tickLine);

      const SUBTICK_GROUP = 'axis-subtick-group';
      const subTickGroup = maybeAppend(container, `.${SUBTICK_GROUP}`, 'g').attr('className', SUBTICK_GROUP).node();
      const subTickItems = getSubTickLines(optimizedTicks, points, axisPosition, subTickLine?.count, subTickLine?.len);
      renderTicks(subTickGroup, subTickItems, subTickLine, 'sub');

      const LABEL_GROUP = 'axis-label-group';
      const labelGroup = maybeAppend(container, `.${LABEL_GROUP}`, 'g').attr('className', LABEL_GROUP).node();
      const labelsCfg = getLabelAttrs(optimizedTicks, points, axisPosition, label, tickLine);
      renderAxisLabels(labelGroup, labelsCfg, label);

      // Process overlap.
      const labels = labelGroup.querySelectorAll('.axis-label');
      const tickLines = labelGroup.querySelectorAll('.axis-tick');
      processOverlap(label, axisPosition)(labels);
      autoHideTickLine(labels, tickLines, label?.autoHideTickLine);

      // Render title.
      const [hw1, hh1] = axisTickGroup.getBounds().halfExtents;
      const [hw2, hh2] = labelGroup.getBounds().halfExtents;
      const axisLineWidth = +(axisLine?.style?.lineWidth || 0);
      const offsetX = (hw1 + hw2) * 2 + axisLineWidth;
      const offsetY = (hh1 + hh2) * 2 + axisLineWidth;
      const { x, y, textAlign, textBaseline } = getTitlePosition(points, axisPosition, offsetX, offsetY, title);
      renderTitle(container, x, y, textAlign, textBaseline, title);
    },
  },
  AXIS_BASE_DEFAULT_OPTIONS.style
);
