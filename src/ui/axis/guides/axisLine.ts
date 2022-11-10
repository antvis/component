import type { Point, Vector2 } from '@/types';
import { applyStyle, degToRad, renderExtDo, select, Selection } from '@/util';
import { ext, vec2 } from '@antv/matrix-util';
import { memoize } from 'lodash';
import { CLASS_NAMES } from '../constant';
import type { ArcAxisStyleProps, AxisLineCfg, AxisStyleProps, Direction, LinearAxisStyleProps } from '../types';
import { baseDependencies } from './utils';

export const getLineAngle = memoize(
  (value: number, cfg: ArcAxisStyleProps) => {
    const {
      angleRange: [startAngle, endAngle],
    } = cfg;
    return (endAngle - startAngle) * value + startAngle;
  },
  (value, cfg) => [value, ...cfg.angleRange].join()
);

export const getLineTangentVector = memoize(
  (value: number, cfg: AxisStyleProps) => {
    if (cfg.type === 'linear') {
      const {
        startPos: [startX, startY],
        endPos: [endX, endY],
      } = cfg;
      const [dx, dy] = [endX - startX, endY - startY];
      return vec2.normalize([0, 0], [dx, dy]) as Vector2;
    }
    const angle = degToRad(getLineAngle(value, cfg));
    return [-Math.sin(angle), Math.cos(angle)] as Vector2;
  },
  (value, cfg) => {
    const dependencies = baseDependencies(cfg);
    cfg.type === 'arc' && dependencies.push(value);
    return dependencies.join();
  }
);

export function getDirectionVector(value: number, direction: Direction, cfg: AxisStyleProps): Vector2 {
  const tangentVector = getLineTangentVector(value, cfg);
  return ext.vertical([], tangentVector, direction !== 'positive') as Vector2;
}

export const getLinearValuePos = memoize(
  (value: number, cfg: LinearAxisStyleProps): Vector2 => {
    const {
      startPos: [sx, sy],
      endPos: [ex, ey],
    } = cfg;
    const [dx, dy] = [ex - sx, ey - sy];
    return [sx + dx * value, sy + dy * value];
  },
  (value, cfg) => [value, ...cfg.startPos, ...cfg.endPos].join()
);

export const getArcValuePos = memoize(
  (value: number, cfg: ArcAxisStyleProps): Vector2 => {
    const {
      radius,
      center: [cx, cy],
    } = cfg;
    const angle = degToRad(getLineAngle(value, cfg));
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
  },
  (value, cfg) => [value, ...cfg.angleRange, cfg.radius, ...cfg.center].join()
);

export function getValuePos(value: number, cfg: AxisStyleProps) {
  if (cfg.type === 'linear') return getLinearValuePos(value, cfg);
  return getArcValuePos(value, cfg);
}

export function isAxisHorizontal(cfg: LinearAxisStyleProps): boolean {
  return getLineTangentVector(0, cfg)[1] === 0;
}

export function isAxisVertical(cfg: LinearAxisStyleProps): boolean {
  return getLineTangentVector(0, cfg)[0] === 0;
}

function renderArc(container: Selection, cfg: ArcAxisStyleProps, style: any) {
  const {
    angleRange: [startAngle, endAngle],
    center: [cx, cy],
    radius,
  } = cfg;
  console.assert(endAngle > startAngle, 'end angle should be greater than start angle');
  const diffAngle = endAngle - startAngle;
  if (diffAngle === 360) {
    container
      .maybeAppendByClassName(CLASS_NAMES.line, 'circle')
      .style('cx', cx)
      .style('cy', cy)
      .style('r', radius)
      .call(applyStyle, style);
    return;
  }
  const [rx, ry] = [radius, radius];
  const [startAngleRadians, endAngleRadians] = [(startAngle * Math.PI) / 180.0, (endAngle * Math.PI) / 180.0];
  const [x1, y1] = [cx + radius * Math.cos(startAngleRadians), cy + radius * Math.sin(startAngleRadians)];
  const [x2, y2] = [cx + radius * Math.cos(endAngleRadians), cy + radius * Math.sin(endAngleRadians)];
  // 大小弧
  const large = diffAngle > 180 ? 1 : 0;
  // 1-顺时针 0-逆时针
  const sweep = startAngle > endAngle ? 0 : 1;
  const isClosePath = false;
  const path = isClosePath
    ? `M${cx},${cy},L${x1},${y1},A${rx},${ry},0,${large},${sweep},${x2},${y2},L${cx},${cy}`
    : `M${x1},${y1},A${rx},${ry},0,${large},${sweep},${x2},${y2}`;
  container.maybeAppendByClassName(CLASS_NAMES.line, 'path').style('path', path).call(applyStyle, style);
}

function renderTruncation<T>(container: Selection, { truncRange, truncShape, lineExtension }: AxisLineCfg, style: any) {
  const firstLine = container.select(CLASS_NAMES.lineFirst.class).node();
  const secondLine = container.select(CLASS_NAMES.lineSecond.class).node();
  // TODO
}

function extendLine(startPos: Point, endPos: Point, range: [number, number] = [0, 0]) {
  const [[x1, y1], [x2, y2], [l1, l2]] = [startPos, endPos, range];
  const [x, y] = [x2 - x1, y2 - y1];
  const L = Math.sqrt(x ** 2 + y ** 2);
  const [s1, s2] = [-l1 / L, l2 / L];
  return [s1 * x, s1 * y, s2 * x, s2 * y];
}

function renderLinear(container: Selection, cfg: LinearAxisStyleProps, style: any) {
  const { startPos, endPos, truncRange, lineExtension } = cfg;
  const [[x1, y1], [x2, y2]] = [startPos, endPos];
  const [ox1, oy1, ox2, oy2] = lineExtension ? extendLine(startPos, endPos, lineExtension) : new Array(4).fill(0);
  container.node().removeChildren();

  const renderLine = (className: string, [[a, b], [c, d]]: [Vector2, Vector2]) => {
    container
      .maybeAppendByClassName(className, 'line')
      .attr('className', `${CLASS_NAMES.line.name} ${className}`)
      .call(applyStyle, { ...style, x1: a, y1: b, x2: c, y2: d });
  };
  if (!truncRange) {
    renderLine('axis-line', [
      [x1 + ox1, y1 + oy1],
      [x2 + ox2, y2 + oy2],
    ]);
    return;
  }
  const [r1, r2] = truncRange;
  const [x3, y3] = [x1 + (x2 - x1) * r1, y1 + (y2 - y1) * r1];
  const [x4, y4] = [x1 + (x2 - x1) * r2, y1 + (y2 - y1) * r2];
  renderLine(CLASS_NAMES.lineFirst.name, [
    [x1 + ox1, y1 + oy1],
    [x3, y3],
  ]);
  renderLine(CLASS_NAMES.lineSecond.name, [
    [x4, y4],
    [x2 + ox2, y2 + oy2],
  ]);
  renderTruncation(container, cfg, style);
}

function renderAxisArrow(
  container: Selection,
  type: 'linear' | 'arc',
  { lineArrow, truncRange, lineArrowOffset = 0, lineArrowSize }: AxisStyleProps,
  style: any
) {
  if (!lineArrow) return;
  const arrow = renderExtDo(lineArrow);
  select(arrow).call(applyStyle, { ...style, transform: `scale(${lineArrowSize})` });
  let shapeToAddArrow: Selection;
  if (type === 'arc') shapeToAddArrow = container.select(CLASS_NAMES.line.class);
  else if (truncRange) shapeToAddArrow = container.select(CLASS_NAMES.lineSecond.class);
  else shapeToAddArrow = container.select(CLASS_NAMES.line.class);
  shapeToAddArrow.style('markerEnd', arrow).style('markerEndOffset', -lineArrowOffset);
}

export function renderAxisLine<T>(container: Selection, cfg: AxisStyleProps, style: any) {
  const { type } = cfg;
  if (type === 'linear') renderLinear(container, cfg, style);
  else renderArc(container, cfg, style);
  renderAxisArrow(container, type, cfg, style);
}
