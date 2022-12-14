import { CustomEvent, Group, Rect, Text, type Cursor } from '@antv/g';
import { deepMix } from '@antv/util';
import { GUI } from '../../core/gui';
import {
  applyStyle,
  getEventPos,
  ifShow,
  normalPadding,
  prefixStyle,
  select,
  subObject,
  TEXT_INHERITABLE_PROPS,
  toPrecision,
  transition,
  type Selection,
} from '../../util';
import { Sparkline, type SparklineStyleProps } from '../sparkline';
import { HANDLE_DEFAULT_CFG, HANDLE_ICON_DEFAULT_CFG, HANDLE_LABEL_DEFAULT_CFG } from './constant';
import { Handle, type HandleStyleProps, type IconStyleProps, type LabelStyleProps } from './handle';
import type { SliderOptions, SliderStyleProps } from './types';

export type { SliderStyleProps, SliderOptions };

type HandleType = 'start' | 'end';

export class Slider extends GUI<SliderStyleProps> {
  public static tag = 'slider';

  private static defaultOptions = {
    type: Slider.tag,
    style: {
      values: [0, 1],
      trackLength: 200,
      trackSize: 20,
      slidable: true,
      brushable: true,
      scrollable: true,
      orient: 'horizontal',
      trackZIndex: -1,
      trackFill: '#416180',
      trackOpacity: 0.05,
      selectionCursor: 'move',
      selectionZIndex: 2,
      selectionFill: '#5B8FF9',
      selectionFillOpacity: 0.45,
      sparklinePadding: 1,
      padding: 0,
      showHandle: true,
      showLabel: true,
      handleSpacing: 2,
      formatter: (val: string) => val,
      ...prefixStyle(HANDLE_DEFAULT_CFG, 'handle'),
      ...prefixStyle(HANDLE_ICON_DEFAULT_CFG, 'handleIcon'),
      ...prefixStyle(HANDLE_LABEL_DEFAULT_CFG, 'handleLabel'),
    } as SliderStyleProps,
  };

  private range = [0, 1];

  public get values(): [number, number] {
    return this.getAttribute('values') as [number, number];
  }

  public set values(values: SliderStyleProps['values']) {
    this.setAttribute('values', this.clampValues(values));
  }

  // 背景、滑道
  private trackShape!: Selection<Rect>;

  // 迷你图
  private sparklineShape!: Selection;

  private foregroundGroup!: Selection<Group>;

  // 前景、选区
  private selectionShape!: Selection<Rect>;

  // 开始滑块
  private startHandle!: Selection;

  // 结束滑块
  private endHandle!: Selection;

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

  private animation: any = {
    duration: 100,
    fill: 'both',
  };

  private get sparklineShapeCfg() {
    const { orient } = this.attributes;

    // 暂时只在水平模式下绘制
    if (orient !== 'horizontal') return null;

    const { padding, ...sparklineStyle } = subObject(this.attributes, 'sparkline');
    const [top, right, bottom, left] = normalPadding(padding!);
    const { width, height } = this.availableSpace;
    const { trackLineWidth = 0 } = this.attributes;
    const bkgLW = +trackLineWidth;
    return {
      x: bkgLW / 2 + left,
      y: bkgLW / 2 + top,
      ...sparklineStyle,
      zIndex: 0,
      width: width - bkgLW - left - right,
      height: height - bkgLW - top - bottom,
    } as SparklineStyleProps;
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
    const [top, right, bottom, left] = normalPadding(padding!);
    const { width, height } = this.shape;
    return {
      x: left,
      y: top,
      width: width! - (left + right),
      height: height! - (top + bottom),
    };
  }

  constructor(options: SliderOptions) {
    super(deepMix({}, Slider.defaultOptions, options));

    this.selectionStartPos = 0;
    this.selectionWidth = 0;
    this.prevPos = 0;
    this.target = '';
  }

  public getValues() {
    return this.values as [number, number];
  }

  /** 不触发重绘 */
  public setValues(values: SliderStyleProps['values'] = [0, 0], animate: boolean = false) {
    this.attr('values', values);
    transition(this.selectionShape.node(), this.selectionCfg, this.animation, animate);
    transition(this.startHandle.node(), this.getHandleShapeCfg('start'), this.animation, animate);
    transition(this.endHandle.node(), this.getHandleShapeCfg('end'), this.animation, animate);
  }

  private _setValues(values: SliderStyleProps['values'] = [0, 0], trigger: boolean = false) {
    const oldValues = this.values;
    const newValues = this.clampValues(values);
    this.update({ values: newValues });
    if (trigger) {
      this.onValueChange(oldValues);
    }
  }

  private renderTrack(container: Group) {
    const { brushable } = this.attributes;
    const trackStyle = subObject(this.attributes, 'track');

    this.trackShape = select(container)
      .maybeAppendByClassName('slider-track', 'rect')
      .call(applyStyle, { ...this.shape, ...trackStyle })
      .style('cursor', brushable ? 'crosshair' : 'default');
  }

  private renderSparkline(container: Group) {
    const { orient } = this.attributes;
    const sparklineGroup = select(container).maybeAppendByClassName('slider-sparkline-group', 'g');
    ifShow(orient === 'horizontal', sparklineGroup, (group) => {
      const sparklineStyle = this.sparklineShapeCfg as SparklineStyleProps;
      group
        .maybeAppendByClassName('slider-sparkline', () => new Sparkline({ style: sparklineStyle }))
        .call((selection) => {
          (selection.node() as Sparkline).update(sparklineStyle);
        });
    });
  }

  private get selectionCfg() {
    const selectionStyle = subObject(this.attributes, 'selection');
    return {
      ...selectionStyle,
      ...this.calcMask(),
    };
  }

  private renderSelection(container: Group) {
    this.foregroundGroup = select(container).maybeAppendByClassName('slider-foreground', 'g');

    this.selectionShape = this.foregroundGroup
      .maybeAppendByClassName('slider-selection', 'rect')
      .call(applyStyle, this.selectionCfg);

    const createHandle = (type: any) => {
      const className = `${type}-handle`;
      const style = this.getHandleShapeCfg(type);
      const handle = this.foregroundGroup
        .maybeAppendByClassName(className, () => new Handle({ style }))
        .style('type', type)
        .update(style);
      return handle;
    };
    this.startHandle = createHandle('start');
    this.endHandle = createHandle('end');
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
    const { width, height } = this.availableSpace;
    const [stVal, endVal] = this.clampValues();
    const L = (handleType === 'start' ? stVal : endVal) * this.getOrientVal([width, height]);
    return {
      x: this.getOrientVal([L, width / 2]),
      y: this.getOrientVal([height / 2, L]),
    };
  }

  /**
   * 计算手柄应当处于的位置
   * @param handleType start手柄还是end手柄
   * @returns
   */
  private calcHandleText(handleType: HandleType) {
    const { orient, formatter } = this.attributes;
    const handleStyle = subObject(this.attributes, 'handle');
    const labelStyle = subObject(handleStyle, 'label');
    const { spacing } = handleStyle;
    const size = this.getHandleSize();
    const values = this.clampValues();

    // 相对于获取两端可用空间
    const { width: iW, height: iH } = this.availableSpace;
    const { x: fX, y: fY, width: fW, height: fH } = this.calcMask();
    const value = handleType === 'start' ? values[0] : values[1];
    const formattedText = formatter!(value);
    const temp = this.appendChild(
      new Text({
        style: {
          visibility: 'hidden',
          ...TEXT_INHERITABLE_PROPS,
          ...labelStyle,
          text: formattedText,
        },
      })
    );
    // 文字包围盒的宽高
    const { width: textWidth, height: textHeight } = temp.getBBox();
    temp.destroy();

    let x = 0;
    let y = 0;
    if (orient === 'horizontal') {
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
    return { x, y, text: formattedText };
  }

  private getHandleLabelShapeCfg(handleType: HandleType): LabelStyleProps {
    const { showLabel } = this.attributes;
    if (!showLabel) return {} as LabelStyleProps;
    const labelStyle = subObject(this.attributes, 'handleLabel');
    return {
      ...labelStyle,
      ...this.calcHandleText(handleType),
    };
  }

  private getHandleIconShapeCfg(): IconStyleProps {
    const { orient, handleIconShape } = this.attributes;
    const labelStyle = subObject(this.attributes, 'handleIcon');
    const cursor = this.getOrientVal(['ew-resize', 'ns-resize']) as Cursor;
    const size = this.getHandleSize();

    return {
      ...labelStyle,
      shape: handleIconShape,
      orient,
      cursor,
      size,
    };
  }

  private getHandleShapeCfg(handleType: HandleType): HandleStyleProps {
    const { showHandle, showLabel } = this.attributes;
    const { x, y } = this.calcHandlePosition(handleType);
    const textCfg = this.calcHandleText(handleType);
    return {
      zIndex: 3,
      showLabel,
      visibility: showHandle ? 'visible' : 'hidden',
      ...prefixStyle(this.getHandleIconShapeCfg(), 'icon'),
      ...prefixStyle({ ...this.getHandleLabelShapeCfg(handleType), ...textCfg }, 'label'),
      x,
      y,
    };
  }

  private getHandleSize() {
    const { handleIconSize: size } = this.attributes;
    if (size) return size;
    // 没设置 size 的话，高度就取 height + 4 高度，手柄宽度是高度的 1/ 2.4
    const { width, height } = this.attributes;
    return Math.floor((this.getOrientVal([+height!, +width!]) + 4) / 2.4);
  }

  private getOrientVal<T>([x, y]: [T, T]): T {
    const { orient } = this.attributes;
    return orient === 'horizontal' ? x : y;
  }

  private setValuesOffset(stOffset: number, endOffset: number = 0, animate: boolean = false) {
    const [oldStartVal, oldEndVal] = this.getValues();
    const values = [oldStartVal + stOffset, oldEndVal + endOffset].sort() as [number, number];
    if (animate) this.setValues(values);
    else this._setValues(values, true);
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

    [this.startHandle, this.endHandle].forEach((handle) => {
      const type = handle.node().attr('type');
      handle.on('mousedown', (e: any) => {
        this.onDragStart(type)(e);
      });
      handle.on('touchstart', (e: any) => {
        this.onDragStart(type)(e);
      });
    });
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
        this._setValues(
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
