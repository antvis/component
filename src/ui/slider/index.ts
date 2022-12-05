import type { Cursor } from '@antv/g';
import { Group, Rect, Text, CustomEvent } from '@antv/g';
import { deepMix, noop } from '@antv/util';
import { GUI } from '../../core/gui';
import type { Selection } from '../../util';
import {
  applyStyle,
  getEventPos,
  ifShow,
  normalPadding,
  prefixStyle,
  select,
  subObject,
  subObjects,
  TEXT_INHERITABLE_PROPS,
  toPrecision,
} from '../../util';
import type { SparklineStyleProps } from '../sparkline';
import { Sparkline } from '../sparkline';
import { HANDLE_DEFAULT_CFG, HANDLE_ICON_DEFAULT_CFG, HANDLE_LABEL_DEFAULT_CFG } from './constant';
import type { HandleStyleProps, IconStyleProps, LabelStyleProps } from './handle';
import { Handle } from './handle';
import type { SliderOptions, SliderStyleProps } from './types';

export type { SliderStyleProps, SliderOptions };

type HandleType = 'start' | 'end';

export class Slider extends GUI<SliderStyleProps> {
  public static tag = 'slider';

  private static defaultOptions = {
    type: Slider.tag,
    style: {
      values: [0, 1],
      length: 200,
      size: 20,
      orient: 'horizontal',
      backgroundZIndex: -1,
      backgroundCursor: 'crosshair',
      backgroundFill: '#416180',
      backgroundOpacity: 0.05,
      selectionCursor: 'move',
      selectionZIndex: 2,
      selectionFill: '#5B8FF9',
      selectionFillOpacity: 0.45,
      sparklinePadding: 1,
      padding: 0,
      showHandle: true,
      handleSpacing: 2,
      formatter: (val: string) => val,
      ...prefixStyle(HANDLE_DEFAULT_CFG, 'handle'),
      ...prefixStyle(HANDLE_ICON_DEFAULT_CFG, 'handleIcon'),
      ...prefixStyle(HANDLE_LABEL_DEFAULT_CFG, 'handleLabel'),
    } as SliderStyleProps,
  };

  private range = [0, 1];

  public get values() {
    return this.getAttribute('values') as [number, number];
  }

  public set values(values: SliderStyleProps['values']) {
    this.setAttribute('values', this.clampValues(values));
  }

  // 背景、滑道
  private backgroundShape!: Selection<Rect>;

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

  private get sparklineShapeCfg() {
    const { orient } = this.attributes;

    // 暂时只在水平模式下绘制
    if (orient !== 'horizontal') return null;

    const { padding, ...sparklineStyle } = subObject(this.attributes, 'sparkline');
    const [top, right, bottom, left] = normalPadding(padding!);
    const { width, height } = this.availableSpace;
    const { backgroundLineWidth = 0 } = this.attributes;
    const bkgLW = +backgroundLineWidth;
    return {
      x: bkgLW / 2 + left,
      y: bkgLW / 2 + top,
      ...sparklineStyle,
      zIndex: 0,
      width: width - bkgLW - left - right,
      height: height - bkgLW - top - bottom,
    } as SparklineStyleProps;
  }

  private get availableSpace() {
    const { padding, length, size } = this.attributes;
    const [top, right, bottom, left] = normalPadding(padding!);
    const [width, height] = this.getOrientVal([
      [length, size],
      [size, length],
    ]);
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

  public setValues(values: SliderStyleProps['values']) {
    this.values = values;
    this.update({ values });
  }

  public render(attributes: SliderStyleProps, container: Group) {
    const { orient } = attributes;
    const [selectionStyle, backgroundStyle] = subObjects(attributes, ['selection', 'background']);

    this.backgroundShape = select(container)
      .maybeAppendByClassName('slider-background', 'rect')
      .call(applyStyle, this.availableSpace)
      .call(applyStyle, backgroundStyle);

    const sparklineGroup = select(container).maybeAppendByClassName('slider-sparkline-group', 'group');

    ifShow(orient === 'horizontal', sparklineGroup, (group) => {
      const sparklineStyle = this.sparklineShapeCfg as SparklineStyleProps;
      group
        .maybeAppendByClassName('slider-sparkline', () => new Sparkline({ style: sparklineStyle }))
        .call((selection) => {
          (selection.node() as Sparkline).update(sparklineStyle);
        });
    });

    this.foregroundGroup = select(container).maybeAppendByClassName('slider-foreground', 'group');

    this.selectionShape = this.foregroundGroup
      .maybeAppendByClassName('slider-selection', 'rect')
      .call(applyStyle, this.calcMask())
      .call(applyStyle, selectionStyle);

    const createHandle = (type: any) => {
      const className = `${type}-handle`;
      const { x, y, ...style } = this.getHandleShapeCfg(type);
      const handle = this.foregroundGroup
        .maybeAppendByClassName(className, () => new Handle({ style }))
        .style('type', type)
        .update(style);
      handle.node().setLocalPosition(+x!, +y!);
      return handle;
    };
    this.startHandle = createHandle('start');
    this.endHandle = createHandle('end');
  }

  private clampValues(values = this.getValues(), precision = 4): [number, number] {
    // const { min, max } = this.attributes as { min: number; max: number };
    const [min, max] = this.range;
    const [prevStart, prevEnd] = this.getValues();
    let [startVal, endVal] = values || [prevStart, prevEnd];
    const range = endVal - startVal;
    // 交换startVal endVal
    if (startVal > endVal) {
      [startVal, endVal] = [endVal, startVal];
    }
    // 超出范围就全选
    if (range > max - min) {
      return [min, max];
    }

    if (startVal < min) {
      if (prevStart === min && prevEnd === endVal) {
        return [min, endVal];
      }
      return [min, range + min];
    }
    if (endVal > max) {
      if (prevEnd === max && prevStart === startVal) {
        return [startVal, max];
      }
      return [max - range, max];
    }

    // 保留小数
    return [toPrecision(startVal, precision), toPrecision(endVal, precision)];
  }

  /**
   * 计算蒙板坐标和宽高
   * 默认用来计算前景位置大小
   */
  private calcMask(values?: [number, number]) {
    const [start, end] = this.clampValues(values);
    const { width, height } = this.availableSpace;

    return this.getOrientVal([
      {
        y: 0,
        height,
        x: start * width,
        width: (end - start) * width,
      },
      {
        x: 0,
        width,
        y: start * height,
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
    const labelStyle = subObject(this.attributes, 'handleLabel');
    return {
      ...labelStyle,
      ...this.calcHandleText(handleType),
    };
  }

  private getHandleIconShapeCfg(): IconStyleProps {
    const { orient } = this.attributes as Required<Pick<SliderStyleProps, 'height' | 'orient'>>;
    const labelStyle = subObject(this.attributes, 'handleIcon');
    const cursor = this.getOrientVal(['ew-resize', 'ns-resize']) as Cursor;
    const size = this.getHandleSize();

    return {
      ...labelStyle,
      orient,
      cursor,
      size,
    };
  }

  private getHandleShapeCfg(handleType: HandleType): HandleStyleProps {
    const { showHandle } = this.attributes;
    const { x, y } = this.calcHandlePosition(handleType);
    const textCfg = this.calcHandleText(handleType);
    return {
      zIndex: 3,
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

  private setValuesOffset(stOffset: number, endOffset: number = 0) {
    const [oldStartVal, oldEndVal] = this.getValues();
    const newValue = [oldStartVal + stOffset, oldEndVal + endOffset].sort() as [number, number];
    this.setValues(newValue);
    this.onValueChange([oldStartVal, oldEndVal]);
  }

  private getRatio(val: number) {
    const { width, height } = this.availableSpace;
    return val / this.getOrientVal([width, height]);
  }

  public bindEvents() {
    const {
      onBackgroundMouseenter = noop,
      onBackgroundMouseleave = noop,
      onSelectionMouseenter = noop,
      onSelectionMouseleave = noop,
    } = this.attributes;
    const selection = this.selectionShape;
    // 选区drag事件
    selection.on('mousedown', this.onDragStart('selection'));
    selection.on('touchstart', this.onDragStart('selection'));
    // 选区hover事件
    this.dispatchEvent(new CustomEvent('selectionMouseenter'));
    selection.on('mouseenter', () => {
      onSelectionMouseenter(selection);
      this.dispatchEvent(new CustomEvent('selectionMouseenter'));
    });
    selection.on('mouseleave', () => {
      onSelectionMouseleave(selection);
      this.dispatchEvent(new CustomEvent('selectionMouseleave'));
    });

    const exceptHandleText = (target: any | null) => {
      return target && target.className !== '.handle-text';
    };

    [this.startHandle, this.endHandle].forEach((handle) => {
      const type = handle.node().attr('type');
      handle.on('mousedown', (e: any) => {
        exceptHandleText(e.target) && this.onDragStart(type)(e);
      });
      handle.on('touchstart', (e: any) => {
        exceptHandleText(e.target) && this.onDragStart(type)(e);
      });
    });
    const background = this.backgroundShape;
    // Drag and brush
    background.on('mousedown', this.onDragStart('background'));
    background.on('touchstart', this.onDragStart('background'));
    background.on('mouseenter', () => {
      onBackgroundMouseenter(background);
      this.dispatchEvent(new CustomEvent('backgroundMouseenter'));
    });
    background.on('mouseleave', () => {
      onBackgroundMouseleave(background);
      this.dispatchEvent(new CustomEvent('backgroundMouseleave'));
    });
  }

  private onDragStart = (target: string) => (e: any) => {
    e.stopPropagation();
    this.target = target;
    this.prevPos = this.getOrientVal(getEventPos(e));
    const { x, y } = this.availableSpace;
    const { x: X, y: Y } = this.attributes;
    this.selectionStartPos = this.getRatio(this.prevPos - this.getOrientVal([x, y]) - this.getOrientVal([+X!, +Y!]));
    this.selectionWidth = 0;
    this.addEventListener('mousemove', this.onDragging);
    this.addEventListener('touchmove', this.onDragging);
    document.addEventListener('mouseup', this.onDragEnd);
    document.addEventListener('touchend', this.onDragEnd);
  };

  private onDragging = (e: any) => {
    e.stopPropagation();
    const currPos = this.getOrientVal(getEventPos(e));
    const diffPos = currPos - this.prevPos;
    if (!diffPos) return;
    const dVal = this.getRatio(diffPos);

    switch (this.target) {
      case 'start':
        this.setValuesOffset(dVal);
        break;
      case 'end':
        this.setValuesOffset(0, dVal);
        break;
      case 'selection':
        this.setValuesOffset(dVal, dVal);
        break;
      case 'background':
        // 绘制蒙板
        this.selectionWidth += dVal;
        this.setValues(
          [this.selectionStartPos, this.selectionStartPos + this.selectionWidth].sort() as [number, number]
        );
        break;
      default:
        break;
    }

    this.prevPos = currPos;
  };

  private onDragEnd = () => {
    this.removeEventListener('mousemove', this.onDragging);
    this.removeEventListener('mousemove', this.onDragging);
    document.removeEventListener('mouseup', this.onDragEnd);
    document.removeEventListener('touchend', this.onDragEnd);
  };

  private onValueChange = (oldValue: [number, number]) => {
    const { onValueChange = noop } = this.attributes;
    onValueChange(this.getValues(), oldValue);
    const evt = new CustomEvent('valueChange', {
      detail: {
        oldValue,
        value: this.getValues(),
      },
    });
    this.dispatchEvent(evt);
  };
}
