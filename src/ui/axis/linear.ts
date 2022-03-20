import { deepMix, get } from '@antv/util';
import { vec2 } from '@antv/matrix-util';
import type { PathCommand } from '@antv/g';
import type { LinearCfg, LinearOptions, Point, Position } from './types';
import { AxisBase } from './base';
import { getVerticalVector } from './utils';
import { LINEAR_DEFAULT_OPTIONS } from './constant';

export class Linear extends AxisBase<LinearCfg> {
  public static tag = 'linear';

  protected static defaultOptions = {
    type: Linear.tag,
    ...LINEAR_DEFAULT_OPTIONS,
  };

  constructor(options: LinearOptions) {
    super(deepMix({}, Linear.defaultOptions, options));
    super.init();
  }

  protected getAxisLinePath() {
    const {
      startPos: [x1, y1],
      endPos: [x2, y2],
    } = this.getTerminals();
    return [['M', x1, y1], ['L', x2, y2], ['Z']] as PathCommand[];
  }

  protected getTangentVector() {
    const {
      startPos: [x1, y1],
      endPos: [x2, y2],
    } = this.getTerminals();
    return vec2.normalize([0, 0], [x2 - x1, y2 - y1]);
  }

  protected getVerticalVector(value: number) {
    const { verticalFactor } = this.attributes;
    const axisVector = this.getTangentVector();
    return vec2.scale([0, 0], getVerticalVector(axisVector), verticalFactor);
  }

  protected getValuePoint(value: number) {
    const {
      startPos: [x1, y1],
      endPos: [x2, y2],
    } = this.getTerminals();
    // const ticks = this.getTicks();
    // const range = ticks[ticks.length - 1].value - ticks[0].value;
    // range 设定为0-1
    const range = 1;
    const ratio = value / range;
    return [ratio * (x2 - x1) + x1, ratio * (y2 - y1) + y1] as Point;
  }

  protected getTerminals() {
    const { startPos, endPos } = this.attributes;
    return { startPos, endPos };
  }

  protected getLabelLayout(labelVal: number, tickAngle: number, angle: number) {
    const { verticalFactor, label } = this.attributes;
    // 如果 label.style.default 定义了 textAlign，则使用用户定义的
    const precision = 1;
    const sign = verticalFactor === 1 ? 0 : 1;
    let rotate = angle;
    let textAlign = 'center' as Position;
    if (angle > 90) rotate = (rotate - 180) % 360;
    else if (angle < -90) rotate = (rotate + 180) % 360;
    // 由于精度问题, 取 -precision precision
    if (rotate < -precision) textAlign = ['end', 'start'][sign] as Position;
    else if (rotate > precision) textAlign = ['start', 'end'][sign] as Position;
    return {
      rotate,
      textAlign: get(label, ['style', 'default', 'textAlign']) ?? textAlign,
    };
  }
}
