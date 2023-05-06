import { CustomEvent, type Cursor } from '@antv/g';
import { transition, type GenericAnimation } from '../../animation';
import { GUI } from '../../core';
import { Group, Rect, Text } from '../../shapes';
import {
  getEventPos,
  ifShow,
  parseSeriesAttr,
  select,
  subStyleProps,
  superStyleProps,
  toPrecision,
  type Selection,
} from '../../util';
import { Sparkline, type SparklineStyleProps } from '../sparkline';
import { CLASS_NAMES, HANDLE_DEFAULT_CFG, HANDLE_ICON_DEFAULT_CFG, HANDLE_LABEL_DEFAULT_CFG } from './constant';
import { Handle, type IconStyleProps, type LabelStyleProps } from './handle';
import type { SliderOptions, SliderStyleProps } from './types';

export type { SliderStyleProps, SliderOptions };

type HandleType = 'start' | 'end';

export class Slider extends GUI<SliderStyleProps> {
  public static tag = 'slider';

  private range = [0, 1];

  public get values(): [number, number] {
    return this.attributes.values as [number, number];
  }

  public set values(values: Required<SliderStyleProps>['values']) {
    this.attributes.values = this.clampValues(values);
  }

  // 背景、滑道
  private trackShape!: Selection<Rect>;

  private foregroundGroup!: Selection<Group>;

  // 前景、选区
  private selectionShape!: Selection<Rect>;

  // 开始滑块
  private startHandle?: Handle;

  // 结束滑块
  private endHandle?: Handle;

  /**
   * 选区开始的位置
   */
  private selectionStartPos: number;

  /**
   * 选区宽度
   */
  private selectionWidth: number;

  /**
   * 记录上一次鼠标事件所在坐标
   */
  private prevPos: number;

  /**
   * drag事件当前选中的对象
   */
  private target: string;

  private get sparklineStyle() {
    const { orientation } = this.attributes;
    if (orientation !== 'horizontal') return null;
    const attr = subStyleProps<SparklineStyleProps>(this.attributes, 'sparkline');
    return { zIndex: 0, ...this.availableSpace, ...attr };
  }

  private get shape() {
    const { trackLength, trackSize } = this.attributes;
    const [width, height] = this.getOrientVal([
      [trackLength, trackSize],
      [trackSize, trackLength],
    ]);
    return { width, height };
  }

  private get availableSpace() {
    const { padding } = this.attributes;
    const [top, right, bottom, left] = parseSeriesAttr(padding!);
    const { width, height } = this.shape;
    return {
      x: left,
      y: top,
      width: width! - (left + right),
      height: height! - (top + bottom),
    };
  }

  constructor(options: SliderOptions) {
    super(options, {
      animate: { duration: 100, fill: 'both' },
      brushable: true,
      formatter: (val: any) => val.toString(),
      handleSpacing: 2,
      orientation: 'horizontal',
      padding: 0,
      autoFitLabel: true,
      scrollable: true,
      selectionCursor: 'move',
      selectionFill: '#5B8FF9',
      selectionFillOpacity: 0.45,
      selectionZIndex: 2,
      showHandle: true,
      showLabel: true,
      slidable: true,
      trackFill: '#416180',
      trackLength: 200,
      trackOpacity: 0.05,
      trackSize: 20,
      trackZIndex: -1,
      values: [0, 1],
      ...superStyleProps(HANDLE_DEFAULT_CFG, 'handle'),
      ...superStyleProps(HANDLE_ICON_DEFAULT_CFG, 'handleIcon'),
      ...superStyleProps(HANDLE_LABEL_DEFAULT_CFG, 'handleLabel'),
    });

    this.selectionStartPos = 0;
    this.selectionWidth = 0;
    this.prevPos = 0;
    this.target = '';
  }

  public getValues() {
    return this.values as [number, number];
  }

  /** 不触发重绘 */
  public setValues(values: Required<SliderStyleProps>['values'] = [0, 0], animate: boolean = false) {
    this.attributes.values = values;
    const animation = animate === false ? false : this.attributes.animate;
    transition(this.selectionShape.node(), this.selectionStyle, animation);
    this.updateHandlesPosition(animation);
  }

  private updateHandlesPosition(animation: GenericAnimation) {
    if (!this.attributes.showHandle) return;
    transition(this.startHandle!, this.getHandleStyle('start'), animation);
    transition(this.endHandle!, this.getHandleStyle('end'), animation);
  }

  private innerSetValues(values: Required<SliderStyleProps>['values'] = [0, 0], trigger: boolean = false) {
    const oldValues = this.values;
    const newValues = this.clampValues(values);
    this.attr('values', newValues);
    this.setValues(newValues);
    if (trigger) {
      this.onValueChange(oldValues);
    }
  }

  private renderTrack(container: Group) {
    const { brushable } = this.attributes;
    const style = subStyleProps(this.attributes, 'track');

    this.trackShape = select(container)
      .maybeAppendByClassName(CLASS_NAMES.track, 'rect')
      .styles({ cursor: brushable ? 'crosshair' : 'default', ...this.shape, ...style });
  }

  private renderSparkline(container: Group) {
    const { orientation } = this.attributes;
    const sparklineGroup = select(container).maybeAppendByClassName(CLASS_NAMES.sparklineGroup, 'g');

    ifShow(orientation === 'horizontal', sparklineGroup, (group) => {
      const style = this.sparklineStyle!;
      group.maybeAppendByClassName(CLASS_NAMES.sparkline, () => new Sparkline({ style })).update(style);
    });
  }

  private get selectionStyle() {
    const style = subStyleProps(this.attributes, 'selection');
    return {
      ...style,
      ...this.calcMask(),
    };
  }

  private renderHandles() {
    const { showHandle } = this.attributes;
    const data = (showHandle ? (['start', 'end'] as HandleType[]) : []).map((type) => ({ type }));
    const that = this;
    this.foregroundGroup
      ?.selectAll(CLASS_NAMES.handle.class)
      .data(data, (d) => d.type)
      .join(
        (enter) =>
          enter
            .append(({ type }) => new Handle({ style: this.getHandleStyle(type) }))
            .each(function ({ type }) {
              this.attr('class', `${CLASS_NAMES.handle.name} ${type}-handle`);
              const name = `${type}Handle` as `${HandleType}Handle`;
              that[name] = this;
              this.addEventListener('pointerdown', (e: any) => {
                that.onDragStart(type)(e);
              });
            }),
        (update) =>
          update.each(function ({ type }) {
            this.update(that.getHandleStyle(type));
          }),
        (exit) =>
          exit
            .each(({ type }) => {
              const name = `${type}Handle` as `${HandleType}Handle`;
              that[name] = undefined;
            })
            .remove()
      );
  }

  private renderSelection(container: Group) {
    this.foregroundGroup = select(container).maybeAppendByClassName(CLASS_NAMES.foreground, 'g');

    this.selectionShape = this.foregroundGroup
      .maybeAppendByClassName(CLASS_NAMES.selection, 'rect')
      .styles(this.selectionStyle);

    this.renderHandles();
  }

  public render(attributes: SliderStyleProps, container: Group) {
    this.renderTrack(container);
    this.renderSparkline(container);
    this.renderSelection(container);
  }

  private clampValues(values?: [number, number], precision = 4): [number, number] {
    const [min, max] = this.range;
    const [prevStart, prevEnd] = this.getValues().map((num) => toPrecision(num, precision));
    let [startVal, endVal] = (values || [prevStart, prevEnd]).map((num) => toPrecision(num, precision));
    // 交换startVal endVal
    if (startVal > endVal) {
      [startVal, endVal] = [endVal, startVal];
    }
    const range = endVal - startVal;
    // 超出范围就全选
    if (range > max - min) return [min, max];

    if (startVal < min) {
      if (prevStart === min && prevEnd === endVal) return [min, endVal];
      return [min, range + min];
    }
    if (endVal > max) {
      if (prevEnd === max && prevStart === startVal) return [startVal, max];
      return [max - range, max];
    }

    // 保留小数
    return [startVal, endVal];
  }

  /**
   * 计算蒙板坐标和宽高
   * 默认用来计算前景位置大小
   */
  private calcMask(values?: [number, number]) {
    const [start, end] = this.clampValues(values);
    const { x, y, width, height } = this.availableSpace;

    return this.getOrientVal([
      {
        y,
        height,
        x: start * width + x,
        width: (end - start) * width,
      },
      {
        x,
        width,
        y: start * height + y,
        height: (end - start) * height,
      },
    ]);
  }

  /**
   * 计算手柄的x y
   */
  private calcHandlePosition(handleType: HandleType) {
    const { x, y, width, height } = this.availableSpace;
    const [stVal, endVal] = this.clampValues();
    const L = (handleType === 'start' ? stVal : endVal) * this.getOrientVal([width, height]);
    return {
      x: x + this.getOrientVal([L, width / 2]),
      y: y + this.getOrientVal([height / 2, L]),
    };
  }

  /**
   * 计算手柄应当处于的位置
   * @param handleType start手柄还是end手柄
   * @returns
   */
  private calcHandleText(handleType: HandleType) {
    const { orientation, formatter, autoFitLabel } = this.attributes;
    const handleStyle = subStyleProps(this.attributes, 'handle');
    const labelStyle = subStyleProps(handleStyle, 'label');
    const { spacing } = handleStyle;
    const size = this.getHandleSize();
    const values = this.clampValues();

    const value = handleType === 'start' ? values[0] : values[1];
    const text = formatter(value);

    const temp = new Text({
      style: {
        ...labelStyle,
        text,
      },
    });
    // 文字包围盒的宽高
    const { width: textWidth, height: textHeight } = temp.getBBox();
    temp.destroy();

    if (!autoFitLabel) {
      const finaleWidth = spacing + size + (orientation === 'horizontal' ? textWidth / 2 : 0);
      return { text, [orientation === 'horizontal' ? 'x' : 'y']: handleType === 'start' ? -finaleWidth : finaleWidth };
    }

    let x = 0;
    let y = 0;
    // 相对于获取两端可用空间
    const { width: iW, height: iH } = this.availableSpace;
    const { x: fX, y: fY, width: fW, height: fH } = this.calcMask();
    if (orientation === 'horizontal') {
      const totalSpacing = spacing + size;
      const finalWidth = totalSpacing + textWidth / 2;
      if (handleType === 'start') {
        const left = fX - totalSpacing - textWidth;
        x = left > 0 ? -finalWidth : finalWidth;
      } else {
        const sign = iW - fX - fW - totalSpacing > textWidth;
        x = sign ? finalWidth : -finalWidth;
      }
    } else {
      const finalWidth = spacing + size;
      if (handleType === 'start') {
        y = fY - size > textHeight ? -finalWidth : finalWidth;
      } else {
        y = iH - fY - fH - size > textHeight ? finalWidth : -finalWidth;
      }
    }
    return { x, y, text };
  }

  private getHandleLabelStyle(handleType: HandleType): LabelStyleProps {
    const { showLabel } = this.attributes;
    if (!showLabel) return {} as LabelStyleProps;
    const style = subStyleProps(this.attributes, 'handleLabel');
    return {
      ...style,
      ...this.calcHandleText(handleType),
    };
  }

  private getHandleIconStyle(): IconStyleProps {
    const { handleIconShape: shape } = this.attributes;
    const style = subStyleProps(this.attributes, 'handleIcon');
    const cursor = this.getOrientVal(['ew-resize', 'ns-resize']) as Cursor;
    const size = this.getHandleSize();

    return {
      cursor,
      shape,
      size,
      ...style,
    };
  }

  private getHandleStyle(handleType: HandleType) {
    const { showLabel, orientation } = this.attributes;
    const handlePosition = this.calcHandlePosition(handleType);
    const textStyle = this.calcHandleText(handleType);
    return {
      ...superStyleProps(this.getHandleIconStyle(), 'icon'),
      ...superStyleProps({ ...this.getHandleLabelStyle(handleType), ...textStyle }, 'label'),
      ...handlePosition,
      orientation,
      showLabel,
      type: handleType,
      zIndex: 3,
    } as const;
  }

  private getHandleSize() {
    const { handleIconSize: size, width, height } = this.attributes;
    if (size) return size;
    // 没设置 size 的话，高度就取 height + 4 高度，手柄宽度是高度的 1/ 2.4
    return Math.floor((this.getOrientVal([+height!, +width!]) + 4) / 2.4);
  }

  private getOrientVal<T>([x, y]: [T, T]): T {
    const { orientation } = this.attributes;
    return orientation === 'horizontal' ? x : y;
  }

  private setValuesOffset(stOffset: number, endOffset: number = 0, animate: boolean = false) {
    const [oldStartVal, oldEndVal] = this.getValues();
    const values = [oldStartVal + stOffset, oldEndVal + endOffset].sort() as [number, number];
    if (animate) this.setValues(values);
    else this.innerSetValues(values, true);
  }

  private getRatio(val: number) {
    const { width, height } = this.availableSpace;
    return val / this.getOrientVal([width, height]);
  }

  private dispatchCustomEvent(target: Selection, event: string, name: string) {
    target.on(event, (e: MouseEvent) => {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent(name, { detail: e }));
    });
  }

  public bindEvents() {
    const selection = this.selectionShape;
    // scroll 事件
    this.addEventListener('wheel', this.onScroll);
    // 选区drag事件
    selection.on('mousedown', this.onDragStart('selection'));
    selection.on('touchstart', this.onDragStart('selection'));
    // 选区hover事件
    this.dispatchCustomEvent(selection, 'mouseenter', 'selectionMouseenter');
    this.dispatchCustomEvent(selection, 'mouseleave', 'selectionMouseleave');
    this.dispatchCustomEvent(selection, 'click', 'selectionClick');
    const track = this.trackShape;
    this.dispatchCustomEvent(track, 'click', 'trackClick');
    this.dispatchCustomEvent(track, 'mouseenter', 'trackMouseenter');
    this.dispatchCustomEvent(track, 'mouseleave', 'trackMouseleave');
    // Drag and brush
    track.on('mousedown', this.onDragStart('track'));
    track.on('touchstart', this.onDragStart('track'));
  }

  private onScroll(event: WheelEvent) {
    const { scrollable } = this.attributes;
    if (scrollable) {
      const { deltaX, deltaY } = event;
      const offset = deltaY || deltaX;
      const deltaVal = this.getRatio(offset);

      this.setValuesOffset(deltaVal, deltaVal, true);
    }
  }

  private onDragStart = (target: string) => (e: any) => {
    e.stopPropagation();
    this.target = target;
    this.prevPos = this.getOrientVal(getEventPos(e));
    const { x, y } = this.availableSpace;
    const { x: X, y: Y } = this.attributes;
    this.selectionStartPos = this.getRatio(this.prevPos - this.getOrientVal([x, y]) - this.getOrientVal([+X!, +Y!]));
    this.selectionWidth = 0;
    document.addEventListener('mousemove', this.onDragging);
    document.addEventListener('touchmove', this.onDragging);
    document.addEventListener('mouseup', this.onDragEnd);
    document.addEventListener('touchend', this.onDragEnd);
  };

  private onDragging = (e: any) => {
    const { slidable, brushable } = this.attributes;
    e.stopPropagation();

    const currPos = this.getOrientVal(getEventPos(e));
    const diffPos = currPos - this.prevPos;

    if (!diffPos) return;
    const deltaVal = this.getRatio(diffPos);

    switch (this.target) {
      case 'start':
        if (slidable) this.setValuesOffset(deltaVal);
        break;
      case 'end':
        if (slidable) this.setValuesOffset(0, deltaVal);
        break;
      case 'selection':
        if (slidable) this.setValuesOffset(deltaVal, deltaVal);
        break;
      case 'track':
        if (!brushable) return;
        // 绘制蒙板
        this.selectionWidth += deltaVal;
        this.innerSetValues(
          [this.selectionStartPos, this.selectionStartPos + this.selectionWidth].sort() as [number, number],
          true
        );
        break;
      default:
        break;
    }

    this.prevPos = currPos;
  };

  private onDragEnd = () => {
    document.removeEventListener('mousemove', this.onDragging);
    document.removeEventListener('mousemove', this.onDragging);
    document.removeEventListener('mouseup', this.onDragEnd);
    document.removeEventListener('touchend', this.onDragEnd);
  };

  private onValueChange = (oldValue: [number, number]) => {
    const evt = new CustomEvent('valuechange', {
      detail: {
        oldValue,
        value: this.getValues(),
      },
    });
    this.dispatchEvent(evt);
  };
}
