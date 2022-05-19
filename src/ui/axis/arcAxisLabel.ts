import { isNumberEqual } from '@antv/util';
import {
  defined,
  multi,
  parseLength,
  Selection,
  getEllipsisText,
  getMemoFont,
  TEXT_INHERITABLE_PROPS,
} from '../../util';
import { getArcTickPoints } from './axisTick';
import { getSign, ifOutside } from './utils';
import type { AxisLabelCfg, Point, TickDatum } from './types';

type AxisLabelOptions = AxisLabelCfg & {
  /** Orient of axis */
  orient: 'inside' | 'outside';
  /** Ticks value. */
  ticks: TickDatum[];
  center: Point;
  radius: number;
  startAngle: number;
  endAngle: number;
  /** 限制范围 */
  bounds?: any;
  tickLength?: number;
};

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

export function getAxisLabels(selection: Selection, options: AxisLabelOptions) {
  const { orient, ticks = [], center, radius, startAngle, endAngle, tickLength = 0, maxLength, style } = options;
  const sign = getSign(orient, -1, 1);
  const { tickPadding = 0, formatter, align, rotate } = options;
  return Array.from(ticks).map((datum, idx) => {
    const tickAngle = (endAngle - startAngle) * datum.value + startAngle;
    const formatAngle = (a: number) => (a >= 270 ? (a - 360) % 360 : a);
    let angle = formatAngle(tickAngle);

    const [, [x, y]] = getArcTickPoints(center, radius, tickAngle, orient, tickLength + tickPadding);
    const text = formatter ? formatter(datum, idx) : datum.text;

    const labelStyle = typeof style === 'function' ? style.call(null, datum, idx) : style;
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
      angle = 90 + angle;
      textAlign = 'center';
      textBaseline = ifOutside(orient, 'bottom', 'top');
    } else {
      // normal align.
      angle = rotate ?? 0;
      textAlign = getTextAnchor(sideVector);
      textBaseline = getTextBaseline(sideVector);
    }

    const font = getMemoFont(selection.node(), { ...labelStyle, text: text || '' });
    const limitLength = parseLength(maxLength!, font);

    return {
      ...TEXT_INHERITABLE_PROPS,
      id: `label-${datum.id}`,
      orient,
      limitLength,
      // TextStyleProps
      visibility: 'visible' as any,
      x,
      y,
      tip: text,
      text: text && defined(limitLength) ? getEllipsisText(text, limitLength!, font, '...') : text || '',
      textAlign,
      textBaseline,
      transform: `rotate(${(angle || 0).toFixed(0)}deg)`,
      ...labelStyle,
    };
  });
}
