import { vec2 } from '@antv/matrix-util';
import type { DisplayObjectConfig, TextStyleProps } from '@antv/g';
import type { ArcAxisStyleProps, Point } from './types';
import { AXIS_BASE_DEFAULT_OPTIONS } from './constant';
import { deepAssign, getEllipsisText, getMemoFont, DegToRad, defined, maybeAppend, applyStyle } from '../../util';
import { AxisBase } from './base';
import { getAxisTicks } from './axisTick';
import { getAxisSubTicks } from './axisSubTick';
import { getAxisLabels } from './arcAxisLabel';

const { PI, abs, cos, sin } = Math;
const [PI2] = [PI * 2];

type ArcOptions = DisplayObjectConfig<ArcAxisStyleProps>;
export { ArcOptions };

export class Arc extends AxisBase<ArcAxisStyleProps> {
  public static tag = 'arc';

  protected static defaultOptions = {
    type: Arc.tag,
    style: {
      startAngle: -90,
      endAngle: 270,
      center: [0, 0],
      label: {
        tickPadding: 2,
        style: {},
        align: 'normal',
      },
      ...AXIS_BASE_DEFAULT_OPTIONS.style,
    },
  };

  protected get axisPosition() {
    return this.style.verticalFactor === -1 ? 'inside' : 'outside';
  }

  constructor(options: ArcOptions) {
    super(deepAssign({}, Arc.defaultOptions, options));
  }

  public update(cfg: Partial<ArcAxisStyleProps> = {}) {
    super.update(deepAssign({}, Arc.defaultOptions.style, this.attributes, cfg));
  }

  protected getLinePath() {
    const { radius, center = [0, 0], axisLine: axisLineCfg } = this.style;

    const { startAngle, endAngle } = this.getRadians();
    const endPoints = this.getEndPoints();
    const style = axisLineCfg?.style || {};
    const [[x1, y1], [x2, y2]] = endPoints;
    const [cx, cy] = center;
    const diffAngle = abs(endAngle - startAngle);
    const [rx, ry] = [radius ?? 0, radius ?? 0];
    let path: any[] = [];
    if (diffAngle === PI2) {
      // 绘制两个半圆
      path = [
        ['M', cx, cy - ry],
        ['A', rx, ry, 0, 1, 1, cx, cy + ry],
        ['A', rx, ry, 0, 1, 1, cx, cy - ry],
      ];
    } else {
      // 大小弧
      const large = diffAngle > PI ? 1 : 0;
      // 1-顺时针 0-逆时针
      const sweep = startAngle > endAngle ? 0 : 1;
      path = [
        ['M', cx, cy],
        ['L', x1, y1],
        ['A', rx, ry, 0, large, sweep, x2, y2],
        ['L', cx, cy],
      ];
    }

    return {
      ...style,
      visibility: (axisLineCfg ? 'visible' : 'hidden') as any,
      animate: axisLineCfg?.animate,
      path,
    };
  }

  protected getLineArrow() {
    return [];
  }

  protected drawTitle() {
    const { title: titleCfg } = this.style;

    const titleShape = maybeAppend(this, '.axis-title', 'text').attr('className', 'axis-title');
    if (!titleCfg) {
      titleShape.style('fontSize', 0);
      return;
    }
    // Now only support arc axis title display in the center.
    const [x, y] = this.style.center;
    const titleStyle = titleCfg.style || {};
    const content = titleCfg.content || '';
    const attrs: TextStyleProps = {
      x,
      y,
      text: content,
      ...titleStyle,
      textAlign: titleStyle.textAlign || ('center' as any),
      textBaseline: titleStyle.textBaseline || ('middle' as any),
    };
    const font = getMemoFont(this.selection.node(), attrs);
    const text = defined(titleCfg.maxLength) ? getEllipsisText(content, titleCfg.maxLength!, font) : content;
    titleShape.call(applyStyle, { id: 'axis-title', ...attrs, tip: content, text });
  }

  protected getTickLineItems() {
    const { tickLine: tickCfg, center, radius, startAngle, endAngle } = this.style;
    return tickCfg
      ? getAxisTicks({
          ...tickCfg,
          ticks: this.optimizedTicks,
          orient: this.axisPosition as any,
          endPoints: this.getEndPoints(),
          center,
          radius,
          startAngle,
          endAngle,
          axisType: 'arc',
        })
      : [];
  }

  protected getSubTickLineItems() {
    const { subTickLine: subTickCfg, center, radius, startAngle, endAngle } = this.style;
    return subTickCfg
      ? getAxisSubTicks({
          ...subTickCfg,
          ticks: this.optimizedTicks,
          orient: this.axisPosition as any,
          endPoints: this.getEndPoints(),
          center,
          radius,
          startAngle,
          endAngle,
          axisType: 'arc',
        })
      : [];
  }

  protected getLabelAttrs() {
    const {
      radius,
      center = [0, 0],
      label: labelCfg,
      tickLine: tickLineCfg,
      startAngle = 0,
      endAngle = 0,
    } = this.style;

    return labelCfg
      ? getAxisLabels(this.selection, {
          ...labelCfg,
          startAngle,
          endAngle,
          radius: radius ?? 0,
          center,
          tickLength: tickLineCfg?.len,
          ticks: this.optimizedTicks,
          orient: this.axisPosition as any,
        })
      : [];
  }

  protected getVerticalVector(value: number) {
    const { verticalFactor = 1, center } = this.style;
    const [cx, cy] = center;
    const [x, y] = this.getValuePoint(value);
    const [v1, v2] = vec2.normalize([0, 0], [x - cx, y - cy]);
    return vec2.scale([0, 0], [v1, v2], verticalFactor);
  }

  protected getValuePoint(value: number) {
    const { center, radius } = this.attributes;
    const [cx, cy] = center;
    const { startAngle, endAngle } = this.getRadians();
    const angle = (endAngle - startAngle) * value + startAngle;
    const rx = radius * cos(angle);
    const ry = radius * sin(angle);
    return [cx + rx, cy + ry] as Point;
  }

  protected getEndPoints() {
    const { center, radius } = this.style;
    const [cx, cy] = center;
    const { startAngle, endAngle } = this.getRadians();
    const startPos = [cx + radius * cos(startAngle), cy + radius * sin(startAngle)] as Point;
    const endPos = [cx + radius * cos(endAngle), cy + radius * sin(endAngle)] as Point;
    return [startPos, endPos];
  }

  /**
   * 获得弧度数值
   */
  private getRadians() {
    const { startAngle = 0, endAngle = 0 } = this.style;
    // 判断角度还是弧度
    if (abs(startAngle) < PI2 && abs(endAngle) < PI2) {
      // 弧度
      return { startAngle, endAngle };
    }
    // 角度 [todo]

    return {
      startAngle: startAngle * DegToRad,
      endAngle: endAngle * DegToRad,
    };
  }
}
