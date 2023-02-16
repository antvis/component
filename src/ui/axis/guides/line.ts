import { ext, vec2 } from '@antv/matrix-util';
import { get, memoize } from '@antv/util';
import { transition, type AnimationResult, type StandardAnimationOption } from '../../../animation';
import type { RequiredStyleProps } from '../../../core';
import type { DisplayObject, Point, Vector2 } from '../../../types';
import { degToRad, keyframeInterpolate, renderExtDo, scaleToPixel, Selection, subStyleProps } from '../../../util';
import { CLASS_NAMES } from '../constant';
import type { ArcAxisStyleProps, AxisLineStyleProps, AxisStyleProps, Direction, LinearAxisStyleProps } from '../types';
import { baseDependencies } from './utils';

type LineDatum = {
  line: [Vector2, Vector2];
  className: string;
};

export const getLineAngle = memoize(
  (value: number, attr: RequiredStyleProps<ArcAxisStyleProps>) => {
    const { startAngle, endAngle } = attr.style;
    return (endAngle - startAngle) * value + startAngle;
  },
  (value, attr) => [value, attr.style.startAngle, attr.style.endAngle].join()
);

export const getLineTangentVector = memoize(
  (value: number, attr: RequiredStyleProps<AxisStyleProps>) => {
    if (attr.style.type === 'linear') {
      const {
        startPos: [startX, startY],
        endPos: [endX, endY],
      } = attr.style;
      const [dx, dy] = [endX - startX, endY - startY];
      return vec2.normalize([0, 0], [dx, dy]) as Vector2;
    }

    const angle = degToRad(getLineAngle(value, attr));
    return [-Math.sin(angle), Math.cos(angle)] as Vector2;
  },
  (value, attr: RequiredStyleProps<AxisStyleProps>) => {
    const dependencies = baseDependencies(attr);
    attr.style.type === 'arc' && dependencies.push(value);
    return dependencies.join();
  }
);

export function getDirectionVector(
  value: number,
  direction: Direction,
  attr: RequiredStyleProps<AxisStyleProps>
): Vector2 {
  const tangentVector = getLineTangentVector(value, attr);
  return ext.vertical([], tangentVector, direction !== 'positive') as Vector2;
}

export const getLinearValuePos = memoize(
  (value: number, attr: RequiredStyleProps<LinearAxisStyleProps>): Vector2 => {
    const {
      startPos: [sx, sy],
      endPos: [ex, ey],
    } = attr.style;
    const [dx, dy] = [ex - sx, ey - sy];
    return [sx + dx * value, sy + dy * value];
  },
  (value, attr) => [value, ...attr.style.startPos, ...attr.style.endPos].join()
);

export const getArcValuePos = memoize(
  (value: number, attr: RequiredStyleProps<ArcAxisStyleProps>): Vector2 => {
    const {
      radius,
      center: [cx, cy],
    } = attr.style;
    const angle = degToRad(getLineAngle(value, attr));
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
  },
  (value, attr: RequiredStyleProps<ArcAxisStyleProps>) => {
    const {
      style: { startAngle, endAngle, radius, center },
    } = attr;
    return [value, startAngle, endAngle, radius, ...center].join();
  }
);

export function getValuePos(value: number, attr: RequiredStyleProps<AxisStyleProps>) {
  if (attr.style.type === 'linear') return getLinearValuePos(value, attr);
  return getArcValuePos(value, attr);
}

export function isAxisHorizontal(attr: RequiredStyleProps<LinearAxisStyleProps>): boolean {
  return getLineTangentVector(0, attr)[1] === 0;
}

export function isAxisVertical(attr: RequiredStyleProps<LinearAxisStyleProps>): boolean {
  return getLineTangentVector(0, attr)[0] === 0;
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
  const { startAngle, endAngle, center, radius } = arc.attributes;
  return [startAngle, endAngle, ...center, radius];
}

function renderArc(
  container: Selection,
  attr: RequiredStyleProps<ArcAxisStyleProps>,
  style: RequiredStyleProps<ArcAxisStyleProps>['style'],
  animate: StandardAnimationOption
) {
  const { startAngle, endAngle, center, radius } = attr.style;

  return container
    .selectAll(CLASS_NAMES.line.class)
    .data([{ path: getArcPath(startAngle, endAngle, ...center, radius) }], (d, i) => i)
    .join(
      (enter) =>
        enter
          .append('path')
          .attr('className', CLASS_NAMES.line.name)
          .styles(attr.style)
          .styles({ path: (d: any) => d.path }),
      (update) =>
        update
          .transition(function () {
            const animation = keyframeInterpolate(
              this,
              getArcAttr(this),
              [startAngle, endAngle, ...center, radius],
              animate.update
            );
            if (animation) {
              const layout = () => {
                const data = get(this.attributes, '__keyframe_data__') as Parameters<typeof getArcPath>;
                this.style.path = getArcPath(...data);
              };
              animation.onframe = layout;
              animation.onfinish = layout;
            }
            return animation;
          })
          .styles(attr.style),
      (exit) => exit.remove()
    )
    .styles(style)
    .transitions();
}

function renderTruncation<T>(
  container: Selection,
  { style: { truncRange, truncShape, lineExtension } }: RequiredStyleProps<AxisStyleProps>
) {
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

function renderLinear(
  container: Selection,
  attr: RequiredStyleProps<LinearAxisStyleProps>,
  style: RequiredStyleProps<LinearAxisStyleProps>['style'],
  animate: StandardAnimationOption
) {
  const {
    showTrunc,
    style: { startPos, endPos, truncRange, lineExtension },
  } = attr;
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

  if (!showTrunc || !truncRange) {
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
  renderTruncation(container, attr);
  return animation;
}

function renderAxisArrow(
  container: Selection,
  type: 'linear' | 'arc',
  attr: RequiredStyleProps<AxisStyleProps>,
  style: AxisLineStyleProps['style']
) {
  const {
    showArrow,
    showTrunc,
    style: { lineArrow, lineArrowOffset, lineArrowSize },
  } = attr;

  let shapeToAddArrow: Selection;
  if (type === 'arc') shapeToAddArrow = container.select(CLASS_NAMES.line.class);
  else if (showTrunc) shapeToAddArrow = container.select(CLASS_NAMES.lineSecond.class);
  else shapeToAddArrow = container.select(CLASS_NAMES.line.class);
  if (!showArrow || !lineArrow || (attr.style.type === 'arc' && isCircle(attr.style.startAngle, attr.style.endAngle))) {
    shapeToAddArrow.style('markerEnd', null);
    return;
  }
  const arrow = renderExtDo(lineArrow);
  arrow.attr(style);
  scaleToPixel(arrow, lineArrowSize!, true);
  shapeToAddArrow.style('markerEnd', arrow).style('markerEndOffset', -lineArrowOffset);
}

export function renderAxisLine(
  container: Selection,
  attr: RequiredStyleProps<AxisStyleProps>,
  animate: StandardAnimationOption
) {
  const { type } = attr.style;
  let animation: AnimationResult[];
  const { style } = subStyleProps<RequiredStyleProps<AxisStyleProps>>(attr, 'line');
  if (type === 'linear')
    animation = renderLinear(
      container,
      attr as RequiredStyleProps<LinearAxisStyleProps>,
      style as RequiredStyleProps<LinearAxisStyleProps>['style'],
      animate
    );
  else
    animation = renderArc(
      container,
      attr as RequiredStyleProps<ArcAxisStyleProps>,
      style as RequiredStyleProps<ArcAxisStyleProps>['style'],
      animate
    );
  renderAxisArrow(container, type, attr, style);
  return animation;
}
