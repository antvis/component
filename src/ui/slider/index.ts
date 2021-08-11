import type { Cursor } from '@antv/g';
import { Rect, Text, CustomEvent } from '@antv/g';
import { deepMix, get } from '@antv/util';
import { GUI } from '../core/gui';
import { Handle } from './handle';
import { Sparkline } from '../sparkline';
import { toPrecision, getShapeSpace, getEventPos, getStateStyle } from '../../util';
import type { SparklineCfg } from '../sparkline';
import type { IHandleCfg } from './handle';
import type { ShapeAttrs, RectProps } from '../../types';
import type { SliderCfg, SliderOptions, HandleCfg, Pair } from './types';

export type { SliderCfg, SliderOptions };

type HandleType = 'start' | 'end';
type HandleName = 'startHandle' | 'endHandle';
interface IBackgroundStyleCfg extends ShapeAttrs {
  lineWidth: number;
}

export class Slider extends GUI<SliderCfg> {
  public static tag = 'slider';

  /**
   * 层级关系
   * backgroundShape
   *  |- sparklineShape
   *  |- foregroundShape
   *       |- startHandle
   *           |- handleIcon
   *           |- handleText
   *       |- endHandle
   *           |- handleIcon
   *           |- handleText
   */

  // 背景、滑道
  private backgroundShape: Rect;

  // 迷你图
  private sparklineShape: Sparkline;

  // 前景、选区
  private foregroundShape: Rect;

  // 开始滑块
  private startHandle: Handle;

  // 结束滑块
  private endHandle: Handle;

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

  constructor(options: SliderOptions) {
    super(deepMix({}, Slider.defaultOptions, options));
    this.backgroundShape = new Rect({
      name: 'background',
      style: this.getBackgroundShapeCfg(),
    });
    this.backgroundShape.toBack();
    this.appendChild(this.backgroundShape);

    this.foregroundShape = new Rect({
      name: 'foreground',
      style: this.getForegroundShapeCfg(),
    });
    this.backgroundShape.appendChild(this.foregroundShape);

    this.startHandle = this.createHandle('start');
    this.foregroundShape.appendChild(this.startHandle);

    this.endHandle = this.createHandle('end');
    this.foregroundShape.appendChild(this.endHandle);

    this.sparklineShape = new Sparkline({
      name: 'sparkline',
      style: this.getSparklineShapeCfg(),
    });
    this.backgroundShape.appendChild(this.sparklineShape);

    this.selectionStartPos = 0;
    this.selectionWidth = 0;
    this.prevPos = 0;
    this.target = '';

    this.init();
  }

  private static defaultOptions = {
    type: Slider.tag,
    style: {
      orient: 'horizontal',
      values: [0, 1],
      names: ['', ''],
      min: 0,
      max: 1,
      width: 200,
      height: 20,
      sparklineCfg: {
        padding: [1, 1, 1, 1],
      },
      padding: [0, 0, 0, 0],
      backgroundStyle: {
        default: {
          fill: '#fff',
          stroke: '#e4eaf5',
          lineWidth: 1,
        },
      },
      foregroundStyle: {
        default: {
          fill: '#afc9fb',
          opacity: 0.5,
          stroke: '#afc9fb',
          lineWidth: 1,
        },
        active: {
          fill: '#ccdaf5',
        },
      },
      handle: {
        show: true,
        formatter: (val: string) => val,
        spacing: 10,
        textStyle: {
          fill: '#63656e',
          textAlign: 'center',
          textBaseline: 'middle',
        },
        handleStyle: {
          stroke: '#c5c5c5',
          fill: '#fff',
          lineWidth: 1,
        },
      },
    },
  };

  attributeChangedCallback<Key extends keyof SliderCfg>(name: Key, oldValue: SliderCfg[Key], newValue: SliderCfg[Key]) {
    if (name === 'values') {
      const evt = new CustomEvent('valueChange', {
        detail: {
          oldValue,
          value: newValue,
        },
      });
      this.dispatchEvent(evt);
    }
    if (name in ['names', 'values']) {
      this.setHandle();
    }
  }

  public getValues() {
    return this.getAttribute('values') as Pair<number>;
  }

  public setValues(values: SliderCfg['values']) {
    this.setAttribute('values', this.getSafetyValues(values));
  }

  public getNames() {
    return this.getAttribute('names');
  }

  public setNames(names: SliderCfg['names']) {
    this.setAttribute('names', names);
  }

  public init() {
    this.bindEvents();
  }

  /**
   * 组件的更新
   */
  public update(cfg: Partial<SliderCfg>) {
    this.attr(deepMix({}, this.attributes, cfg));

    this.backgroundShape.attr(this.getBackgroundShapeCfg());
    this.sparklineShape.update(this.getSparklineShapeCfg());
    this.foregroundShape.attr(this.getForegroundShapeCfg());

    this.startHandle.update(this.getHandleShapeCfg('start'));
    this.endHandle.update(this.getHandleShapeCfg('end'));
  }

  /**
   * 组件的清除
   */
  public clear() {}

  /**
   * 获得安全的Values
   */
  private getSafetyValues(values = this.getValues(), precision = 4): Pair<number> {
    const { min, max } = this.attributes;
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

  private getAvailableSpace() {
    const { padding, width, height } = this.attributes;
    const [top, right, bottom, left] = padding;
    return {
      x: left,
      y: top,
      width: width - (left + right),
      height: height - (top + bottom),
    };
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

  private getBackgroundShapeCfg() {
    return {
      cursor: 'crosshair' as Cursor,
      ...this.getAvailableSpace(),
      ...this.getStyle('backgroundStyle'),
    };
  }

  private getSparklineShapeCfg() {
    const { orient, sparklineCfg } = this.attributes;
    // 暂时只在水平模式下绘制
    // if (orient !== 'horizontal') {
    //   return {
    //     data: [[]],
    //   };
    // }
    const { padding, ...args } = sparklineCfg;
    const [top, right, bottom, left] = padding;
    const { width, height } = this.getAvailableSpace();
    const { lineWidth: bkgLW } = this.getStyle('backgroundStyle') as IBackgroundStyleCfg;
    return {
      x: bkgLW / 2 + left,
      y: bkgLW / 2 + top,
      ...args,
      width: width - bkgLW - left - right,
      height: height - bkgLW - top - bottom,
    } as SparklineCfg;
  }

  /**
   * 计算蒙板坐标和宽高
   * 默认用来计算前景位置大小
   */
  private calcMask(values?: Pair<number>) {
    const [start, end] = this.getSafetyValues(values);
    const { width, height } = this.getAvailableSpace();

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

  private getForegroundShapeCfg() {
    return { cursor: 'move' as Cursor, ...this.calcMask(), ...this.getStyle('foregroundStyle') };
  }

  /**
   * 计算手柄的x y
   */
  private calcHandlePosition(handleType: HandleType) {
    const { width, height } = this.getAvailableSpace();
    const values = this.getSafetyValues();
    const L = handleType === 'start' ? 0 : (values[1] - values[0]) * this.getOrientVal([width, height]);
    return {
      x: this.getOrientVal([L, width / 2]),
      y: this.getOrientVal([height / 2, L]),
    };
  }

  /**
   * 设置选区
   * 1. 设置前景大小及位置
   * 2. 设置手柄位置
   * 3. 更新文本位置
   */
  private setHandle() {
    this.foregroundShape.attr(this.calcMask());
    (['start', 'end'] as HandleType[]).forEach((handleType) => {
      const handle = this[`${handleType}Handle` as HandleName];
      handle.setHandle(this.calcHandlePosition(handleType));
      handle.setHandleText(this.calcHandleText(handleType));
    });
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
    const { width: iW, height: iH } = this.getAvailableSpace();
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
    if (orient === 'horizontal') {
      const sh = spacing + R;
      const _ = sh + textWidth / 2;
      if (handleType === 'start') {
        const left = fX - sh - textWidth;
        x = left > 0 ? -_ : _;
      } else {
        x = iW - fX - fW - sh > textWidth ? _ : -_;
      }
    } else {
      const _ = spacing + R;
      if (handleType === 'start') {
        y = fY - R > textHeight ? -_ : _;
      } else {
        y = iH - fY - fH - R > textHeight ? _ : -_;
      }
    }
    return { x, y, text: formattedText };
  }

  private getHandleTextShapeCfg(handleType: HandleType) {
    const handleCfg = this.getHandleCfg(handleType);
    const { textStyle } = handleCfg;
    return {
      ...textStyle,
      ...this.calcHandleText(handleType),
    };
  }

  private getHandleIconShapeCfg(handleType: HandleType): IHandleCfg['iconCfg'] {
    const { height: H, orient } = this.attributes;
    const handleCfg = this.getHandleCfg(handleType);
    const { show, handleIcon, handleStyle: style } = handleCfg;
    const cursor = this.getOrientVal(['ew-resize', 'ns-resize']) as Cursor;
    const size = this.getHandleSize(handleType);
    if (!show) {
      // 不显示handleIcon
      return {
        orient,
        type: 'hide',
        style: {
          cursor,
          x: -size / 2,
          y: -H / 2,
          height: H,
          width: size,
          opacity: 0,
          fill: 'red',
        },
      };
    }
    if (!handleIcon) {
      // 默认handleIcon
      return {
        type: 'default',
        orient,
        style: {
          ...style,
          cursor,
          size,
        },
      };
    }
    // 使用symbol
    return {
      orient,
      type: 'symbol',
      style: {
        ...style,
        cursor,
        r: size,
        symbol: handleIcon,
      },
    };
  }

  private getHandleShapeCfg(handleType: HandleType) {
    return {
      handleType,
      ...this.calcHandlePosition(handleType),
      iconCfg: this.getHandleIconShapeCfg(handleType),
      textCfg: this.getHandleTextShapeCfg(handleType),
    };
  }

  /**
   * 创建手柄
   */
  private createHandle(handleType: HandleType) {
    return new Handle({
      name: `handle`,
      style: this.getHandleShapeCfg(handleType),
    });
  }

  private getHandleCfg(handleType: HandleType): Required<HandleCfg> {
    const { start, end, ...args } = get(this.attributes, 'handle');
    let handleCfg = {};
    if (handleType === 'start') {
      handleCfg = start;
    } else if (handleType === 'end') {
      handleCfg = end;
    }
    return deepMix({}, args, handleCfg);
  }

  private getHandleSize(handleType: HandleType) {
    const handleCfg = this.getHandleCfg(handleType);
    const { size } = handleCfg;
    if (size) return size;

    // 没设置size的话，高度就取height的80%高度，手柄宽度是高度的1/2.4
    const { width, height } = this.attributes;
    return (this.getOrientVal([height, width]) * 0.8) / 2.4;
  }

  private bindEvents() {
    // Drag and brush
    this.backgroundShape.addEventListener('mousedown', this.onDragStart('background'));
    this.backgroundShape.addEventListener('touchstart', this.onDragStart('background'));

    const fg = this.foregroundShape;
    // 选区drag事件
    fg.addEventListener('mousedown', this.onDragStart('foreground'));
    fg.addEventListener('touchstart', this.onDragStart('foreground'));
    // 选区hover事件
    fg.addEventListener('mouseenter', () => {
      fg.attr(this.getStyle('foregroundStyle'));
    });
    fg.addEventListener('mouseleave', () => {
      fg.attr(this.getStyle('foregroundStyle'));
    });

    [this.startHandle, this.endHandle].forEach((handle) => {
      const handleType = handle.getType();
      const handleIcon = handle.getIcon();
      // 手柄按下开始drag
      handleIcon.addEventListener('mousedown', this.onDragStart(handleType));
      handleIcon.addEventListener('touchstart', this.onDragStart(handleType));

      // icon hover事件
      handleIcon.addEventListener('mouseenter', () => {
        handleIcon.attr(this.getStyle('handleStyle', 'active', handleType));
      });
      handleIcon.addEventListener('mouseleave', () => {
        handleIcon.attr(this.getStyle('handleStyle', 'default', handleType));
      });
    });
  }

  private getOrientVal<T>([x, y]: Pair<T>): T {
    const { orient } = this.attributes;
    return orient === 'horizontal' ? x : y;
  }

  private setValuesOffset(stOffset: number, endOffset: number = 0) {
    const [oldStartVal, oldEndVal] = this.getValues();
    this.setValues([oldStartVal + stOffset, oldEndVal + endOffset].sort() as Pair<number>);
  }

  private getRatio(val: number) {
    const { width, height } = this.getAvailableSpace();
    return val / this.getOrientVal([width, height]);
  }

  private onDragStart = (target: string) => (e: any) => {
    e.stopPropagation();
    this.target = target;
    this.prevPos = this.getOrientVal(getEventPos(e));
    const { x, y } = this.getAvailableSpace();
    const { x: X, y: Y } = this.attributes;
    this.selectionStartPos = this.getRatio(this.prevPos - this.getOrientVal([x, y]) - this.getOrientVal([X, Y]));
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
      case 'foreground':
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
}
