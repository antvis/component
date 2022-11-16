import { CustomEvent, Group } from '@antv/g';
import { Linear } from '@antv/scale';
import { clamp, isUndefined, memoize } from '@antv/util';
import { GUI } from '../../core/gui';
import { Point } from '../../types';
import { Indicator } from '../indicator';
import {
  applyStyle,
  deepAssign,
  capitalize,
  getEventPos,
  subObject,
  subObjects,
  ifShow,
  select,
  Selection,
  throttle,
  toPrecision,
  filterTransform,
} from '../../util';
import type { AxisStyleProps } from '../axis';
import { Axis } from '../axis';
import { Title } from '../title';
import { CLASS_NAMES, CONTINUOUS_DEFAULT_OPTIONS, STEP_RATIO } from './constant';
import { Handle } from './continuous/handle';
import { Ribbon } from './continuous/ribbon';
import { getNextTickValue } from './continuous/utils';
import { ContinuousDatum, ContinuousOptions, ContinuousStyleProps } from './types';
import { getSafetySelections, getStepValueByValue, ifHorizontal } from './utils';

export type { ContinuousOptions };

type RT = Required<ContinuousStyleProps>;

const getMinMax = memoize(
  (data: ContinuousDatum[]) => {
    return {
      min: Math.min(...data.map((d) => d.value)),
      max: Math.max(...data.map((d) => d.value)),
    };
  },
  (data) => data.map((d: any) => d.id)
);

export class Continuous extends GUI<ContinuousStyleProps> {
  constructor(config: any) {
    super(deepAssign({}, CONTINUOUS_DEFAULT_OPTIONS, config));
  }

  protected eventToOffsetScale = new Linear({});

  protected _ribbonScale = new Linear({});

  protected ribbon!: Selection;

  protected indicator!: Selection;

  protected handlesGroup!: Selection;

  protected startHandle!: Selection;

  protected endHandle!: Selection;

  public render(attributes: ContinuousStyleProps, container: Group) {
    const {
      data,
      width,
      height,
      orient,
      defaultValue = [0, 1],
      color,
      block,
      type,
      slidable,
      step,
      showHandle,
      showLabel,
      showIndicator,
    } = attributes as RT;

    const [titleStyle, labelStyle, indicatorStyle, ribbonStyle, handleStyle] = subObjects(filterTransform(attributes), [
      'title',
      'label',
      'indicator',
      'ribbon',
      'handle',
    ]);

    const titleEl = select(container).maybeAppendByClassName(
      CLASS_NAMES.title,
      () => new Title({ style: { width, height, ...titleStyle } })
    );

    // @ts-ignore
    const { x, y, width: w, height: h } = titleEl.node().getAvailableSpace();

    const contentGroup = select(container)
      .maybeAppendByClassName(CLASS_NAMES.contentGroup, 'g')
      .call(applyStyle, { x, y });

    const ribbonGroup = contentGroup.maybeAppendByClassName(CLASS_NAMES.ribbonGroup, 'g');
    this.renderRibbon(ribbonGroup, ribbonStyle);

    this.handlesGroup = ribbonGroup.maybeAppendByClassName(CLASS_NAMES.handlesGroup, 'g');
    this.renderHandles();

    this.renderIndicator(contentGroup, indicatorStyle);

    const labelGroup = select(container).maybeAppendByClassName(CLASS_NAMES.labelGroup, 'g').call(applyStyle, { x, y });

    ifShow(showLabel, labelGroup, (group) => {
      this.renderLabel(group);
    });
  }

  private get range() {
    const { data } = this.attributes;
    return getMinMax(data);
  }

  private get ribbonScale() {
    const { min, max } = this.range;
    this._ribbonScale.update({
      domain: [min, max],
      range: [0, 1],
    });
    return this._ribbonScale;
  }

  private get ribbonRange() {
    const [min, max] = this.selection;
    const scale = this.ribbonScale;
    return [scale.map(min), scale.map(max)];
  }

  public get selection() {
    const { min, max } = this.range;
    const { defaultValue: [start, end] = [min, max] } = this.attributes;
    return [start, end] as [number, number];
  }

  protected ifHorizontal<T>(a: T, b: T) {
    return ifHorizontal(this.style.orient, typeof a === 'function' ? a() : a, typeof b === 'function' ? b() : b);
  }

  private renderRibbon(group: Selection, style: any) {
    const { type, orient, color, block, data } = this.attributes;
    this.ribbon = group
      .maybeAppendByClassName(CLASS_NAMES.ribbon, () => new Ribbon({}))
      .call(applyStyle, {
        type,
        orient,
        color,
        block,
        blocks: data.length - 1,
        range: this.ribbonRange,
        ...style,
      });
  }

  private renderHandles() {
    const { showHandle, slidable } = this.attributes;
    const [min, max] = this.selection;
    this.startHandle = this.renderHandle('start', min);
    this.endHandle = this.renderHandle('end', max);
    if (!showHandle || !slidable) this.handlesGroup.style('visibility', 'hidden');
    else this.handlesGroup.style('visibility', 'visible');
  }

  private renderHandle(type: string, value: number) {
    const { orient } = this.attributes;
    const { formatter, ...handleStyle } = subObject(this.attributes, 'handle');
    const handle = this.handlesGroup
      // @ts-ignore
      .maybeAppendByClassName(CLASS_NAMES.prefix(`${type}-handle`), () => new Handle({}))
      .call(applyStyle, { orient, labelText: value, ...handleStyle });
    this.setHandlePosition(type, value);
    return handle;
  }

  private setHandlePosition(type: string, value: number) {
    const { ribbonSize, handleFormatter } = this.attributes;
    const offset = this.getOffset(value);
    const [x, y] = this.ifHorizontal([offset, ribbonSize * 0.7], [ribbonSize / 2, offset]);
    // @ts-ignore
    const handle = this.handlesGroup.select(`.${CLASS_NAMES.prefix(`${type}-handle`)}`).node();
    handle?.attr('formatter', handleFormatter);
    const [prevX, prevY] = handle.getLocalPosition();

    if (Math.abs(x + y - prevX - prevY) < 100) handle?.setLocalPosition(x, y);
    else
      handle?.animate(
        [
          {
            transform: `translate(${handle.getLocalPosition().slice(0, 2).join(',')})`,
          },
          {
            transform: `translate(${x}, ${y})`,
          },
        ],
        { duration: 200, fill: 'both' }
      );
  }

  private renderIndicator(group: Selection, style: any) {
    const { formatter } = style;
    this.indicator = group
      .maybeAppendByClassName(CLASS_NAMES.indicator, () => new Indicator({}))
      .call(applyStyle, { ...style });
    this.indicator.node().attr('formatter', formatter);
  }

  private get labelData(): ContinuousDatum[] {
    const { data, labelAlign } = this.attributes;
    return data.reduce((acc, curr, index, arr) => {
      const id = curr?.id ?? index.toString();
      if (labelAlign === 'value')
        acc.push({
          ...curr,
          id,
          label: curr?.label ?? curr.value.toString(),
          value: this.ribbonScale.map(curr.value),
        });
      else if (index < arr.length - 1) {
        const next = arr[index + 1];
        const [cr, nx] = [curr.value, next.value];
        const midVal = (cr + nx) / 2;
        acc.push({
          ...curr,
          id,
          range: [cr, nx],
          label: [cr, nx].join('~'),
          value: this.ribbonScale.map(midVal),
        });
      }
      return acc;
    }, [] as ContinuousDatum[]);
  }

  private get labelStyle() {
    const { orient, labelDirection = 'positive' } = this.attributes;
    let [labelTextAlign, labelTextBaseline] = ['center', 'middle'];
    if (orient === 'horizontal') {
      if (labelDirection === 'positive') labelTextBaseline = 'top';
      else labelTextBaseline = 'bottom';
    } else if (labelDirection === 'positive') labelTextAlign = 'end';
    else labelTextAlign = 'start';
    return {
      labelTextAlign,
      labelTextBaseline,
    };
  }

  private renderLabel(group: Selection) {
    const { ribbonSize, ribbonLen } = this.attributes;
    const { spacing, align, formatter, filter, ...labelStyle } = subObject(this.attributes, 'label');
    const [startPos, endPos] = this.ifHorizontal(
      [
        [0, ribbonSize / 2],
        [ribbonLen, ribbonSize / 2],
      ],
      [
        [ribbonSize / 2, 0],
        [ribbonSize / 2, ribbonLen],
      ]
    );

    const style = {
      type: 'linear',
      startPos,
      endPos,
      data: this.labelData,
      showLine: false,
      showGrid: false,
      showTick: false,
      labelSpacing: spacing + ribbonSize / 2,
      labelTransform: 'rotate(0)',
      ...this.labelStyle,
      ...Object.fromEntries(Object.entries(labelStyle).map(([k, v]) => [`label${capitalize(k)}`, v])),
    } as AxisStyleProps;

    const axis = group
      .maybeAppendByClassName(CLASS_NAMES.label, () => new Axis({ style }))
      .call(applyStyle, style)
      .node();
    axis.attr('labelFormatter', formatter);
    axis.attr('labelFilter', filter);
  }

  /** 当前交互的对象 */
  private target!: string | undefined;

  /** 上次鼠标事件的位置 */
  private prevValue!: number;

  public bindEvents() {
    // 如果！slidable，则不绑定事件或者事件响应不生效
    // 放置需要绑定drag事件的对象
    const dragObject = new Map<string, Selection>();
    dragObject.set('ribbon', this.ribbon);
    dragObject.set('start', this.startHandle);
    dragObject.set('end', this.endHandle);
    // 绑定 drag 开始事件
    dragObject.forEach((obj, key) => {
      obj?.on('mousedown', this.onDragStart(key));
      obj?.on('touchstart', this.onDragStart(key));
    });
    this.startHandle?.on('mouseover', () => this.updateMouse());
    this.endHandle?.on('mouseover', () => this.updateMouse());
    this.ribbon.on('mousemove', this.onHovering);
    this.addEventListener('mouseout', this.hideIndicator);
  }

  private onHovering = (e: any) => {
    const { data, block } = this.attributes;
    e.stopPropagation();
    const value = this.getValueByCanvasPoint(e);
    if (block) {
      const { range } = getNextTickValue(
        data.map(({ value }) => value),
        value
      );
      this.showIndicator((range[0] + range[1]) / 2, `${range[0]}-${range[1]}`);
      this.dispatchIndicated(value, range);
    } else {
      const safetyValue = this.getTickValue(value);
      this.showIndicator(safetyValue);
      this.dispatchIndicated(safetyValue);
    }
  };

  public showIndicator(value: number, text = `${value}`) {
    const { orient, showIndicator } = this.attributes;
    if (!showIndicator || typeof value !== 'number') {
      this.hideIndicator();
      return;
    }
    const { min, max } = this.range;
    const safeValue = clamp(value, min, max);
    const pos: Point = [this.getOffset(safeValue), 0];
    if (orient === 'vertical') pos.reverse();
    const indicator = this.indicator.node();
    indicator.attr('visibility', 'visible');
    indicator.attr('position', this.ifHorizontal('top', 'left'));
    indicator.attr('value', text);
    indicator.setLocalPosition(...pos);
  }

  private hideIndicator() {
    this.indicator?.style('visibility', 'hidden');
  }

  private onDragStart = (target: string) => (e: any) => {
    e.stopPropagation();

    // 关闭滑动
    if (!this.attributes.slidable) return;
    this.target = target;

    this.prevValue = this.getTickValue(this.getValueByCanvasPoint(e));
    document.addEventListener('mousemove', this.onDragging);
    document.addEventListener('touchmove', this.onDragging);
    document.addEventListener('mouseleave', this.onDragEnd);
    document.addEventListener('mouseup', this.onDragEnd);
    document.addEventListener('mouseup', this.onDragEnd);
    document.addEventListener('touchend', this.onDragEnd);
  };

  private onDragging = (e: any) => {
    const { target } = this;
    this.updateMouse();
    const [start, end] = this.selection;
    const currValue = this.getTickValue(this.getValueByCanvasPoint(e));
    const diffValue = currValue - this.prevValue;

    if (target === 'start') start !== currValue && this.updateSelection(currValue, end);
    else if (target === 'end') end !== currValue && this.updateSelection(start, currValue);
    else if (target === 'ribbon' && diffValue !== 0) {
      this.prevValue = currValue;
      this.updateSelection(diffValue, diffValue, true);
    }
  };

  private onDragEnd = () => {
    this.style.cursor = 'default';
    document.removeEventListener('mousemove', this.onDragging);
    document.removeEventListener('touchmove', this.onDragging);
    document.removeEventListener('mouseup', this.onDragEnd);
    document.removeEventListener('touchend', this.onDragEnd);
  };

  private updateMouse() {
    if (this.style.slidable) this.style.cursor = 'grabbing';
  }

  public setSelection(start: number, end: number) {
    this.updateSelection(start, end);
  }

  private updateSelection(stVal: number, endVal: number, isOffset: boolean = false) {
    const [currSt, currEnd] = this.selection;

    let [start, end] = [stVal, endVal];
    if (isOffset) {
      // 获取当前值
      start += currSt;
      end += currEnd;
    }
    // 值校验
    const { min, max } = this.range;
    [start, end] = getSafetySelections([min, max], [start, end], this.selection);
    this.update({ defaultValue: [start, end] });
    this.dispatchSelection();
  }

  private get step(): number {
    const { step = 1 } = this.attributes;
    const { min, max } = this.range;
    if (isUndefined(step)) return toPrecision((max - min) * STEP_RATIO, 0);
    return step;
  }

  private getTickValue(value: number): number {
    const { data, block } = this.attributes;
    const { min } = this.range;
    if (block)
      return getNextTickValue(
        data.map(({ value }) => value),
        value
      ).tick;
    return getStepValueByValue(value, this.step, min);
  }

  /**
   * 事件触发的位置对应的value值
   * @param limit {boolean} 我也忘了要干啥了
   */
  private getValueByCanvasPoint(e: any, limit: boolean = false) {
    const { min, max } = this.range;
    const [x, y] = this.ribbon.node().getPosition();
    const startPos = this.ifHorizontal(x, y);
    const currValue = this.ifHorizontal(...getEventPos(e));
    const offset = currValue - startPos;
    const value = clamp(this.getOffset(offset, true) + min, min, max);
    return value;
  }

  /** reverse: 屏幕偏移量 -> 值 */
  private getOffset(value: number, reverse = false) {
    const { min, max } = this.range;
    const { ribbonLen } = this.attributes;
    const scale = this.eventToOffsetScale;
    scale.update({ domain: [min, max], range: [0, ribbonLen] });
    if (reverse) return scale.invert(value);
    return scale.map(value);
  }

  @throttle(100)
  private dispatchSelection() {
    const evt = new CustomEvent('valuechange', {
      detail: {
        value: this.selection,
      },
    });
    this.dispatchEvent(evt as any);
  }

  @throttle(100)
  private dispatchIndicated(value: number, range?: unknown) {
    const evt = new CustomEvent('indicated', {
      detail: { value, range },
    });
    this.dispatchEvent(evt as any);
  }
}
