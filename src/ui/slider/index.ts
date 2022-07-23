import type { Cursor } from '@antv/g';
import { Rect, Text, CustomEvent, Group } from '@antv/g';
import { deepMix, get } from '@antv/util';
import { BaseComponent } from '../../util/create';
import { Handle } from './handle';
import { Sparkline } from '../sparkline';
import {
  toPrecision,
  getShapeSpace,
  getEventPos,
  getStateStyle,
  normalPadding,
  maybeAppend,
  applyStyle,
} from '../../util';
import type { MarkerStyleProps } from '../marker';
import type { SparklineCfg } from '../sparkline';
import type { HandleStyleProps } from './handle';
import type { ShapeAttrs, RectProps } from '../../types';
import type { SliderCfg, SliderOptions, HandleCfg, Pair } from './types';

export type { SliderCfg, SliderOptions };

type HandleType = 'start' | 'end';
interface IBackgroundStyleCfg extends ShapeAttrs {
  lineWidth: number;
}

export class Slider extends BaseComponent<SliderCfg> {
  public static tag = 'slider';

  private static defaultOptions = {
    type: Slider.tag,
    style: {
      orient: 'horizontal',
      values: [0, 1],
      names: ['', ''] as Pair<string>,
      min: 0,
      max: 1,
      width: 200,
      height: 20,
      sparkline: {
        padding: [1, 1, 1, 1],
      },
      padding: [0, 0, 0, 0],
      selectionStyle: {
        active: {
          fill: '#ccdaf5',
        },
      },
      handle: {
        show: true,
        formatter: (val: string, value: number) => val,
        spacing: 10,
      },
    } as SliderCfg,
  };

  public get values() {
    return this.getAttribute('values') as Pair<number>;
  }

  public set values(values: SliderCfg['values']) {
    this.setAttribute('values', this.getSafetyValues(values));
  }

  public get names() {
    return this.getAttribute('names') as [string, string];
  }

  public set names(names: SliderCfg['names']) {
    this.setAttribute('names', names);
  }

  // 背景、滑道
  private backgroundShape!: Rect;

  // 迷你图
  private sparklineShape!: Sparkline;

  private foregroundGroup!: Group;

  // 前景、选区
  private selectionShape!: Rect;

  // 开始滑块
  private startHandle!: Handle;

  // 结束滑块
  private endHandle!: Handle;

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

  private get backgroundShapeCfg() {
    return {
      cursor: 'crosshair' as Cursor,
      zIndex: 0,
      ...this.availableSpace,
      ...this.getStyle('backgroundStyle'),
    };
  }

  private get sparklineShapeCfg() {
    const { orient, sparkline } = this.attributes;
    // 暂时只在水平模式下绘制
    // if (orient !== 'horizontal') {
    //   return {
    //     data: [[]],
    //   };
    // }
    const { padding, ...args } = sparkline!;
    const [top, right, bottom, left] = normalPadding(padding!);
    const { width, height } = this.availableSpace;
    const { lineWidth: bkgLW = 0 } = this.getStyle('backgroundStyle') as IBackgroundStyleCfg;
    return {
      x: bkgLW / 2 + left,
      y: bkgLW / 2 + top,
      ...args,
      zIndex: 0,
      width: width - bkgLW - left - right,
      height: height - bkgLW - top - bottom,
    } as SparklineCfg;
  }

  private get availableSpace() {
    const { padding, width, height } = this.attributes as {
      padding: number[];
      width: number;
      height: number;
    };
    const [top, right, bottom, left] = normalPadding(padding);
    return {
      x: left,
      y: top,
      width: width - (left + right),
      height: height - (top + bottom),
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
    return this.values;
  }

  public setValues(values: SliderCfg['values']) {
    this.values = values;
    this.update({ values });
  }

  public getNames() {
    return this.names;
  }

  public setNames(names: SliderCfg['names']) {
    this.names = names;
  }

  public render(attributes: SliderCfg, container: Group) {
    const { backgroundStyle, selectionStyle } = attributes;

    const group = maybeAppend(container, '.slider-background', 'rect')
      .attr('className', 'slider-background')
      .style('cursor', 'crosshair')
      .style('fill', '#416180')
      .style('fillOpacity', 0.05)
      .call(applyStyle, this.availableSpace)
      .call(applyStyle, getStateStyle(backgroundStyle))
      .node();
    this.backgroundShape = group;

    maybeAppend(group, '.slider-sparkline', () => new Sparkline({}))
      .attr('className', 'slider-sparkline')
      .call((selection) => {
        (selection.node() as Sparkline).update(this.sparklineShapeCfg);
      });

    const foreGroup = maybeAppend(group, '.slider-foreground', 'g').attr('className', 'slider-foreground').node();
    this.selectionShape = maybeAppend(foreGroup, '.slider-selection', 'rect')
      .attr('className', 'slider-selection')
      .style('cursor', 'move')
      .style('zIndex', 2)
      .style('fill', '#5B8FF9')
      .style('fillOpacity', 0.15)
      .call(applyStyle, this.calcMask())
      .call(applyStyle, getStateStyle(selectionStyle) || {})
      .node();

    const createHandle = (type: any) => {
      const className = `slider-${type}-handle`;
      return maybeAppend(foreGroup, `.${className}`, () => new Handle({ className }))
        .call((selection) => {
          (selection.node() as Handle).update(this.getHandleShapeCfg(type as any));
        })
        .node() as Handle;
    };
    this.startHandle = createHandle('start');
    this.endHandle = createHandle('end');
  }

  /**
   * 获得安全的Values
   */
  private getSafetyValues(values = this.getValues(), precision = 4): Pair<number> {
    const { min, max } = this.attributes as { min: number; max: number };
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
   * 获取style
   * @param name style名
   * @param isActive 是否是active style
   * @returns ShapeCfg
   */
  private getStyle(name: string | string[], state: 'default' | 'active' = 'default', handleType?: HandleType) {
    if (handleType) return this.getHandleCfg(handleType);
    return getStateStyle(get(this.attributes, name), state, true) as RectProps;
  }

  /**
   * 计算蒙板坐标和宽高
   * 默认用来计算前景位置大小
   */
  private calcMask(values?: Pair<number>) {
    const [start, end] = this.getSafetyValues(values);
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
    const [stVal, endVal] = this.getSafetyValues();
    const L = (handleType === 'start' ? stVal : endVal) * this.getOrientVal([width, height]);
    return {
      x: this.getOrientVal([L, width / 2]),
      y: this.getOrientVal([height / 2, L]),
    };
  }

  /**
   * 计算手柄应当处于的位置
   * @param name 手柄文字
   * @param handleType start手柄还是end手柄
   * @returns
   */
  private calcHandleText(handleType: HandleType) {
    const { orient, names } = this.attributes;
    const { spacing, formatter, textStyle } = this.getHandleCfg(handleType);
    const size = this.getHandleSize(handleType);
    const values = this.getSafetyValues();

    // 相对于获取两端可用空间
    const { width: iW, height: iH } = this.availableSpace;
    const { x: fX, y: fY, width: fW, height: fH } = this.calcMask();

    const [name, value] = handleType === 'start' ? [names[0], values[0]] : [names[1], values[1]];
    const formattedText = formatter(name, value);
    const temp = new Text({
      style: {
        ...textStyle,
        text: formattedText,
      },
    });
    // 文字包围盒的宽高
    const { width: textWidth, height: textHeight } = getShapeSpace(temp);
    temp.destroy();

    let x = 0;
    let y = 0;
    const R = size / 2;
    let textAlign = 'center';
    if (orient === 'horizontal') {
      const sh = spacing + R;
      const _ = sh + textWidth / 2;
      if (handleType === 'start') {
        const left = fX - sh - textWidth;
        x = left > 0 ? -_ : _;
        textAlign = left > 0 ? 'end' : 'start';
      } else {
        const sign = iW - fX - fW - sh > textWidth;
        x = sign ? _ : -_;
        textAlign = sign ? 'start' : 'end';
      }
    } else {
      const _ = spacing + R;
      if (handleType === 'start') {
        y = fY - R > textHeight ? -_ : _;
      } else {
        y = iH - fY - fH - R > textHeight ? _ : -_;
      }
    }
    return { x, y, text: formattedText, textAlign: textAlign as any };
  }

  private getHandleTextShapeCfg(handleType: HandleType) {
    const handleCfg = this.getHandleCfg(handleType);
    const { textStyle } = handleCfg;
    return {
      ...textStyle,
      ...this.calcHandleText(handleType),
    };
  }

  private getHandleIconShapeCfg(handleType: HandleType): HandleStyleProps['iconCfg'] {
    const { orient } = this.attributes as Required<Pick<SliderCfg, 'height' | 'orient'>>;
    const handleCfg = this.getHandleCfg(handleType);
    const { handleIcon, handleStyle: style } = handleCfg;
    const cursor = this.getOrientVal(['ew-resize', 'ns-resize']) as Cursor;
    const size = this.getHandleSize(handleType);
    let tempStyle!: Omit<HandleStyleProps['iconCfg'], 'type' | 'orient'>;
    let type!: 'default' | 'symbol';
    if (!handleIcon) {
      type = 'default';
      tempStyle = {
        ...style,
        cursor,
        size,
      };
    } else {
      type = 'symbol';
      // @ts-ignore
      tempStyle = {
        ...style,
        cursor,
        size,
        symbol: handleIcon,
      } as MarkerStyleProps;
    }

    return {
      orient,
      type,
      ...tempStyle,
    };
  }

  private getHandleShapeCfg(handleType: HandleType): HandleStyleProps {
    const handleCfg = this.getHandleCfg(handleType);
    const { x, y } = this.calcHandlePosition(handleType);
    const textCfg = this.calcHandleText(handleType);

    return {
      x,
      y,
      handleType,
      zIndex: 3,
      visibility: handleCfg?.show ? 'visible' : 'hidden',
      iconCfg: this.getHandleIconShapeCfg(handleType),
      textCfg: {
        ...this.getHandleTextShapeCfg(handleType),
        ...textCfg,
      },
    };
  }

  private getHandleCfg(handleType: HandleType): Required<HandleCfg> {
    const { start, end, ...rest } = get(this.attributes, 'handle');
    let handleCfg = {};
    if (handleType === 'start') {
      handleCfg = start;
    } else if (handleType === 'end') {
      handleCfg = end;
    }
    return deepMix({}, rest, handleCfg);
  }

  private getHandleSize(handleType: HandleType) {
    const { size } = this.getHandleCfg(handleType);
    if (size) return size;
    // 没设置 size 的话，高度就取 height + 4 高度，手柄宽度是高度的 1/ 2.4
    const { width, height } = this.attributes;
    return Math.floor((this.getOrientVal([height!, width!]) + 4) / 2.4);
  }

  private getOrientVal<T>([x, y]: Pair<T>): T {
    const { orient } = this.attributes;
    return orient === 'horizontal' ? x : y;
  }

  private setValuesOffset(stOffset: number, endOffset: number = 0) {
    const [oldStartVal, oldEndVal] = this.getValues();
    const newValue = [oldStartVal + stOffset, oldEndVal + endOffset].sort() as Pair<number>;
    this.setValues(newValue);
    this.onValueChanged([oldStartVal, oldEndVal]);
  }

  private getRatio(val: number) {
    const { width, height } = this.availableSpace;
    return val / this.getOrientVal([width, height]);
  }

  public bindEvents() {
    const selection = this.selectionShape;
    // 选区drag事件
    selection.addEventListener('mousedown', this.onDragStart('selection'));
    selection.addEventListener('touchstart', this.onDragStart('selection'));
    // 选区hover事件
    selection.addEventListener('mouseenter', this.onSelectionMouseenter);
    selection.addEventListener('mouseleave', this.onSelectionMouseleave);

    const exceptHandleText = (target: any | null) => {
      return target && target.className !== '.handle-text';
    };

    [this.startHandle, this.endHandle].forEach((handle) => {
      const { handleType } = handle.style;
      handle.addEventListener('mousedown', (e: any) => {
        const { target } = e;
        exceptHandleText(target) && this.onDragStart(handleType)(e);
      });
      handle.addEventListener('touchstart', (e: any) => {
        const { target } = e;
        exceptHandleText(target) && this.onDragStart(handleType)(e);
      });
    });

    // Drag and brush
    this.backgroundShape.addEventListener('mousedown', this.onDragStart('background'));
    this.backgroundShape.addEventListener('touchstart', this.onDragStart('background'));
  }

  private onSelectionMouseenter = () => {
    this.selectionShape.attr(this.getStyle('selectionStyle') as RectProps);
  };

  private onSelectionMouseleave = () => {
    this.selectionShape.attr(this.getStyle('selectionStyle') as RectProps);
  };

  private onDragStart = (target: string) => (e: any) => {
    e.stopPropagation();
    this.target = target;
    this.prevPos = this.getOrientVal(getEventPos(e));
    const { x, y } = this.availableSpace;
    const { x: X, y: Y } = this.attributes;
    this.selectionStartPos = this.getRatio(this.prevPos - this.getOrientVal([x, y]) - this.getOrientVal([X!, Y!]));
    this.selectionWidth = 0;
    this.addEventListener('mousemove', this.onDragging);
    this.addEventListener('touchmove', this.onDragging);
    document.addEventListener('mouseup', this.onDragEnd);
    document.addEventListener('touchend', this.onDragEnd);
  };

  private onDragging = (e: any) => {
    e.stopPropagation();
    const currPos = this.getOrientVal(getEventPos(e));
    const _ = currPos - this.prevPos;
    if (!_) return;
    const dVal = this.getRatio(_);

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
        this.setValues([this.selectionStartPos, this.selectionStartPos + this.selectionWidth].sort() as Pair<number>);
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

  private onValueChanged = (oldValue: [number, number]) => {
    const evt = new CustomEvent('valueChanged', {
      detail: {
        oldValue,
        value: this.getValues(),
      },
    });
    this.dispatchEvent(evt);
  };
}
