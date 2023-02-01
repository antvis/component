import { CustomEvent, Group, type DisplayObject, type TextStyleProps } from '@antv/g';
import { Linear } from '@antv/scale';
import { clamp, isUndefined, memoize } from '@antv/util';
import { GUI } from '../../core/gui';
import { Point } from '../../types';
import {
  BBox,
  capitalize,
  deepAssign,
  getEventPos,
  ifShow,
  select,
  Selection,
  subObject,
  subObjects,
  throttle,
  toPrecision,
} from '../../util';
import { Axis, type AxisStyleProps } from '../axis';
import { CLASS_NAMES as AXIS_CLASS_NAMES } from '../axis/constant';
import { Indicator } from '../indicator';
import { Title } from '../title';
import { CLASS_NAMES, CONTINUOUS_DEFAULT_OPTIONS, STEP_RATIO } from './constant';
import { Handle, type HandleType } from './continuous/handle';
import { Ribbon } from './continuous/ribbon';
import { getNextTickValue } from './continuous/utils';
import { ContinuousDatum, ContinuousOptions, ContinuousStyleProps } from './types';
import { getSafetySelections, getStepValueByValue, ifHorizontal } from './utils';

export type { ContinuousOptions, ContinuousStyleProps };

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

  protected innerRibbonScale = new Linear({});

  protected title!: Selection<Title>;

  protected label!: Selection<typeof Axis>;

  protected ribbon!: Selection;

  protected indicator!: Selection;

  protected get handleOffsetRatio() {
    return this.ifHorizontal(0.7, 0.9);
  }

  protected handlesGroup!: Selection;

  protected startHandle!: Selection;

  protected endHandle!: Selection;

  public getBBox(): DOMRect {
    const { width, height } = this.attributes;
    return new BBox(0, 0, width, height);
  }

  public render(attributes: ContinuousStyleProps, container: Group) {
    // 渲染顺序
    // 1. 绘制 title, 获得可用空间
    // 2. 绘制 label, handle
    // 3. 基于可用空间、label高度、handle 宽高，计算 ribbon 宽高
    // 4. 绘制 ribbon
    // 5. 调整 label、handle 位置

    /** title */
    this.renderTitle(select(container));

    const { x, y } = (this.title.node() as Title).getAvailableSpace();

    /** label */
    const { showLabel } = attributes;

    /** content */
    const contentGroup = select(container).maybeAppendByClassName(CLASS_NAMES.contentGroup, 'g').styles({ x, y });

    const labelGroup = contentGroup.maybeAppendByClassName(CLASS_NAMES.labelGroup, 'g').styles({ zIndex: 1 });
    ifShow(!!showLabel, labelGroup, (group) => {
      this.renderLabel(group);
    });

    const ribbonGroup = contentGroup.maybeAppendByClassName(CLASS_NAMES.ribbonGroup, 'g');

    /** handle */
    this.handlesGroup = contentGroup.maybeAppendByClassName(CLASS_NAMES.handlesGroup, 'g').styles({ zIndex: 2 });
    this.renderHandles();

    /** ribbon */
    this.renderRibbon(ribbonGroup);

    this.renderIndicator(contentGroup);

    /** adjust */
    this.adjustLabel();
    this.adjustHandles();
  }

  private get range() {
    const { data } = this.attributes;
    return getMinMax(data);
  }

  private get ribbonScale() {
    const { min, max } = this.range;
    this.innerRibbonScale.update({
      domain: [min, max],
      range: [0, 1],
    });
    return this.innerRibbonScale;
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

  protected ifHorizontal<T>(a: T, b: T): T {
    return ifHorizontal(this.style.orient, typeof a === 'function' ? a() : a, typeof b === 'function' ? b() : b);
  }

  private renderTitle(container: Selection) {
    const { showTitle, titleText = '', width, height } = this.attributes;
    const style = subObject(this.attributes, 'title') as TextStyleProps;

    const finalTitleStyle = { width, height, ...style, text: showTitle ? titleText : '' };
    this.title = container
      .maybeAppendByClassName(CLASS_NAMES.title, () => new Title({ style: finalTitleStyle }))
      .update(finalTitleStyle) as Selection<Title>;
  }

  private get labelFixedSpacing() {
    const { labelShowTick } = this.attributes;
    return labelShowTick ? 5 : 0;
  }

  private get labelPosition() {
    const { orient, labelDirection } = this.attributes as Required<ContinuousStyleProps>;
    const positions = {
      vertical: { positive: 'right', negative: 'left' },
      horizontal: { positive: 'bottom', negative: 'top' },
    } as const;
    return positions[orient][labelDirection];
  }

  private cacheLabelBBox: DOMRect | null = null;

  private get labelBBox() {
    const { showLabel } = this.attributes;
    if (!showLabel) return new BBox(0, 0, 0, 0);
    if (this.cacheLabelBBox) return this.cacheLabelBBox;
    const { width, height } = (
      this.label.select(AXIS_CLASS_NAMES.labelGroup.class).node().children.slice(-1)[0] as DisplayObject
    ).getBBox();
    this.cacheLabelBBox = new BBox(0, 0, width, height);
    return this.cacheLabelBBox;
  }

  private get labelShape() {
    const { showLabel, labelSpacing = 0 } = this.attributes;
    if (!showLabel) return { width: 0, height: 0, size: 0, len: 0 };
    const { width, height } = this.labelBBox;
    const size = this.ifHorizontal(height, width) + labelSpacing + this.labelFixedSpacing;
    const len = this.ifHorizontal(width, height);
    return { width, height, size, len };
  }

  private get ribbonBBox(): DOMRect {
    const { showHandle } = this.attributes;
    const { width: availableWidth, height: availableHeight } = (this.title.node() as Title).getAvailableSpace();

    const { size: labelSize, len: labelLength } = this.labelShape;

    const [availableSize, availableLength] = this.ifHorizontal(
      [availableHeight, availableWidth],
      [availableWidth, availableHeight]
    );
    const { size: handleSize, len: handleLength } = showHandle ? this.handleShape : { size: 0, len: 0 };
    // const handleMarkerSize = showHandle ? this.attributes.handleMarkerSize || 0 : 0;
    const handleRatio = this.handleOffsetRatio;

    let ribbonSize = 0;
    const labelPosition = this.labelPosition;
    if (['bottom', 'right'].includes(labelPosition)) {
      ribbonSize = Math.min(availableSize - labelSize, (availableSize - handleSize) / handleRatio);
    } else if (availableSize * (1 - handleRatio) > handleSize) {
      ribbonSize = Math.max(availableSize - labelSize, 0);
    } else ribbonSize = Math.max((availableSize - labelSize - handleSize) / handleRatio, 0);

    const edgeLength = Math.max(handleLength, labelLength);
    const ribbonLength = availableLength - edgeLength;

    const [width, height] = this.ifHorizontal([ribbonLength, ribbonSize], [ribbonSize, ribbonLength]);

    // 需要考虑 handle 的占用空间
    // todo 为了防止因为 handle 文本变化导致的 ribbon 位置变化，handle size 取最大值
    const finalLabelOccupy = ['top', 'left'].includes(labelPosition) ? labelSize : 0;

    const [x, y] = this.ifHorizontal([edgeLength / 2, finalLabelOccupy], [finalLabelOccupy, edgeLength / 2]);

    return new BBox(x, y, width, height);
  }

  private get ribbonShape() {
    const { width, height } = this.ribbonBBox;
    return this.ifHorizontal({ size: height, len: width }, { size: width, len: height });
  }

  private renderRibbon(container: Selection) {
    const { type, orient, color, block, data } = this.attributes;
    const style = subObject(this.attributes, 'ribbon');
    const { min, max } = this.range;
    const { x, y } = this.ribbonBBox;
    const { len, size } = this.ribbonShape;
    this.ribbon = container
      .maybeAppendByClassName(CLASS_NAMES.ribbon, () => new Ribbon({}))
      .update({
        x,
        y,
        len,
        size,
        type,
        orient,
        color,
        block,
        partition: data.map((d) => (d.value - min) / (max - min)),
        range: this.ribbonRange,
        ...style,
      });
  }

  private getHandleClassName(type: HandleType) {
    // @ts-ignore
    return `${CLASS_NAMES.prefix(`${type}-handle`)}`;
  }

  private renderHandles() {
    const { showHandle, orient } = this.attributes;
    const { formatter, ...handleStyle } = subObject(this.attributes, 'handle');
    const [min, max] = this.selection;
    const style = { orient, ...handleStyle };
    const that = this;
    this.handlesGroup
      .selectAll(CLASS_NAMES.handle.class)
      .data(
        showHandle
          ? [
              { value: min, type: 'start' },
              { value: max, type: 'end' },
            ]
          : [],
        (d) => d.type
      )
      .join(
        (enter) =>
          enter
            .append(() => new Handle({}))
            .attr('className', (d: any) => `${CLASS_NAMES.handle} ${this.getHandleClassName(d.type)}`)
            .styles(style)
            .style('labelText', (d: any) => d.value)
            .each(function (d) {
              const handle = select(this);
              if (d.type === 'start') that.startHandle = handle;
              else that.endHandle = handle;
            }),
        (update) => update.styles(style).style('labelText', (d: any) => d.value),
        (exit) => exit.remove()
      );
  }

  private adjustHandles() {
    const [min, max] = this.selection;
    this.setHandlePosition('start', min);
    this.setHandlePosition('end', max);
  }

  private cacheHandleBBox: DOMRect | null = null;

  private get handleBBox() {
    if (this.cacheHandleBBox) return this.cacheHandleBBox;
    if (!this.attributes.showHandle) return new BBox(0, 0, 0, 0);
    const { width: startHandleWidth, height: startHandleHeight } = this.startHandle.node().getBBox();
    const { width: endHandleWidth, height: endHandleHeight } = this.endHandle.node().getBBox();
    const [width, height] = [Math.max(startHandleWidth, endHandleWidth), Math.max(startHandleHeight, endHandleHeight)];
    this.cacheHandleBBox = new BBox(0, 0, width, height);
    return this.cacheHandleBBox;
  }

  /**
   *  因为 handle label 的宽高是动态的，所以 handle bbox 是第一次渲染时的 bbox
   */
  private get handleShape() {
    const { width, height } = this.handleBBox;
    const [size, len] = this.ifHorizontal([height, width], [width, height]);
    return { width, height, size, len };
  }

  private setHandlePosition(type: HandleType, value: number) {
    const { handleFormatter } = this.attributes;
    const { x: ribbonX, y: ribbonY } = this.ribbonBBox;
    const { size: ribbonSize } = this.ribbonShape;
    const offset = this.getOffset(value);
    const [x, y] = this.ifHorizontal(
      [ribbonX + offset, ribbonY + ribbonSize * this.handleOffsetRatio],
      [ribbonX + ribbonSize * this.handleOffsetRatio, ribbonY + offset]
    );
    // @ts-ignore
    const handle = this.handlesGroup.select(`.${this.getHandleClassName(type)}`).node();
    handle?.attr('formatter', handleFormatter);
    // const [prevX, prevY] = handle.getLocalPosition();
    handle?.setLocalPosition(x, y);
  }

  private renderIndicator(container: Selection) {
    const style = subObject(this.attributes, 'indicator');
    this.indicator = container
      .maybeAppendByClassName(CLASS_NAMES.indicator, () => new Indicator({ style }))
      .update(style);
  }

  private get labelData(): ContinuousDatum[] {
    const { data } = this.attributes;
    return data.reduce((acc, curr, index, arr) => {
      const id = curr?.id ?? index.toString();
      acc.push({
        ...curr,
        id,
        index,
        type: 'value',
        label: curr?.label ?? curr.value.toString(),
        value: this.ribbonScale.map(curr.value),
      });
      if (index < arr.length - 1) {
        const next = arr[index + 1];
        const [cr, nx] = [curr.value, next.value];
        const midVal = (cr + nx) / 2;
        acc.push({
          ...curr,
          id,
          index,
          type: 'range',
          range: [cr, nx],
          label: [cr, nx].join('~'),
          value: this.ribbonScale.map(midVal),
        });
      }
      return acc;
    }, [] as ContinuousDatum[]);
  }

  private get labelStyle() {
    let [labelTextAlign, labelTextBaseline] = ['center', 'middle'];

    const labelPosition = this.labelPosition;
    if (labelPosition === 'top') labelTextBaseline = 'bottom';
    else if (labelPosition === 'bottom') labelTextBaseline = 'top';
    else if (labelPosition === 'left') labelTextAlign = 'end';
    else if (labelPosition === 'right') labelTextAlign = 'start';

    return {
      labelTextAlign,
      labelTextBaseline,
    };
  }

  private renderLabel(container: Selection) {
    const {
      formatter,
      filtrate,
      filter,
      align,
      labelDirection,
      tickLength,
      showTick = false,
      ...restStyle
    } = subObject(this.attributes, 'label');

    const [tickStyle, labelStyle] = subObjects(restStyle, ['tick']);

    const style = {
      type: 'linear',
      startPos: [0, 0],
      endPos: [0, 0],
      data: this.labelData,
      showLine: false,
      showGrid: false,
      showTick,
      tickDirection: labelDirection,
      labelTransform: 'rotate(0)',
      ...this.labelStyle,
      ...Object.fromEntries(Object.entries(tickStyle).map(([k, v]) => [`tick${capitalize(k)}`, v])),
      ...Object.fromEntries(Object.entries(labelStyle).map(([k, v]) => [`label${capitalize(k)}`, v])),
    } as AxisStyleProps;

    this.label = container
      .maybeAppendByClassName(CLASS_NAMES.label, () => new Axis({ style }))
      .styles(style) as Selection;
    this.label.node().attr({
      tickFilter: (datum: ContinuousDatum, index: number, data: ContinuousDatum[]) => {
        if (datum?.type !== 'value') return false;
        if (filtrate)
          return filtrate(
            datum,
            datum.index,
            data.filter((d) => d.type !== 'value')
          );
        return true;
      },
      labelFilter: (datum: ContinuousDatum, index: number, data: ContinuousDatum[]) => {
        if (datum?.type !== align) return false;
        if (filtrate)
          return filtrate(
            datum,
            datum.index,
            data.filter((d) => d.type === align)
          );
        return true;
      },
      labelFormatter: formatter,
    });
  }

  private get labelAxisCfg() {
    const { labelDirection, labelShowTick, labelSpacing } = this.attributes as Required<ContinuousStyleProps>;
    const { size: ribbonSize } = this.ribbonShape;
    const labelPosition = this.labelPosition;
    const labelFixedSpacing = this.labelFixedSpacing;
    let [offset, spacing, tickLength] = [0, 0, 0];

    const internalVal = ribbonSize + labelSpacing;

    if (labelShowTick) {
      tickLength = internalVal;
      spacing = labelFixedSpacing;
      if (labelDirection === 'positive') {
        if (labelPosition === 'right') {
          offset = internalVal;
          tickLength = internalVal;
        } else if (labelPosition === 'bottom') offset = tickLength;
      } else if (labelDirection === 'negative') {
        if (labelPosition === 'top') offset = ribbonSize;
        else if (labelPosition === 'left') offset = ribbonSize;
      }
    } else if (labelDirection === 'positive') {
      if (labelPosition === 'right') spacing = internalVal;
      else if (labelPosition === 'bottom') {
        offset = ribbonSize + labelFixedSpacing;
        spacing = labelSpacing;
      }
    } else if (labelDirection === 'negative') {
      if (labelPosition === 'left') spacing = labelSpacing;
      else if (labelPosition === 'top') spacing = labelSpacing;
    }

    return { offset, spacing, tickLength };
  }

  private adjustLabel() {
    const { showLabel } = this.attributes as Required<ContinuousStyleProps>;
    if (!showLabel) return;
    const { x, y, width, height } = this.ribbonBBox;
    const { offset: axisOffset, spacing: axisSpacing, tickLength: axisTickLength } = this.labelAxisCfg;
    const [startPos, endPos] = this.ifHorizontal(
      [
        [x, y + axisOffset],
        [x + width, y + axisOffset],
      ],
      [
        [x + axisOffset, y + height],
        [x + axisOffset, y],
      ]
    );

    this.label.styles({
      startPos,
      endPos,
      tickLength: axisTickLength,
      labelSpacing: axisSpacing,
    });
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
    const { showIndicator } = this.attributes;
    if (!showIndicator || typeof value !== 'number') {
      this.hideIndicator();
      return;
    }
    const { min, max } = this.range;
    const { x, y } = this.ribbonBBox;
    const safeValue = clamp(value, min, max);
    const offset = this.getOffset(safeValue);
    const pos: Point = this.ifHorizontal([offset + x, y], [x, offset + y]);
    this.indicator.update({
      visibility: 'visible',
      position: this.ifHorizontal('top', 'left'),
      value: text,
    });
    this.indicator.node().setLocalPosition(...pos);
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
    const value = clamp(this.getOffset(offset, true), min, max);
    return value;
  }

  /** reverse: 屏幕偏移量 -> 值 */
  private getOffset(value: number, reverse = false) {
    const { min, max } = this.range;
    const { len: ribbonLen } = this.ribbonShape;
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
    const evt = new CustomEvent('indicate', {
      detail: { value, range },
    });
    this.dispatchEvent(evt as any);
  }
}
