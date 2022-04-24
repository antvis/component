import { Group, Path } from '@antv/g';
import { isNil, maxBy, minBy } from '@antv/util';
import { GUI } from '../../core/gui';
import {
  formatTime,
  getEllipsisText,
  getFont,
  getMask,
  getTimeScale,
  getTimeStart,
  measureTextWidth,
  Selection,
  TimeScale,
  toKNotation,
  toScientificNotation,
  toThousands,
  scale as timeScale,
  deepAssign,
  select,
} from '../../util';
import { Marker } from '../marker';
import { ORIGIN, COMMON_TIME_MAP } from './constant';
import { AxisBaseStyleProps, Point } from './types';
import { AxisLabel } from './types/shape';
import { applyBounds, boundTest } from './utils/helper';

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

function parseLength(length: string | number, font: any) {
  return typeof length === 'string' ? measureTextWidth(length, font) : length;
}

export abstract class AxisBase<T extends AxisBaseStyleProps = AxisBaseStyleProps> extends GUI<T> {
  public static tag = 'axisBase';

  protected axisGroup!: Group;

  protected selection!: Selection;

  protected get labels(): AxisLabel[] {
    return (this.selection.select('.axisLabel-group').node() as Group).childNodes as AxisLabel[];
  }

  protected get tickLines() {
    return this.selection.selectAll('.axis-tickLine').nodes();
  }

  protected get labelFont() {
    return this.labels[0] && getFont(this.labels[0]);
  }

  public init() {
    this.axisGroup = this.appendChild(new Group({ name: 'axis' }));
    this.axisGroup.appendChild(new Group({ className: 'tickLine-group' }));
    this.axisGroup.appendChild(new Group({ className: 'axisLabel-group' }));
    this.axisGroup.appendChild(new Group({ className: 'subTickLine-group' }));

    this.selection = select(this);

    this.update();
  }

  public update(cfg: Partial<AxisBaseStyleProps> = {}) {
    // should not use this.style, because `style` is a Proxy object, not a Plain Object.
    // should not use `deepMix`, because `undefined` should be assign, not to be ignore.
    this.attr(deepAssign({}, this.attributes, cfg));
    this.updateAxisLine();
    // Trigger update data binding
    this.updateTicks();
    // [TODO] Do label layout async. Why should use `requestAnimationFrame` (do layout in next frame)
    window.requestAnimationFrame(() => {
      const { labels: labelsCfg } = this.getTicksCfg();
      this.layoutLabels(labelsCfg);
    });
    this.updateAxisTitle();
    // Position of axis-title depending on axis-label
    this.addEventListener('axis-label-layout-end', () => {
      this.updateAxisTitle();
    });
  }

  public clear() {}

  protected abstract updateAxisLine(): void;

  protected abstract getTicksCfg(): { tickLines: any[]; labels: AxisLabel[]; subTickLines: any[] };

  protected abstract layoutLabels(labels: AxisLabel[]): void;

  protected abstract updateAxisTitle(): void;

  protected abstract getEndPoints(): Point[];

  protected abstract getLabelRotation(label?: AxisLabel): number | undefined;

  protected updateTicks() {
    const { tickLines, labels, subTickLines } = this.getTicksCfg();

    this.selection
      .select('.tickLine-group')
      .selectAll('.axis-tickLine')
      .data(tickLines, (d) => d.id)
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('className', 'axis-tickLine')
            .each(function (datum) {
              // @ts-ignore
              this.attr(datum);
            }),
        (update) =>
          update.each(function (datum) {
            // @ts-ignore
            this.attr(datum);
          }),
        (exit) => exit?.remove()
      );
    this.selection
      .select('.subTickLine-group')
      .selectAll('.axis-subTickLine')
      .data(subTickLines, (d) => d.id)
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('className', 'axis-subTickLine')
            .each(function (datum) {
              // @ts-ignore
              this.attr(datum);
            }),
        (update) =>
          update.each(function (datum) {
            // @ts-ignore
            this.attr(datum);
          }),
        (exit) => exit?.remove()
      );
    this.selection
      .select('.axisLabel-group')
      .selectAll('.axis-label')
      .data(labels, (d) => d.id)
      .join(
        (enter) =>
          enter
            .append('text')
            .attr('className', 'axis-label')
            .each(function (datum) {
              // @ts-ignore
              this.attr(datum);
            }),
        (update) =>
          update.each(function (datum) {
            // @ts-ignore
            this.attr(datum);
          }),
        (exit) => exit?.remove()
      );
  }

  protected autoHideTickLine() {
    if (!this.style.label?.autoHideTickLine) return;

    const idTickLines = new Map(this.tickLines.map((d) => [d.style.id, d]));
    this.labels.forEach((label) => {
      const tickLine = idTickLines.get(label.style.id) as Path;
      if (label.style.visibility === 'hidden' && tickLine) tickLine.hide();
      else tickLine.show();
    });
  }

  /** --------- Label layout strategy --------- */
  protected autoEllipsisLabel() {
    const { label: labelCfg } = this.style;
    if (!labelCfg || !labelCfg.autoEllipsis) return;

    const { ellipsisStep, minLength, maxLength } = labelCfg;
    const font = this.labelFont;
    const step = parseLength(ellipsisStep!, font);
    let max = parseLength(maxLength!, font);
    // Enable to ellipsis label when overlap.
    // 不限制长度
    if (isNil(max) || max === Infinity) {
      max = Math.max.apply(
        null,
        this.labels.map((d) => d.getBBox().width)
      );
    }
    const min = parseLength(minLength!, font);
    let source = this.labels;
    for (let allowedLength = max; allowedLength > min + step; allowedLength -= step) {
      source = boundTest(applyBounds(this.labels, labelCfg?.margin));
      // 碰撞检测
      if (source.length < 1) return;
      // Apply ellipsis to the labels overlaps.
      this.labelsEllipsis(source, allowedLength);
    }
  }

  /** ------------------------------自动缩略相关------------------------------------------ */
  /**
   * 缩略 labels 到指定长度内
   */
  public labelsEllipsis(labels: AxisLabel[], width: number) {
    const strategy = this.getLabelEllipsisStrategy(width);
    labels.forEach((label) => {
      const datum = label.style[ORIGIN];
      // @ts-ignore
      label.attr('text', datum.text ? strategy.call(this, datum.text) : '');
    });
  }

  /**
   * 获取 缩短、缩写 label 的策略
   * @param text {String} 当前要缩略的label
   * @param width {number} 限制的宽度
   * @param idx {number} label 索引
   */
  public getLabelEllipsisStrategy(width: number) {
    const { type } = this.style.label!;
    if (type === 'text') {
      const font = this.labelFont;
      return (...args: [string, number?]) => getEllipsisText(args[0], width, font);
    }
    if (type === 'number') {
      return this.getNumberSimplifyStrategy(width);
    }
    if (type === 'time') {
      // 时间缩略
      return this.getTimeSimplifyStrategy(width);
    }
    // 默认策略，不做任何处理
    return (...args: [string, number?]) => args[0];
  }

  /**
   * todo 需要考虑国际化问题，具体省略规则策略见：https://yuque.antfin.com/antv/cfksca/406601
   * 宽度为 width 时采取何种数字缩写缩略
   */
  private getNumberSimplifyStrategy(width: number) {
    // 确定最长的数字使用的计数方法
    // 其余数字都采用该方法
    const texts = this.labels.map((d) => ({ text: d.style.text, value: d.style[ORIGIN].text }));
    const num = Number(maxBy(texts, ({ text }) => text?.length || 0).value);

    const font = this.labelFont;
    /**
     * 输入： 100000000， 宽度x
     * 1. 原始数值    100,000,000
     * 2. K表达      100,000K
     * 3. 科学计数    1e+8
     */
    let result = toThousands(num);
    if (measureTextWidth(result, font) <= width) {
      return (...args: [string, number]) => toThousands(Number(args[0]));
    }
    result = toKNotation(num);
    if (measureTextWidth(result, font) <= width) {
      return (...args: [string, number]) => toKNotation(Number(args[0]), 1);
    }
    // 如果都不行，只能用科学计数法了
    return (...args: [string, number]) => toScientificNotation(Number(args[0]));
  }

  /**
   * 时间缩略
   */
  private getTimeSimplifyStrategy(width: number) {
    const ticks = this.labels.map((d) => ({ text: d.style.text, value: d.style[ORIGIN].text }));

    const { text: startTime } = minBy(ticks, ({ value }) => new Date(value).getTime());
    const { text: endTime } = maxBy(ticks, ({ value }) => new Date(value).getTime());
    const scale = getTimeScale(startTime, endTime);
    /**
     * 以下定义了时间显示的规则
     * keyTimeMap 为关键节点的时间显示，第一个时间、每scale时间，关键节点不受width限制，但最小单位与非关键节点一致
     * 例如2021-01-01 - 2022-12-31 中的关键时间节点为2021-01-01, 2022-01-01
     * commonTimeMap 为非关键节点的显示，在空间充足的情况下会优先显示信息更多(靠前)的选项
     * 如在空间充足的情况下，2021-01-01 - 2022-12-31 会显示为：2021-01-01 2021-01-02 ... 形势
     * 空间略微不足时：2021-01-01 01-02 01-03 ... 2022-01-01 01-02 ...
     * 空间较为不足时：2021-01 02 ... 2022-01 02 ...
     */

    const baseTime = new Date('1970-01-01 00:00:00');
    const font = this.labelFont;

    /**
     * 非关键节点mask
     */
    let commonTimeMask!: [TimeScale, TimeScale];
    for (let idx = 0; idx < COMMON_TIME_MAP[scale].length; idx += 1) {
      const scheme = COMMON_TIME_MAP[scale][idx] as [TimeScale, TimeScale];
      if (measureTextWidth(formatTime(baseTime, getMask(scheme)), font) < width) {
        commonTimeMask = scheme;
        break;
      }
      // 最后一个是备选方案
      commonTimeMask = scheme;
    }

    let keyTimeMask: [TimeScale, TimeScale];
    // 选择关键节点mask
    const [, minUnit] = commonTimeMask;
    for (let idx = 0; idx < timeScale.length; idx += 1) {
      if (timeScale.indexOf(minUnit) >= idx) {
        const scheme = [timeScale[0], minUnit] as [TimeScale, TimeScale];
        if (measureTextWidth(formatTime(baseTime, getMask(scheme)), font) < width) {
          keyTimeMask = scheme;
          break;
        }
        keyTimeMask = scheme;
      }
    }

    return (...args: [string, number]) => {
      const text = args[0];
      const idx = args[1];
      let prevText = text;
      if (idx !== 0) prevText = ticks[idx - 1].text;
      let mask = commonTimeMask;
      if (idx === 0 || getTimeStart(new Date(prevText), scale) !== getTimeStart(new Date(text), scale))
        mask = keyTimeMask;
      return formatTime(new Date(text), getMask(mask));
    };
  }
}
