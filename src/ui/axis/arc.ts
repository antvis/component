import type { DisplayObjectConfig } from '@antv/g';
import { isNumberEqual } from '@antv/util';
import type { Vector2 } from '../../types';
import type { ArcAxisStyleProps, AxisOrient } from './types';
import { AXIS_BASE_DEFAULT_OPTIONS } from './constant';
import { deepAssign, DegToRad, maybeAppend, multi } from '../../util';
import { createComponent } from '../../util/create';
import { autoHideTickLine, calcOptimizedTicks, getSign, ifOutside, processOverlap } from './utils';
import { renderAxisLabels } from './guides/axisLabels';
import { renderTitle } from './guides/axisTitle';
import { renderTicks } from './guides/axisTicks';
import { renderAxisLine } from './guides/axisLine';
import { renderGrid } from './guides/axisGrid';

const { PI, abs, cos, sin } = Math;
const [PI2] = [PI * 2];
type ArcOptions = DisplayObjectConfig<ArcAxisStyleProps>;
export { ArcOptions };

const DEFAULT_ARC_STYLE = deepAssign(
  {
    startAngle: -90,
    endAngle: 270,
    center: [0, 0],
    label: {
      tickPadding: 2,
      style: {},
      align: 'normal',
    },
  },
  AXIS_BASE_DEFAULT_OPTIONS.style || {}
);

function getArcTickPoints(
  center: [number, number],
  radius: number,
  angle: number,
  orient: AxisOrient,
  len = 0
): [Vector2, Vector2] {
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

function getTickLines(
  ticks: any[],
  startAngle: number,
  endAngle: number,
  radius: number,
  center: any,
  orient: any,
  tickLength = 0
) {
  return Array.from(ticks).map((datum) => {
    const tickAngle = (endAngle - startAngle) * datum.value + startAngle;
    const [[x1, y1], [x2, y2]] = getArcTickPoints(center, radius, tickAngle, orient, tickLength);
    return { x1, y1, x2, y2, id: `tick-${datum.id}`, data: datum };
  });
}

function getSubTickLines(
  ticks: any[],
  startAngle: number,
  endAngle: number,
  radius: number,
  center: any,
  orient: any,
  subTickCount = 0,
  subTickLength = 0
) {
  return Array.from(ticks)
    .map((datum: any, idx) => {
      return Array(subTickCount)
        .fill(null)
        .map((d: any, subIdx) => {
          const step = ((ticks[idx + 1]?.value || 1 + ticks[0].value) - datum.value) / (subTickCount + 1);
          const value = datum.value + step * (subIdx + 1);
          const tickAngle = (endAngle - startAngle) * value + startAngle;
          const [[x1, y1], [x2, y2]] = getArcTickPoints(center, radius, tickAngle, orient, subTickLength);
          return { id: `sub-${datum.id}-${subIdx}`, x1, y1, x2, y2 };
        });
    })
    .flat();
}

// [todo] Make more smarter in normal align.
function getTextAnchor(vector: number[]): string {
  let align: any;
  if (isNumberEqual(vector[0], 0)) {
    align = 'center';
  } else if (vector[0] > 0) {
    align = 'start';
  } else if (vector[0] < 0) {
    align = 'end';
  }
  return align;
}

function getTextBaseline(vector: number[]): string {
  let base: any;
  if (isNumberEqual(vector[1], 0)) {
    base = 'middle';
  } else if (vector[1] > 0) {
    base = 'top';
  } else if (vector[1] < 0) {
    base = 'bottom';
  }
  return base;
}

function getLabelAttrs(
  ticks: any[],
  startAngle: number,
  endAngle: number,
  radius: number,
  center: any,
  axisPosition: any,
  labelCfg: any,
  tickLength = 0
) {
  const orient = axisPosition;
  const sign = getSign(orient, -1, 1);
  const { tickPadding = 0, formatter, align, rotate } = labelCfg;
  return Array.from(ticks).map((datum, idx) => {
    const tickAngle = (endAngle - startAngle) * datum.value + startAngle;
    const formatAngle = (a: number) => (a >= 270 ? (a - 360) % 360 : a);
    const tickOffset = tickLength + tickPadding;

    let angle = formatAngle(tickAngle);
    let [, [x, y]] = getArcTickPoints(center, radius, tickAngle, orient, tickOffset);
    const text = formatter ? formatter(datum, idx) : datum.text;

    let textAlign: any = 'center';
    let textBaseline: any = 'baseline';
    // 垂直于坐标轴的向量
    const sideVector = [multi(sign, x - center[0]), multi(sign, y - center[1])];
    if (align === 'radial') {
      textBaseline = 'middle';
      if (angle >= 90 || angle < -90) {
        angle += 180;
      }
      textAlign = getTextAnchor(sideVector);
      if (isNumberEqual(angle, -90)) {
        textAlign = ifOutside(orient, 'start', 'end');
      }
      if (isNumberEqual(angle, 270)) {
        textAlign = ifOutside(orient, 'end', 'start');
      }
    } else if (align === 'tangential') {
      textAlign = 'center';
      textBaseline = 'bottom';
      if (angle >= 0 && angle < 180) {
        angle += 270;
        const labelSize =
          typeof labelCfg?.style === 'function' ? labelCfg.style(datum, idx) : labelCfg?.style?.fontSize ?? 14;
        [, [x, y]] = getArcTickPoints(center, radius, tickAngle, orient, tickOffset + labelSize);
      } else {
        angle += 90;
      }
    } else {
      // normal align.
      angle = rotate ?? 0;
      textAlign = getTextAnchor(sideVector);
      textBaseline = getTextBaseline(sideVector);
    }

    return {
      id: `label-${datum.id}`,
      x,
      y,
      text,
      textAlign,
      textBaseline,
      transform: `rotate(${(angle || 0).toFixed(0)}deg)`,
      data: datum,
    };
  });
}

function getAxisLinePath(center: Vector2 = [0, 0], radius = 0, startAngle = 0, endAngle = 0): string {
  const [cx, cy] = center;
  const [rx, ry] = [radius, radius];
  const [x1, y1] = [cx + radius * cos(startAngle), cy + radius * sin(startAngle)];
  const [x2, y2] = [cx + radius * cos(endAngle), cy + radius * sin(endAngle)];

  let path = '';

  const diffAngle = abs(endAngle - startAngle);
  if (diffAngle === PI2) {
    // 绘制两个半圆
    path = `M${cx},${cy - ry}, A${rx},${ry},0,1,1,${cx},${cy + ry}, A${rx},${ry},0,1,1,${cx},${cy - ry}`;
  } else {
    // 大小弧
    const large = diffAngle > PI ? 1 : 0;
    // 1-顺时针 0-逆时针
    const sweep = startAngle > endAngle ? 0 : 1;
    path = `M${cx},${cy},L${x1},${y1},A${rx},${ry},0,${large},${sweep},${x2},${y2},L${cx},${cy}`;
  }

  return path;
}

export const Arc = createComponent<ArcAxisStyleProps>(
  {
    render(attributes, container) {
      const {
        startAngle = 0,
        endAngle = 0,
        center,
        radius,
        axisLine,
        tickLine,
        subTickLine,
        label = {},
        ticks = [],
        title,
        grid,
        ticksThreshold,
        appendTick,
        verticalFactor,
      } = attributes;
      const optimizedTicks = calcOptimizedTicks(ticks, ticksThreshold, appendTick);
      const axisPosition = verticalFactor === -1 ? 'inside' : 'outside';

      renderGrid(container, grid);

      const axisLineGroup = maybeAppend(container, '.axis-line-group', 'g').attr('className', 'axis-line-group').node();
      const axisLinePath = getAxisLinePath(center, radius, (startAngle / 180) * Math.PI, (endAngle / 180) * Math.PI);
      // todo Calculate endPoints of arc axis.
      renderAxisLine(axisLineGroup, axisLinePath, undefined, axisLine);

      const axisTickGroup = maybeAppend(container, '.axis-tick-group', 'g').attr('className', 'axis-tick-group').node();
      const tickItems = getTickLines(optimizedTicks, startAngle, endAngle, radius, center, axisPosition, tickLine?.len);

      // todo Enable hide last one tick.
      renderTicks(axisTickGroup, tickItems, tickLine);

      const SUBTICK_GROUP = 'axis-subtick-group';
      const subTickGroup = maybeAppend(container, `.${SUBTICK_GROUP}`, 'g').attr('className', SUBTICK_GROUP).node();
      const subTickItems = getSubTickLines(
        optimizedTicks,
        startAngle,
        endAngle,
        radius,
        center,
        axisPosition,
        subTickLine?.count,
        subTickLine?.len
      );
      renderTicks(subTickGroup, subTickItems, subTickLine, 'sub');

      const LABEL_GROUP = 'axis-label-group';
      const labelGroup = maybeAppend(container, `.${LABEL_GROUP}`, 'g').attr('className', LABEL_GROUP).node();
      const labelsCfg = getLabelAttrs(
        optimizedTicks,
        startAngle,
        endAngle,
        radius,
        center,
        axisPosition,
        label,
        tickLine?.len
      );
      renderAxisLabels(labelGroup, labelsCfg, label);

      // Process overlap.
      const labels = labelGroup.querySelectorAll('.axis-label');
      const tickLines = labelGroup.querySelectorAll('.axis-tick');
      processOverlap(label, axisPosition)(labels);
      autoHideTickLine(labels, tickLines, label?.autoHideTickLine);

      renderTitle(container, center[0], center[1], 'center', 'middle', title);
    },
  },
  DEFAULT_ARC_STYLE
);
