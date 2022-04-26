import { deepMix } from '@antv/util';
import { vec2 } from '@antv/matrix-util';
import type { PathCommand } from '@antv/g';
import type { ArcCfg, ArcOptions, AxisLabelCfg, Point, Position } from './types';
import { AxisBase } from './base';
import { getVerticalVector, getVectorsAngle } from './utils';
import { ARC_DEFAULT_OPTIONS } from './constant';
import { toPrecision } from '../../util';

const { PI, abs, cos, sin } = Math;
const [PI2] = [PI * 2];

export class Arc extends AxisBase<ArcCfg> {
  public static tag = 'arc';

  protected static defaultOptions = {
    type: Arc.tag,
    ...ARC_DEFAULT_OPTIONS,
  };

  constructor(options: ArcOptions) {
    super(deepMix({}, Arc.defaultOptions, options));
    super.init();
  }

  protected getAxisLinePath() {
    const {
      radius: rx,
      center: [cx, cy],
    } = this.attributes;
    const { startPos, endPos } = this.getTerminals();
    const { startAngle, endAngle } = this.getAngles();
    const diffAngle = abs(endAngle - startAngle);
    const ry = rx;
    if (diffAngle === PI2) {
      // 绘制两个半圆
      return [
        ['M', cx, cy - ry],
        ['A', rx, ry, 0, 1, 1, cx, cy + ry],
        ['A', rx, ry, 0, 1, 1, cx, cy - ry],
        ['Z'],
      ] as PathCommand[];
    }

    // 大小弧
    const large = diffAngle > PI ? 1 : 0;
    // 1-顺时针 0-逆时针
    const sweep = startAngle > endAngle ? 0 : 1;
    return [['M', cx, cy], ['L', ...startPos], ['A', rx, ry, 0, large, sweep, ...endPos], ['Z']] as PathCommand[];
  }

  protected getTangentVector(value: number) {
    const { verticalFactor } = this.attributes;
    const verVec = this.getVerticalVector(value);
    return vec2.normalize([0, 0], getVerticalVector(verVec, verticalFactor));
  }

  protected getVerticalVector(value: number) {
    const {
      center: [cx, cy],
    } = this.attributes;
    const [x, y] = this.getValuePoint(value);
    const [v1, v2] = vec2.normalize([0, 0], [x - cx, y - cy]);
    const { verticalFactor } = this.attributes;
    return vec2.scale([0, 0], [v1, v2], verticalFactor);
  }

  protected getValuePoint(value: number) {
    const {
      center: [cx, cy],
      radius,
    } = this.attributes;
    const { startAngle, endAngle } = this.getAngles();
    const angle = (endAngle - startAngle) * value + startAngle;
    const rx = radius * cos(angle);
    const ry = radius * sin(angle);
    return [cx + rx, cy + ry] as Point;
  }

  protected getTerminals() {
    const {
      center: [cx, cy],
      radius,
    } = this.attributes;
    const { startAngle, endAngle } = this.getAngles();
    const startPos = [cx + radius * cos(startAngle), cy + radius * sin(startAngle)] as Point;
    const endPos = [cx + radius * cos(endAngle), cy + radius * sin(endAngle)] as Point;
    return { startPos, endPos };
  }

  protected getLabelLayout(labelVal: number, tickAngle: number, angle: number) {
    // 精度
    const approxTickAngle = toPrecision(tickAngle, 0);
    const { label } = this.attributes;
    const { align } = label as AxisLabelCfg;
    let rotate = angle;
    let textAlign = 'center' as Position;
    if (align === 'tangential') {
      rotate = getVectorsAngle([1, 0], this.getTangentVector(labelVal)) % 180;
    } else {
      // 非径向垂直于刻度的情况下（水平、径向），调整锚点

      const absAngle = Math.abs(approxTickAngle);
      if (absAngle < 90) textAlign = 'start';
      else if (absAngle > 90) textAlign = 'end';

      if (angle !== 0 || [90].includes(approxTickAngle)) {
        const sign = angle > 0 ? 0 : 1;
        if (absAngle < 90) {
          textAlign = ['end', 'start'][sign] as Position;
        } else if (absAngle > 90) {
          textAlign = ['start', 'end'][sign] as Position;
        }
      }

      // 超过旋转超过 90 度时，文本会倒置，这里将其正置
      if (align === 'radial') {
        rotate = approxTickAngle;
        if (Math.abs(rotate) > 90) rotate -= 180;
      }
    }
    return {
      rotate,
      textAlign,
    };
  }

  /**
   * 获得弧度数值
   */
  private getAngles() {
    const { startAngle, endAngle } = this.attributes;
    // 判断角度还是弧度
    if (abs(startAngle) < PI2 && abs(endAngle) < PI2) {
      // 弧度
      return { startAngle, endAngle };
    }
    // 角度

    return {
      startAngle: (startAngle * PI) / 180,
      endAngle: (endAngle * PI) / 180,
    };
  }
}
