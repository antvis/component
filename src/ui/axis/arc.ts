import { deepMix, get } from '@antv/util';
import { Path, CustomEvent } from '@antv/g';
import { vec2 } from '@antv/matrix-util';
import type { ArcAxisStyleProps, ArcOptions, Point } from './types';
import { getTickEndPoints } from './linear';
import { ARC_DEFAULT_OPTIONS, ORIGIN } from './constant';
import { deepAssign } from '../../util';
import { AxisBase } from './base';
import { AxisLabel } from './types/shape';
import { AutoHide } from './layouts/autoHide';

const { PI, abs, cos, sin } = Math;
const [PI2] = [PI * 2];

function getTickPoint(center: [number, number], radius: number, angle: number) {
  const [cx, cy] = center;
  const rx = radius * cos((angle / 180) * PI);
  const ry = radius * sin((angle / 180) * PI);
  return [cx + rx, cy + ry] as Point;
}

function inferLabelAttrs(tickAngle: number, align: 'normal' | 'tangential' | 'radial', verticalFactor: 1 | -1) {
  const angle = tickAngle > 270 ? (tickAngle - 360) % 360 : tickAngle;
  const attrs: any = { angle: 0 };

  if (verticalFactor === -1) {
    if (align === 'tangential') {
      attrs.textAlign = 'center';
      attrs.textBaseline = 'top';
      // Do not use `transform.rotate`, instead of `setEulerAngles`, which enable to be access by `getEulerAngles`.
      attrs.angle = 90 + angle;
    } else if (align === 'radial') {
      attrs.angle = angle;
      attrs.textAlign = 'end';
      // 增加一个阀值处理
      if (angle > 90 || angle < -80) {
        attrs.angle = angle + 180;
        attrs.textAlign = 'start';
      }
      attrs.textBaseline = 'middle';
    } else {
      // [todo] label align and baseline should be adjust in normal align.
      attrs.textAlign = 'center';
      if (angle > 90 && angle < 240) attrs.textAlign = 'start';
      if (angle > -60 && angle < 90) attrs.textAlign = 'end';

      if (angle > -45 && angle <= 45) attrs.textBaseline = 'middle';
      if (angle > 45 && angle < 135) attrs.textBaseline = 'bottom';
      if (angle > 135 && angle <= 225) attrs.textBaseline = 'middle';
      if (angle <= -45 || angle > 225) attrs.textBaseline = 'top';
    }
  } else if (align === 'tangential') {
    attrs.textAlign = 'center';
    attrs.textBaseline = 'bottom';
    attrs.angle = 90 + angle;
  } else if (align === 'radial') {
    attrs.angle = angle;
    // 增加一个阀值处理
    attrs.textAlign = 'start';
    if (angle > 90 || angle < -80) {
      attrs.textAlign = 'end';
      attrs.angle = angle + 180;
    }
    attrs.textBaseline = 'middle';
  } else {
    // [todo] label align and baseline should be adjust in normal align.
    attrs.textAlign = 'center';
    if (angle > 90 && angle < 250) attrs.textAlign = 'end';
    if (angle > -60 && angle < 45) attrs.textAlign = 'start';

    if (angle > -45 && angle <= 45) attrs.textBaseline = 'middle';
    if (angle > 45 && angle < 135) attrs.textBaseline = 'top';
    if (angle > 135 && angle <= 225) attrs.textBaseline = 'middle';
  }
  attrs.transform = `rotate(${attrs.angle || 0})`;
  return attrs;
}

export class Arc extends AxisBase<ArcAxisStyleProps> {
  public static tag = 'arc';

  protected static defaultOptions = {
    type: Arc.tag,
    ...ARC_DEFAULT_OPTIONS,
  };

  protected getLabelRotation(label?: any) {
    return 0;
  }

  constructor(options: ArcOptions) {
    // should not use this.style, because `style` is a Proxy object, not a Plain Object.
    // should not use `deepMix`, because `undefined` should be assign, not to be ignore.
    super(deepAssign({}, Arc.defaultOptions, options));
    this.init();
  }

  public update(cfg: Partial<ArcAxisStyleProps> = {}) {
    super.update(deepAssign({}, this.attributes, cfg));
  }

  protected updateAxisLine() {
    const { radius, center = [0, 0] } = this.style;
    const [cx, cy] = center;
    const [startPos, endPos] = this.getEndPoints();
    const { startAngle, endAngle } = this.getAngles();
    const diffAngle = abs(endAngle - startAngle);
    const [rx, ry] = [radius ?? 0, radius ?? 0];
    let path: any[] = [];
    if (diffAngle === PI2) {
      // 绘制两个半圆
      path = [['M', cx, cy - ry], ['A', rx, ry, 0, 1, 1, cx, cy + ry], ['A', rx, ry, 0, 1, 1, cx, cy - ry], ['Z']];
    } else {
      // 大小弧
      const large = diffAngle > PI ? 1 : 0;
      // 1-顺时针 0-逆时针
      const sweep = startAngle > endAngle ? 0 : 1;
      path = [['M', cx, cy], ['L', ...startPos], ['A', rx, ry, 0, large, sweep, ...endPos], ['Z']];
    }

    // todo `querySelector` has bug now, use `querySelectorAll` temporary
    let axisLinePath = this.selection.select('.axis-line').node() as Path;
    if (!axisLinePath) {
      axisLinePath = this.axisGroup.appendChild(new Path({ className: 'axis-line' }));
    }
    axisLinePath.style.path = path;
    axisLinePath.hide();

    const { axisLine } = this.style;
    if (!axisLine) return;

    axisLinePath.attr(axisLine.style || {});
    // [todo] Whether to support arc axis arrow.
    // this.updateAxisArrow(axisLine);
    axisLinePath.show();
  }

  protected updateAxisTitle() {
    // [todo] Whether to support arc axis title.
  }

  protected getTicksCfg() {
    const {
      tickLine,
      label: labelCfg,
      subTickLine,
      ticks = [],
      center,
      startAngle = 0,
      endAngle = 0,
      radius,
      verticalFactor = 1,
    } = this.style;

    // Generate id for tickLine and label, use same id
    const id = (d: any, idx: number) => (d.id ? `${d.id}-${idx}` : `${d.text || ''}-${idx}`);

    const tickAngle = (d: any, idx: number) => (endAngle - startAngle) * d.value + startAngle;

    const verticalVector = (d: number) => this.getVerticalVector(d);
    const { len: tickLength = 0 } = tickLine!;

    function tickLineStyle(d: any, idx: number, tickPoint: Point, tickAngle: number) {
      const [[x1, y1], [x2, y2]] = getTickEndPoints(tickPoint, tickLength, verticalVector(d.value));
      return {
        ...d,
        ...get(tickLine, 'style', {}),
        id: id(d, idx),
        path: [
          ['M', x1, y1],
          ['L', x2, y2],
        ],
        [ORIGIN]: d,
      };
    }
    const tickLines: any[] = [];
    const labels: AxisLabel[] = [];
    const subTickLines: any[] = [];

    function labelStyle(d: any, idx: number, tickPoint: Point, tickAngle: number) {
      const { tickPadding = 0, offset = 0, formatter = (d) => d.text, align } = labelCfg!;
      const [, [x2, y2]] = getTickEndPoints(tickPoint, tickLength + tickPadding, verticalVector(d.value));
      const inferStyle = inferLabelAttrs(tickAngle, align || 'normal', verticalFactor);
      // Make user could know the rotation angle of label.
      const userStyle =
        typeof labelCfg?.style === 'function'
          ? labelCfg.style.call(null, { ...d, angle: inferStyle.angle }, idx)
          : labelCfg?.style;
      return {
        ...d,
        // should not use `deepAssign`, because `undefined` will be assign
        ...deepMix({}, inferStyle, userStyle || {}),
        text: formatter ? formatter(d) : d.text,
        id: id(d, idx),
        x: x2,
        y: y2,
        [ORIGIN]: d,
      };
    }

    const subTickCount = subTickLine?.count ? subTickLine.count : 0;
    const subTickLength = subTickLine?.len ? subTickLine.len : 0;

    function subTickStyle(d: any, idx: number, step: number) {
      return new Array(subTickCount).fill(null).map((_, subTickIdx) => {
        const angle = tickAngle({ ...d, value: d.value + step * (subTickIdx + 1) }, idx);
        const tickPoint = getTickPoint(center, radius, angle);
        const [[x1, y1], [x2, y2]] = getTickEndPoints(tickPoint, subTickLength, verticalVector(d.value));
        return {
          path: [
            ['M', x1, y1],
            ['L', x2, y2],
          ],
          id: `${id(d, idx)}-${subTickIdx}`,
          ...get(subTickLine, 'style'),
        };
      });
    }

    ticks.forEach((d, idx) => {
      const angle = tickAngle(d, idx);
      const tickPoint = getTickPoint(center, radius, angle);
      tickLines.push(tickLineStyle(d, idx, tickPoint, angle));
      labels.push(labelStyle(d, idx, tickPoint, angle));

      if (subTickCount > 0 && idx < ticks.length - 1) {
        const step = (ticks[idx + 1].value - ticks[idx].value) / (subTickCount + 1);
        subTickLines.push(...subTickStyle(d, idx, step));
      }
    });
    return { tickLines, labels, subTickLines };
  }

  protected layoutLabels(labels: AxisLabel[]) {
    const { label: labelCfg } = this.style;
    if (!labelCfg) return;

    // Do labels layout.
    const { overlapOrder = [] } = labelCfg;
    // const rotation = this.getLabelRotation();
    // [todo] whether enable set `rotation` in Arc axis.
    // if (typeof rotation === 'number') this.labels.forEach((label) => rotateLabel(label, rotation));

    const autoLayout = new Map<string, Function>([
      ['autoHide', this.autoHideLabel],
      ['autoEllipsis', this.autoEllipsisLabel],
      // [todo] whether enable `autoRotate` in Arc axis.
      // ['autoRotate', this.autoRotateLabel],
    ]);
    // Do layout after rendered
    overlapOrder.forEach((type: any) => {
      const layout = autoLayout.get(type) || (() => {});
      layout.call(this, labels);
    });
    window.requestAnimationFrame(() => {
      // dispatch layout end events
      this.dispatchEvent(new CustomEvent('axis-label-layout-end'));
    });
  }

  private autoHideLabel() {
    const { label: labelCfg } = this.style;
    // [todo] AutoHide label layout is not suitable to `radial` and `tangential` align label yet.
    if (!labelCfg?.autoHide || labelCfg?.align === 'radial' || labelCfg?.align === 'tangential') return;

    const { autoHide } = labelCfg;
    const method = (typeof autoHide === 'object' && autoHide.type) || 'greedy';

    AutoHide(this.labels as AxisLabel[], this.style.label!, method);
    this.autoHideTickLine();
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
    const { startAngle, endAngle } = this.getAngles();
    const angle = (endAngle - startAngle) * value + startAngle;
    const rx = radius * cos(angle);
    const ry = radius * sin(angle);
    return [cx + rx, cy + ry] as Point;
  }

  protected getEndPoints() {
    const { center, radius } = this.style;
    const [cx, cy] = center;
    const { startAngle, endAngle } = this.getAngles();
    const startPos = [cx + radius * cos(startAngle), cy + radius * sin(startAngle)] as Point;
    const endPos = [cx + radius * cos(endAngle), cy + radius * sin(endAngle)] as Point;
    return [startPos, endPos];
  }

  /**
   * 获得弧度数值
   */
  private getAngles() {
    const { startAngle = 0, endAngle = 0 } = this.style;
    // 判断角度还是弧度
    if (abs(startAngle) < PI2 && abs(endAngle) < PI2) {
      // 弧度
      return { startAngle, endAngle };
    }
    // 角度 [todo]

    return {
      startAngle: (startAngle * PI) / 180,
      endAngle: (endAngle * PI) / 180,
    };
  }
}
