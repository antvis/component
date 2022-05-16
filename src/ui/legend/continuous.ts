import { TextStyleProps, DisplayObject, clamp, Text, CustomEvent } from '@antv/g';
import { get, isUndefined, memoize } from '@antv/util';
import { deepAssign, Selection, select, getEventPos, toPrecision, throttle } from '../../util';
import {
  CONTINUOUS_DEFAULT_OPTIONS,
  DEFAULT_HANDLE_CFG,
  DEFAULT_LABEL_CFG,
  DEFAULT_RAIL_CFG,
  STEP_RATIO,
} from './constant';
import { LegendBase } from './base';
import { ContinuousCfg, ContinuousOptions } from './types';
import { getSafetySelections, getStepValueByValue, ifHorizontal } from './utils';
import { Rail } from './continuousRail';
import { Handle } from './continuousHandle';
import { Indicator } from './continuousIndicator';
import { getChunkedColor, getNextTickValue } from './chunkContinuous';

export type { ContinuousOptions };

function applyStyle(selection: Selection, style: Record<string, keyof any>) {
  for (const [key, value] of Object.entries(style)) {
    selection.style(key, value);
  }
}

function getRailLabels(orient: string, rail: { size: number; length: number }, spacing: number) {
  const [dx, dy] = ifHorizontal(orient, ['dx', 'dy'], ['dy', 'dx']);
  const [align1, align2] = ifHorizontal(orient, ['right', 'left'], ['center', 'center']);
  const [baseline1, baseline2] = ifHorizontal(orient, ['middle', 'middle'], ['bottom', 'top']);
  return [
    {
      [dx]: -spacing,
      [dy]: rail.size / 2,
      textAlign: align1,
      textBaseline: baseline1,
    },
    {
      [dx]: rail.length + spacing,
      [dy]: rail.size / 2,
      textAlign: align2,
      textBaseline: baseline2,
    },
  ];
}

function getTickStyle(orient: string, offset: number, align: string, railSize: number, spacing: number) {
  const [dx, dy] = ifHorizontal(orient, ['dx', 'dy'], ['dy', 'dx']);

  return {
    [dx]: offset,
    [dy]: align === 'start' ? -spacing : railSize + spacing,
    textAlign: ifHorizontal(orient, 'center', align === 'start' ? 'right' : 'left'),
    textBaseline: ifHorizontal(orient, align === 'start' ? 'bottom' : 'top', 'middle'),
  };
}

const sortTicks = memoize(
  (ticks: number[]) => ticks.sort((a, b) => a - b),
  (...args: any[]) => JSON.stringify(args)
);

export class Continuous<T extends ContinuousCfg> extends LegendBase<T> {
  public static tag: string = 'continuous-legend';

  protected static defaultOptions = {
    type: Continuous.tag,
    ...CONTINUOUS_DEFAULT_OPTIONS,
  };

  protected rail!: Rail;

  protected startHandle!: Handle;

  protected endHandle!: Handle;

  protected indicator!: Indicator;

  constructor(options: ContinuousOptions) {
    super(deepAssign({}, Continuous.defaultOptions, options));
  }

  attributeChangedCallback(name: any, oldValue: any, newValue: any) {
    super.attributeChangedCallback?.(name, oldValue, newValue);
    if (name === 'orient') this.indicator.style.position = this.ifHorizontal('top', 'right');
  }

  public drawInner() {
    this.drawLabels();
    this.drawRail();
    this.drawHandles();
    this.createIndicator();
  }

  public get selection() {
    const { min, max, start, end } = this.style;
    return [start || min, end || max] as [number, number];
  }

  private get labelsCfg() {
    const { label } = this.style;
    return deepAssign({}, DEFAULT_LABEL_CFG, label || {});
  }

  private get railCfg(): Record<string, any> & { size: number; length: number } {
    const { rail } = this.style;
    return deepAssign({ size: 24, length: 200 }, DEFAULT_RAIL_CFG, rail || {});
  }

  private get handleCfg() {
    const { handle } = this.style;
    return deepAssign({}, DEFAULT_HANDLE_CFG, handle || {}, {
      textStyle: this.labelsCfg.style,
      spacing: this.labelsCfg.spacing,
      visibility: !handle ? 'hidden' : 'visible',
    });
  }

  // Condition if orient is equal to 'horizontal'.
  protected ifHorizontal<T>(a: T, b: T) {
    const { orient = 'horizontal' } = this.style;
    return ifHorizontal(orient, typeof a === 'function' ? a() : a, typeof b === 'function' ? b() : b);
  }

  protected get color(): string {
    const { color = [], orient = 'horizontal' } = this.style;
    const colors = Array.from(color);
    const count = colors.length;

    if (!count) return '';
    if (this.railCfg.chunked) return getChunkedColor(this.ticks, colors, orient);
    return colors.reduce((r, c, idx) => (r += ` ${idx / (count - 1)}:${c}`), `l(${this.ifHorizontal('0', '270')})`);
  }

  private get slidable() {
    return !!this.style.handle;
  }

  protected get ticks() {
    const { min, max } = this.style;
    return sortTicks([min, ...(this.railCfg.ticks || []), max]);
  }

  private drawRail() {
    const { orient, min, max } = this.style;
    const [s1, s2] = this.selection;
    this.rail = select(this.rail || this.innerGroup.appendChild(new Rail()))
      .attr('className', 'legend-rail')
      .call(applyStyle, { ...this.railCfg, fill: this.color, orient })
      .style('selection', this.slidable ? [(s1 - min) / (max - min), (s2 - min) / (max - min)] : undefined)
      .node() as Rail;
  }

  private drawLabels() {
    let labels: (TextStyleProps & { id: string })[] = [];
    const { min, max, orient = 'horizontal' } = this.style;
    if (!this.style.handle) {
      const { align, spacing, style } = this.labelsCfg;
      const { size } = this.railCfg;
      const id = (idx: number) => `legend-label-${idx}`;
      if (align === 'rail') {
        const styles = getRailLabels(orient, this.railCfg, spacing);
        labels = [
          { id: id(0), text: `${min}`, ...style, ...styles[0] },
          { id: id(1), text: `${max}`, ...style, ...styles[1] },
        ];
      } else {
        labels = this.ticks.map((tick: any, idx: number) => {
          const tickStyle = getTickStyle(orient, this.getOffset(tick), align, size, spacing);
          return { id: id(idx), text: `${tick}`, ...tickStyle, ...style };
        });
      }
    }

    select(this.labelsGroup)
      .selectAll('.legend-label')
      .data(labels, (d) => d.id)
      .join(
        (enter) => enter.append((style) => new Text({ className: 'legend-label', style })),
        (update) => update.each((shape, style) => shape.attr(style)),
        (exit) => exit.remove()
      );
  }

  private drawHandles() {
    const [min, max] = this.selection;
    this.startHandle = this.drawHandle('start', min);
    this.endHandle = this.drawHandle('end', max);
  }

  private drawHandle(type: string, value: number) {
    const { orient = 'horizontal' } = this.style;
    const { align, spacing } = this.labelsCfg;
    const { size } = this.railCfg;
    const { size: handleSize } = this.handleCfg;

    const offset = this.getOffset(value);
    const { dx: x, dy: y } = getTickStyle(orient, offset, align, size, -handleSize / 3);
    const textStyle = getTickStyle(orient, offset, align, size, align === 'start' ? spacing : handleSize / 3 + spacing);

    const handle = type === 'start' ? this.startHandle : this.endHandle;
    return select(handle || this.innerGroup.appendChild(new Handle({})))
      .attr('className', `legend-handle-${type}`)
      .call(applyStyle, {
        ...this.handleCfg,
        x,
        y,
        symbol: this.ifHorizontal('horizontalHandle', 'verticalHandle'),
        textStyle: {
          text: `${value ?? ''}`,
          x: +textStyle.dx - +x,
          y: +textStyle.dy - +y,
          textAlign: textStyle.textAlign,
          textBaseline: textStyle.textBaseline,
          ...this.handleCfg.textStyle,
        },
      })
      .node() as Handle;
  }

  private createIndicator() {
    this.indicator = this.appendChild(
      new Indicator({
        zIndex: 2,
        className: 'legend-indicator',
        style: { position: this.ifHorizontal('top', 'right') },
      })
    );
  }

  /** 当前交互的对象 */
  private target!: string | undefined;

  /** 上次鼠标事件的位置 */
  private prevValue!: number;

  public bindEvents() {
    super.bindEvents();
    // 如果！slidable，则不绑定事件或者事件响应不生效
    // // 放置需要绑定drag事件的对象
    const dragObject = new Map<string, DisplayObject>();
    dragObject.set('rail', this.rail);
    dragObject.set('start', this.startHandle);
    dragObject.set('end', this.endHandle);
    // 绑定 drag 开始事件
    dragObject.forEach((obj, key) => {
      obj.addEventListener('mousedown', this.onDragStart(key));
      obj.addEventListener('touchstart', this.onDragStart(key));
    });
    this.startHandle.addEventListener('mouseover', () => this.updateMouse());
    this.endHandle.addEventListener('mouseover', () => this.updateMouse());

    this.rail.addEventListener('mousemove', this.onHovering);
    this.addEventListener('mouseout', this.hideIndicator);
  }

  private onHovering = (e: any) => {
    e.stopPropagation();
    const value = this.getValueByCanvasPoint(e);
    if (get(this.attributes, ['rail', 'chunked'])) {
      const { range } = getNextTickValue(this.ticks, value);
      this.showIndicator((range[0] + range[1]) / 2, `${range[0]}-${range[1]}`);
      this.dispatchIndicated(value, range);
    } else {
      const safetyValue = this.getTickValue(value);
      this.showIndicator(safetyValue);
      this.dispatchIndicated(safetyValue);
    }
  };

  public showIndicator(value: number, text = `${value}`) {
    if (typeof value !== 'number') {
      this.hideIndicator();
      return;
    }

    this.indicator.show();
    const { min, max } = this.style;
    const safeValue = clamp(value, min, max);
    const offsetX = this.ifHorizontal(this.getOffset(safeValue), this.railCfg.size + 12);
    // todo consider size-rail.
    const offsetY = this.ifHorizontal(-14, this.getOffset(safeValue));
    const { x, y } = this.rail.getBBox();
    const { x: x0, y: y0 } = this.container.getBBox();
    const [dx, dy] = this.container.getLocalPosition();
    this.indicator.style.x = x - x0 + dx + offsetX;
    this.indicator.style.y = y - y0 + dy + offsetY;
    this.indicator.style.textStyle = { text };
  }

  private hideIndicator() {
    this.indicator?.hide();
  }

  private onDragStart = (target: string) => (e: any) => {
    e.stopPropagation();
    // 关闭滑动
    if (!this.slidable) return;
    this.target = target;
    this.prevValue = this.getTickValue(this.getValueByCanvasPoint(e));
    this.addEventListener('mousemove', this.onDragging);
    this.addEventListener('touchmove', this.onDragging);
    this.addEventListener('mouseleave', this.onDragEnd);
    this.addEventListener('mouseup', this.onDragEnd);
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
    else if (target === 'rail') {
      if (diffValue !== 0) {
        this.prevValue = currValue;
        this.updateSelection(diffValue, diffValue, true);
      }
    }
  };

  private onDragEnd() {
    this.style.cursor = 'default';
    this.removeEventListener('mousemove', this.onDragging);
    this.removeEventListener('touchmove', this.onDragging);
    document.removeEventListener('mouseup', this.onDragEnd);
    document.removeEventListener('touchend', this.onDragEnd);
  }

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
    const { min, max } = this.style;
    [start, end] = getSafetySelections([min, max], [start, end], this.selection);
    this.update({ start, end } as any);
    this.dispatchSelection();
  }

  private get step(): number {
    const { step, min, max } = this.attributes;
    if (isUndefined(step)) {
      return toPrecision((max - min) * STEP_RATIO, 0);
    }
    return step;
  }

  private getTickValue(value: number): number {
    if (this.railCfg.chunked) return getNextTickValue(this.ticks, value).tick;
    return getStepValueByValue(value, this.step, this.style.min);
  }

  /**
   * 事件触发的位置对应的value值
   * @param limit {boolean} 我也忘了要干啥了
   */
  private getValueByCanvasPoint(e: any, limit: boolean = false) {
    const { min, max, orient = 'horizontal' } = this.style;
    const [x, y] = this.rail.getPosition();
    const startPos = this.ifHorizontal(x, y);
    const currValue = this.ifHorizontal(...getEventPos(e));
    const offset = currValue - startPos;
    const value = clamp(this.getOffset(offset, true) + min, min, max);

    return value;
  }

  /** reverse: 屏幕偏移量 -> 值 */
  private getOffset(v: number, reverse = false) {
    const { min, max } = this.style;
    if (reverse) return (v * (max - min)) / this.railCfg.length;

    const ratio = max > min ? this.railCfg.length / (max - min) : 0;
    return toPrecision((v - min) * ratio, 2);
  }

  @throttle(20)
  private dispatchSelection() {
    const evt = new CustomEvent('valueChanged', {
      detail: {
        value: this.selection,
      },
    });
    this.dispatchEvent(evt as any);
  }

  @throttle(20)
  private dispatchIndicated(value: number, range?: unknown) {
    const evt = new CustomEvent('onIndicated', {
      detail: { value, range },
    });

    this.dispatchEvent(evt as any);
  }
}
