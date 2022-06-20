import { vec2 } from '@antv/matrix-util';
import { DisplayObjectConfig, ElementEvent, Text } from '@antv/g';
import {
  deepAssign,
  defined,
  getEllipsisText,
  ifNegative,
  ifPositive,
  mid,
  multi,
  parseLength,
  getMemoFont,
  TEXT_INHERITABLE_PROPS,
  getFont,
  maybeAppend,
  applyStyle,
} from '../../util';
import { Marker } from '../marker';
import { AxisBase } from './base';
import { getAxisTitleStyle } from './axisTitle';
import { getAxisTicks, getTickPoints } from './axisTick';
import { getAxisSubTicks } from './axisSubTick';
import { getSign, getVerticalVector, ifLeft, ifRight, ifTop, ifX, ifY } from './utils';
import type { LinearAxisStyleProps, Point } from './types';
import { AXIS_BASE_DEFAULT_OPTIONS } from './constant';

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

export function getTickEndPoints(startPoint: Point, length: number, verticalVector: any = [0, 0]): [Point, Point] {
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
export class Linear extends AxisBase<LinearAxisStyleProps> {
  public static tag = 'cartesian';

  protected static defaultOptions = {
    type: Linear.tag,
    style: {
      startPos: [0, 0],
      endPos: [0, 0],
      ...AXIS_BASE_DEFAULT_OPTIONS.style,
    },
  };

  protected get axisPosition() {
    const axesVector = this.getAxesVector();
    return inferAxisPosition(axesVector, this.style.verticalFactor || 1);
  }

  constructor(options: LinearOptions) {
    super(deepAssign({}, Linear.defaultOptions, options));
  }

  connectedCallback() {
    super.connectedCallback();
    this.bindEvents();
  }

  public update(cfg: Partial<LinearAxisStyleProps> = {}) {
    super.update(deepAssign({}, Linear.defaultOptions.style, this.attributes, cfg));
  }

  protected getEndPoints() {
    const { startPos, endPos } = this.style;
    return [startPos || [0, 0], endPos || [0, 0]];
  }

  private getTitleBounds() {
    let [[x0, y0], [x1, y1]] = this.getEndPoints();
    if (x0 > x1) [x1, x0] = [x0, x1];
    if (y0 > y1) [y1, y0] = [y0, y1];
    const min = [x0, y0];
    const max = [x1, y1];
    let bounds = { min, max };
    if (this.axisLabelGroup) {
      bounds = this.axisLabelGroup.getLocalBounds() as any;
    }
    const { positionX, positionY } = this.style.title || {};
    if (typeof positionX === 'number') {
      bounds.min[0] = positionX + min[0];
      bounds.max[0] = positionX + min[0];
    }
    if (typeof positionY === 'number') {
      bounds.min[1] = positionY + min[1];
      bounds.max[1] = positionY + min[1];
    }

    return bounds as any;
  }

  protected drawTitle() {
    const { title: titleCfg } = this.style;

    const bounds = this.getTitleBounds();
    const titleStyle = titleCfg ? getAxisTitleStyle(titleCfg, bounds, this.axisPosition) : { fontSize: 0 };
    const titleShape = maybeAppend(this, '.axis-title', 'text')
      .attr('className', 'axis-title')
      .call(applyStyle, titleStyle)
      .node() as Text;
    if (titleShape && titleCfg?.maxLength) {
      const text = getEllipsisText(titleShape.style.text, titleCfg.maxLength, getFont(titleShape));
      titleShape.style.text = text;
    }
  }

  protected getLinePath() {
    const { axisLine: axisLineCfg } = this.style;

    const [[x1, y1], [x2, y2]] = this.getEndPoints();
    const style = axisLineCfg?.style;
    return {
      ...style,
      visibility: (axisLineCfg ? 'visible' : 'hidden') as any,
      animate: axisLineCfg?.animate,
      path: [
        ['M', x1, y1],
        ['L', x2, y2],
      ] as any,
    };
  }

  protected getLineArrow() {
    const { axisLine: axisLineCfg } = this.style;
    const { start, end } = axisLineCfg?.arrow || {};

    const [[x1, y1], [x2, y2]] = this.getEndPoints();

    const arrows = [];
    const lineStyle = axisLineCfg?.style || {};
    const defaultArrow = { symbol: 'axis-arrow', size: 10, fill: 'grey', stroke: 'grey', lineWidth: 1, ...lineStyle };
    if (start) {
      const angle = ifX(this.axisPosition, -90, -45);
      const [[startX, startY]] = [[Math.min(x1, x2), Math.min(y1, y2)]];
      arrows.push({
        id: 'start-arrow',
        ...defaultArrow,
        transformOrigin: 'left',
        transform: `rotate(${angle}deg)`,
        x: startX,
        y: startY,
        ...start,
      });
    }
    if (end) {
      const angle = ifX(this.axisPosition, 0, 45);
      const [[endX, endY]] = [[Math.max(x1, x2), Math.max(y1, y2)]];
      arrows.push({
        id: 'end-arrow',
        ...defaultArrow,
        transformOrigin: 'left',
        transform: `rotate(${angle}deg)`,
        x: endX,
        y: endY,
        ...end,
      });
    }

    return arrows;
  }

  protected getTickLineItems() {
    const { tickLine: tickCfg } = this.style;
    return tickCfg
      ? getAxisTicks({
          ...tickCfg,
          ticks: this.optimizedTicks,
          orient: this.axisPosition as any,
          endPoints: this.getEndPoints(),
          axisType: 'linear',
        })
      : [];
  }

  protected getSubTickLineItems() {
    const { subTickLine: subTickCfg } = this.style;
    return subTickCfg
      ? getAxisSubTicks({
          ...subTickCfg,
          ticks: this.optimizedTicks,
          orient: this.axisPosition as any,
          endPoints: this.getEndPoints(),
          axisType: 'linear',
        })
      : [];
  }

  protected getLabelAttrs() {
    const { label: labelCfg, tickLine: tickLineCfg } = this.style;

    if (!labelCfg) return [];

    const tickLength = tickLineCfg?.len || 0;
    const ticks = this.optimizedTicks || [];
    const orient: any = this.axisPosition;
    const { formatter, tickPadding = 0, offset = 0, alignTick = true, rotate = 0, maxLength, style = {} } = labelCfg;

    const sign = getSign(orient, -1, 1);
    const data = Array.from(ticks).map((datum, idx) => {
      let value = datum.value;
      if (!alignTick) {
        value = mid((ticks[idx + 1]?.value || value) + value);
      }
      const [, [x, y]] = getTickPoints(this.getEndPoints(), value, orient, tickLength + tickPadding);
      const text = formatter ? formatter(datum, idx) : datum.text;
      const labelStyle = typeof style === 'function' ? style.call(null, datum, idx) : style;
      let textAlign: any = ifX(orient, 'center', ifLeft(orient, 'end', 'start'));
      if (rotate) {
        textAlign = ifLeft(
          orient,
          'end',
          ifRight(orient, 'start', ifPositive(multi(sign, rotate), 'left', ifNegative(multi(sign, rotate), 'right')))
        );
      }

      const font = getMemoFont(this.selection.node(), { ...labelStyle, text: text || '' });
      const limitLength = parseLength(maxLength!, font);

      return {
        ...TEXT_INHERITABLE_PROPS,
        id: `label-${datum.id}`,
        orient,
        // TextStyleProps
        visibility: 'visible',
        x: x + ifX(orient, offset, 0)!,
        y: y + ifY(orient, offset, 0)!,
        tip: text,
        text: defined(limitLength) ? getEllipsisText(text, limitLength!, font, '...') : text,
        textAlign,
        textBaseline: ifY(orient, 'middle', ifTop(orient, 'bottom', 'top')),
        transform: `rotate(${rotate || 0}deg)`,
        ...labelStyle,
      };
    });

    return data as any[];
  }

  /** --------- Common utils --------- */
  protected getAxesVector() {
    const [[x1, y1], [x2, y2]] = this.getEndPoints();
    return vec2.normalize([0, 0], [x2 - x1, y2 - y1]);
  }

  /**
   * 获取给定 value 在轴上刻度的向量
   */
  protected getVerticalVector(value?: number) {
    const { verticalFactor = 1 } = this.attributes;
    const axesVector = this.getAxesVector();
    return vec2.scale([0, 0], getVerticalVector(axesVector), verticalFactor);
  }

  private bindEvents() {
    this.addEventListener(ElementEvent.BOUNDS_CHANGED, (evt: any) => {
      if (evt.target.className === 'axis-label-group') this.drawTitle();
    });
  }
}
