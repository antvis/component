import { ext, vec2 } from '@antv/matrix-util';
import { memoize, get } from '@antv/util';
import type { StandardAnimationOption, AnimationResult } from '../../../animation';
import type { DisplayObject, Point, Vector2 } from '../../../types';
import { degToRad, keyframeInterpolate, renderExtDo, scaleToPixel, Selection, transition } from '../../../util';
import { CLASS_NAMES } from '../constant';
import type { ArcAxisStyleProps, AxisLineCfg, AxisStyleProps, Direction, LinearAxisStyleProps } from '../types';
import { baseDependencies } from './utils';

type LineDatum = {
  line: [Vector2, Vector2];
  className: string;
};

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

function isCircle(startAngle: number, endAngle: number) {
  return endAngle - startAngle === 360;
}

function getArcPath(startAngle: number, endAngle: number, cx: number, cy: number, radius: number) {
  const diffAngle = endAngle - startAngle;
  const [rx, ry] = [radius, radius];
  const [startAngleRadians, endAngleRadians] = [degToRad(startAngle), degToRad(endAngle)];
  const getPosByAngle = (angle: number) => [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];

  const [x1, y1] = getPosByAngle(startAngleRadians);
  const [x2, y2] = getPosByAngle(endAngleRadians);

  if (isCircle(startAngle, endAngle)) {
    const middleAngleRadians = (endAngleRadians + startAngleRadians) / 2;
    const [xm, ym] = getPosByAngle(middleAngleRadians);
    return `M${x1},${y1} A ${rx},${ry} 0 1,0 ${xm}, ${ym} A ${rx},${ry} 0 1,0 ${x2}, ${y2}`;
  }

  // 大小弧
  const large = diffAngle > 180 ? 1 : 0;
  // 1-顺时针 0-逆时针
  const sweep = startAngle > endAngle ? 0 : 1;
  const isClosePath = false;

  return isClosePath
    ? `M${cx},${cy},L${x1},${y1},A${rx},${ry},0,${large},${sweep},${x2},${y2},L${cx},${cy}`
    : `M${x1},${y1},A${rx},${ry},0,${large},${sweep},${x2},${y2}`;
}

function getArcAttr(arc: DisplayObject) {
  const { angleRange, center, radius } = arc.attributes;
  return [...angleRange, ...center, radius] as [number, number, number, number, number];
}

function renderArc(container: Selection, cfg: ArcAxisStyleProps, style: any, animate: StandardAnimationOption) {
  const { angleRange, center, radius } = cfg;
  return container
    .selectAll(CLASS_NAMES.line.class)
    .data([{ path: getArcPath(...angleRange, ...center, radius) }], (d, i) => i)
    .join(
      (enter) =>
        enter
          .append('path')
          .attr('className', CLASS_NAMES.line.name)
          .styles({ angleRange, center, radius, ...style })
          .style('path', (d: any) => d.path),
      (update) =>
        update
          .styles(style)
          .transition(function () {
            const animation = keyframeInterpolate(
              this,
              getArcAttr(this),
              [...angleRange, ...center, radius] as ReturnType<typeof getArcAttr>,
              animate.update
            );
            if (animation) {
              const layout = () => {
                const data = get(this.style, '__keyframe_data__') as Parameters<typeof getArcPath>;
                this.style.path = getArcPath(...data);
              };
              animation.onframe = layout;
              animation.onfinish = layout;
            }
            return animation;
          })
          .styles({ angleRange, center, radius }),
      (exit) => exit.remove()
    )
    .styles(style)
    .transitions();
}

function renderTruncation<T>(container: Selection, { truncRange, truncShape, lineExtension }: AxisLineCfg, style: any) {
  // TODO
}

function extendLine(startPos: Point, endPos: Point, range: [number, number] = [0, 0]) {
  const [[x1, y1], [x2, y2], [l1, l2]] = [startPos, endPos, range];
  const [x, y] = [x2 - x1, y2 - y1];
  const L = Math.sqrt(x ** 2 + y ** 2);
  const [s1, s2] = [-l1 / L, l2 / L];
  return [s1 * x, s1 * y, s2 * x, s2 * y];
}

function getLinePath(points: [Vector2, Vector2]) {
  const [[x1, y1], [x2, y2]] = points;
  return { x1, y1, x2, y2 };
}

function renderLinear(container: Selection, cfg: LinearAxisStyleProps, style: any, animate: StandardAnimationOption) {
  const { startPos, endPos, truncRange, lineExtension } = cfg;
  const [[x1, y1], [x2, y2]] = [startPos, endPos];
  const [ox1, oy1, ox2, oy2] = lineExtension ? extendLine(startPos, endPos, lineExtension) : new Array(4).fill(0);

  const renderLine = (data: LineDatum[]) => {
    return container
      .selectAll(CLASS_NAMES.line.class)
      .data(data, (d, i) => i)
      .join(
        (enter) =>
          enter
            .append('line')
            .attr('className', (d: LineDatum) => `${CLASS_NAMES.line.name} ${d.className}`)
            .styles(style)
            .transition(function ({ line }: LineDatum) {
              return transition(this, getLinePath(line), false);
            }),
        (update) =>
          update.styles(style).transition(function ({ line }: LineDatum) {
            return transition(this, getLinePath(line), animate.update);
          }),
        (exit) => exit.remove()
      )
      .transitions();
  };
  if (!truncRange) {
    return renderLine([
      {
        line: [
          [x1 + ox1, y1 + oy1],
          [x2 + ox2, y2 + oy2],
        ],
        className: CLASS_NAMES.line.name,
      },
    ]);
  }
  const [r1, r2] = truncRange;
  const [x3, y3] = [x1 + (x2 - x1) * r1, y1 + (y2 - y1) * r1];
  const [x4, y4] = [x1 + (x2 - x1) * r2, y1 + (y2 - y1) * r2];
  const animation = renderLine([
    {
      line: [
        [x1 + ox1, y1 + oy1],
        [x3, y3],
      ],
      className: CLASS_NAMES.lineFirst.name,
    },
    {
      line: [
        [x4, y4],
        [x2 + ox2, y2 + oy2],
      ],
      className: CLASS_NAMES.lineSecond.name,
    },
  ]);
  renderTruncation(container, cfg, style);
  return animation;
}

function renderAxisArrow(container: Selection, type: 'linear' | 'arc', cfg: AxisStyleProps, style: any) {
  const { showArrow, lineArrow, truncRange, lineArrowOffset = 0, lineArrowSize } = cfg;

  let shapeToAddArrow: Selection;
  if (type === 'arc') shapeToAddArrow = container.select(CLASS_NAMES.line.class);
  else if (truncRange) shapeToAddArrow = container.select(CLASS_NAMES.lineSecond.class);
  else shapeToAddArrow = container.select(CLASS_NAMES.line.class);
  if (!showArrow || !lineArrow || (cfg.type === 'arc' && isCircle(...cfg.angleRange))) {
    shapeToAddArrow.style('markerEnd', null);
    return;
  }
  const arrow = renderExtDo(lineArrow);
  arrow.attr(style);
  scaleToPixel(arrow, lineArrowSize!, true);

  shapeToAddArrow.style('markerEnd', arrow).style('markerEndOffset', -lineArrowOffset);
}

export function renderAxisLine<T>(
  container: Selection,
  cfg: AxisStyleProps,
  style: any,
  animate: StandardAnimationOption
) {
  const { type } = cfg;
  let animation: AnimationResult[];
  if (type === 'linear') animation = renderLinear(container, cfg, style, animate);
  else animation = renderArc(container, cfg, style, animate);
  renderAxisArrow(container, type, cfg, style);
  return animation;
}
