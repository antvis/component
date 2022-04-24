import { Group, Path, Text, CustomEvent, Rect } from '@antv/g';
import { get, deepMix } from '@antv/util';
import { vec2 } from '@antv/matrix-util';
import { deepAssign, getEllipsisText, getFont } from '../../util';
import { Marker } from '../marker';
import { getVerticalVector } from './utils';
import { AutoHide, reset } from './layouts/autoHide';
import { AutoRotate, rotateLabel } from './layouts/autoRotate';
import { LINEAR_DEFAULT_OPTIONS, NULL_ARROW, ORIGIN } from './constant';
import type { AxisLabel, AxisTitle } from './types/shape';
import type { LinearOptions, LinearAxisStyleProps as CartesianStyleProps, AxisLineCfg, Point } from './types';
import { AxisBase } from './base';
import { applyBounds } from './utils/helper';

// 注册轴箭头
// ->
Marker.registerSymbol('axis-arrow', (x: number, y: number, r: number) => {
  return [
    ['M', x, y],
    ['L', x - r, y - r],
    ['L', x + r, y],
    ['L', x - r, y + r],
    ['L', x, y],
  ];
});

function minus(sp: Point, ep: Point) {
  return [Math.abs(sp[0] - ep[0]), Math.abs(sp[1] - ep[1])];
}

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

function inferLabelAttrs(startPoint: Point, endPoint: Point, position: string, offset = 0): any {
  const [dx, dy] = minus(startPoint, endPoint);

  if (position === 'left') {
    return {
      x: startPoint[0] - dx,
      y: startPoint[1] + offset,
      textBaseline: 'middle',
      textAlign: 'right',
      orient: 'left',
    };
  }
  if (position === 'top') {
    return {
      x: startPoint[0] + offset,
      y: startPoint[1] - dy,
      textBaseline: 'bottom',
      textAlign: 'center',
      orient: 'top',
    };
  }
  if (position === 'right') {
    return {
      x: startPoint[0] + dx,
      y: startPoint[1] + offset,
      textBaseline: 'middle',
      textAlign: 'left',
      orient: 'right',
    };
  }
  return {
    x: startPoint[0] + offset,
    y: startPoint[1] + dy,
    textBaseline: 'top',
    textAlign: 'center',
    orient: 'bottom',
  };
}

function formatAxisTitle(text: string, limit: number, font?: any) {
  if (typeof text !== 'string' || limit === Infinity) return text;
  return getEllipsisText(text, limit, font);
}

export class Cartesian extends AxisBase<CartesianStyleProps> {
  public static tag = 'cartesian';

  private get axisPosition() {
    const axesVector = this.getAxesVector();
    return inferAxisPosition(axesVector, this.style.verticalFactor || 1);
  }

  protected getLabelRotation() {
    return this.style.label?.rotation;
  }

  constructor(options: LinearOptions) {
    super(deepAssign({}, Cartesian.defaultOptions, options));
    this.init();
  }

  protected static defaultOptions = {
    type: Cartesian.tag,
    ...LINEAR_DEFAULT_OPTIONS,
  };

  public update(cfg: Partial<CartesianStyleProps> = {}) {
    super.update(deepAssign({}, this.attributes, cfg));
  }

  protected getEndPoints() {
    const { startPos, endPos } = this.style;
    return [startPos || [0, 0], endPos || [0, 0]];
  }

  protected updateAxisLine() {
    const [[x1, y1], [x2, y2]] = this.getEndPoints();
    const path: any = [
      ['M', x1, y1],
      ['L', x2, y2],
    ];
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
    this.updateAxisArrow(axisLine);
    axisLinePath.show();
  }

  private updateAxisArrow(axisLineCfg: AxisLineCfg) {
    const [[x1, y1], [x2, y2]] = this.getEndPoints();
    const [[startX, startY]] = [[Math.min(x1, x2), Math.min(y1, y2)]];
    const [[endX, endY]] = [[Math.max(x1, x2), Math.max(y1, y2)]];

    let { start, end } = axisLineCfg.arrow || {};
    const arrows = this.axisGroup.getElementsByName('axis-arrow') as Marker[];
    let startArrow = arrows.find((ele) => ele.id === 'start-arrow');
    let endArrow = arrows.find((ele) => ele.id === 'end-arrow');
    if (!startArrow) {
      startArrow = this.axisGroup.appendChild(new Marker({ name: 'axis-arrow', id: 'start-arrow' }));
      start = { ...NULL_ARROW, ...(start || {}) };
    }
    if (!endArrow) {
      endArrow = this.axisGroup.appendChild(new Marker({ name: 'axis-arrow', id: 'end-arrow' }));
      end = { ...NULL_ARROW, ...(end || {}) };
    }
    startArrow.update({ ...(start ?? { size: 0 }), x: startX, y: startY });
    endArrow.update({ ...(end ?? { size: 0 }), x: endX, y: endY });
    // [todo] should tell user the logic of `setLocalEulerAngles`.
    if (this.axisPosition === 'top' || this.axisPosition === 'bottom') {
      startArrow.setLocalEulerAngles(180);
      endArrow.setLocalEulerAngles(0);
    } else {
      startArrow.setLocalEulerAngles(-90);
      endArrow.setLocalEulerAngles(90);
    }
  }

  protected updateAxisTitle() {
    let axisTitle = this.selection.select('.axis-title').node() as AxisTitle;
    if (!axisTitle) {
      axisTitle = this.axisGroup.appendChild(new Text({ className: 'axis-title' })) as AxisTitle;
    }
    axisTitle.hide();

    if (!this.style.title) return;

    const { content = '', maxLength = Infinity, style = {} } = this.style.title!;
    axisTitle.attr(style);
    axisTitle.style.text = formatAxisTitle(content, maxLength, getFont(axisTitle));

    const [[spx, spy], [epx, epy]] = this.getEndPoints();
    const [startX] = [Math.min(spx, epx)];
    const [startY, endY] = [Math.min(spy, epy), Math.max(spy, epy)];
    let [offsetX, offsetY] = [0, 0];

    // Infer titlePosition. todo how to process the `style` specified by user.
    const { min, max } = (this.selection.select('.axisLabel-group').node() as Group).getBounds();
    const [[bx1, by1], [bx2, by2]] = [min, max];
    const { titleAnchor, offset = 0, titlePadding = 0, positionX, positionY } = this.style.title!;
    const titleAttrs: any = { x: spx, y: 0 };

    if (this.axisPosition === 'top') {
      titleAttrs.y = by1 - titlePadding;
      titleAttrs.textBaseline = 'bottom';
    }
    if (this.axisPosition === 'bottom') {
      titleAttrs.y = by2 + titlePadding;
      titleAttrs.textBaseline = 'top';
    }
    if (this.axisPosition === 'left') {
      titleAttrs.x = bx1 - titlePadding;
      titleAttrs.rotation = -90;
    }
    if (this.axisPosition === 'right') {
      titleAttrs.x = bx2 + titlePadding;
      titleAttrs.rotation = 90;
    }
    if (this.axisPosition === 'top' || this.axisPosition === 'bottom') {
      if (titleAnchor === 'start') titleAttrs.x = spx;
      else if (titleAnchor === 'end') titleAttrs.x = epx;
      else titleAttrs.x = (spx + epx) / 2;

      titleAttrs.textAlign = titleAnchor;
      [offsetX, offsetY] = [offset, 0];
    }
    // If axes align `left` or `right`, `start` means the anchor position for placing the axis title is the top edge of axis.
    if (this.axisPosition === 'left' || this.axisPosition === 'right') {
      [offsetX, offsetY] = [0, offset];

      if (titleAnchor === 'start') titleAttrs.y = startY;
      else if (titleAnchor === 'end') titleAttrs.y = endY;
      else titleAttrs.y = (startY + endY) / 2;

      if (this.axisPosition === 'left' && titleAnchor !== 'center')
        titleAttrs.textAlign = titleAnchor === 'start' ? 'end' : 'start';
      else titleAttrs.textAlign = titleAnchor;

      titleAttrs.textBaseline = 'bottom';
    }

    // User specified `style` has higher priority.
    axisTitle.attr({
      ...titleAttrs,
      ...style,
      [ORIGIN]: { text: content },
      x: (typeof positionX === 'number' ? positionX + startX : titleAttrs.x) + offsetX,
      y: (typeof positionY === 'number' ? positionY + startY : titleAttrs.y) + offsetY,
    });
    // todo Extract common utils.
    const rotation = this.style.title!.rotation ?? (titleAttrs.rotation || 0);
    axisTitle.setOrigin(0.5, 0.5);
    axisTitle.setLocalEulerAngles(rotation);
    axisTitle.setOrigin(0, 0);
    axisTitle.show();
  }

  protected getTicksCfg() {
    const { tickLine, label: labelCfg, subTickLine, ticks = [] } = this.style;
    // todo Extract common utils
    const [[x1, y1], [x2, y2]] = this.getEndPoints();

    function getTickPoint(value: number): Point {
      return [value * (x2 - x1) + x1, value * (y2 - y1) + y1];
    }

    const verticalVector = this.getVerticalVector();
    const tickLength = (tickLine && tickLine.len) || 0;

    // Generate id for tickLine and label, use same id
    const id = (d: any, idx: number) => d.id ?? `${idx}-${d.text || ''}`;

    function tickLineStyle(d: any, idx: number) {
      const [x, y] = getTickPoint(d.value);
      const [[x1, y1], [x2, y2]] = getTickEndPoints([x, y], tickLength, verticalVector);
      return {
        id: id(d, idx),
        ...d,
        ...get(tickLine, 'style', {}),
        path: [
          ['M', x1, y1],
          ['L', x2, y2],
        ],
      };
    }

    const { axisPosition } = this;
    function labelStyle(d: any, idx: number) {
      const { tickPadding = 0, offset = 0, formatter = (d) => d.text } = labelCfg!;
      const [x, y] = getTickPoint(d.value);
      const [sp, ep] = getTickEndPoints([x, y], tickLength + tickPadding, verticalVector);
      const inferStyle = inferLabelAttrs(sp, ep, axisPosition, offset);
      const userStyle = typeof labelCfg?.style === 'function' ? labelCfg.style.call(null, d, idx) : labelCfg?.style;

      return {
        ...d,
        // should not use `deepAssign`, because `undefined` will be assign
        ...deepMix({}, inferStyle, userStyle || {}),
        text: formatter ? formatter(d, idx) : d.text,
        id: id(d, idx),
        [ORIGIN]: d,
      };
    }

    const subTickCount = subTickLine?.count ? subTickLine.count : 0;
    const subTickLength = subTickLine?.len ? subTickLine.len : 0;

    function subTickStyle(d: any, idx: number, step: number) {
      return new Array(subTickCount).fill(null).map((_, subTickIdx) => {
        const [x, y] = getTickPoint(d.value + step * (subTickIdx + 1));
        const [[x1, y1], [x2, y2]] = getTickEndPoints([x, y], subTickLength, verticalVector);
        return {
          path: [
            ['M', x1, y1],
            ['L', x2, y2],
          ],
          id: d.id ? `${d.id}-${subTickIdx}-${d.text}` : `${idx}-${subTickIdx}-${d.text}`,
          ...get(subTickLine, 'style'),
        };
      });
    }

    const tickLines: any[] = [];
    const labels: AxisLabel[] = [];
    const subTickLines: any[] = [];

    ticks.forEach((d, idx) => {
      tickLines.push(tickLineStyle(d, idx));
      if (labelCfg) {
        const labelValue = !labelCfg.alignTick ? (d.value + (ticks[idx + 1]?.value || 1)) / 2 : d.value;
        labels.push(labelStyle({ ...d, value: labelValue }, idx));
      }
      if (subTickCount > 0 && idx < ticks.length - 1) {
        const step = (ticks[idx + 1].value - ticks[idx].value) / (subTickCount + 1);
        subTickLines.push(...subTickStyle(d, idx, step));
      }
    });
    return { tickLines, labels, subTickLines };
  }

  protected updateTicks() {
    super.updateTicks();
    const [[x1, y1], [x2, y2]] = this.getEndPoints();
    if (this.style.label?.verticalLimitLength) {
      this.selection.select('.axisLabel-group').style(
        'clipPath',
        new Rect({
          style: {
            // 处于被裁剪图形局部坐标系下
            // [TODO] 具体的 dom 结构需要调整
            x: Math.min(x1, x2) - 100,
            y: Math.min(y1, y2),
            width: Number.MAX_SAFE_INTEGER,
            height: this.style.label?.verticalLimitLength || Number.MAX_SAFE_INTEGER,
          },
        })
      );
    }
  }

  protected async layoutLabels(labelsCfg: AxisLabel[]) {
    const { label: labelCfg } = this.style;
    if (!labelCfg) return;

    // Do labels layout.
    const { overlapOrder = [] } = labelCfg;
    const rotation = this.getLabelRotation();
    // [TODO] 这里会导致用户设置的 textAlign 不生效，所以需要特别注意
    if (typeof rotation === 'number') this.labels.forEach((label) => rotateLabel(label, rotation));
    const autoLayout = new Map<string, Function>([
      ['autoHide', this.autoHideLabel],
      ['autoEllipsis', this.autoEllipsisLabel],
      ['autoRotate', this.autoRotateLabel],
    ]);
    overlapOrder.forEach(async (type: any) => {
      const layout = autoLayout.get(type) || (() => {});
      await layout.call(this, labelsCfg);
    });
    const rotationAngle = this.labels[0]?.getEulerAngles();
    if (rotationAngle) {
      const fontSize = Number(this.labels[0].style.fontSize || 0);
      // Do label truncate.
      const limitLength =
        // [TODO] 需要考虑字体本身的高度, 目前临时直接加
        ((this.selection.select('.axisLabel-group').node() as Group)!.getBBox().height - fontSize * 1.5) /
        Math.sin((rotationAngle / 180) * Math.PI);
      this.labelsEllipsis(this.labels, limitLength);
    }
    // dispatch layout end events
    this.dispatchEvent(new CustomEvent('axis-label-layout-end'));
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

  /** --------- Label layout strategy --------- */
  private autoHideLabel() {
    // reset all labels to be visible.
    reset(this.labels);

    const { label: labelCfg } = this.style;
    if (!labelCfg || !labelCfg.autoHide) return;

    const { autoHide } = labelCfg;
    const method = (typeof autoHide === 'object' && autoHide.type) || 'greedy';
    AutoHide(applyBounds(this.labels, labelCfg?.margin) as AxisLabel[], this.style.label!, method);
    this.autoHideTickLine();
  }

  private autoRotateLabel() {
    if (!this.style.label?.autoRotate) return;
    AutoRotate(applyBounds(this.labels), this.style.label ?? { autoRotate: false });
  }
}

export { Cartesian as Linear };
