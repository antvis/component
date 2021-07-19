import { Rect, Text, DisplayObject } from '@antv/g';
import { deepMix, get } from '@antv/util';
import { GUI } from '../core/gui';
import { Handle } from './handle';
import { toPrecision } from '../../util';
import { Sparkline } from '../sparkline';
import type { SliderAttrs, SliderOptions, HandleCfg, Pair } from './types';

export { SliderAttrs, SliderOptions };

type HandleType = 'start' | 'end';

export class Slider extends GUI<SliderAttrs> {
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
  private backgroundShape: DisplayObject;

  // 迷你图
  private sparklineShape: Sparkline;

  // 前景、选区
  private foregroundShape: DisplayObject;

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
    this.init();
  }

  private static defaultOptions = {
    type: Slider.tag,
    attrs: {
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
        fill: '#fff',
        stroke: '#e4eaf5',
        lineWidth: 1,
      },
      foregroundStyle: {
        fill: '#afc9fb',
        opacity: 0.5,
        stroke: '#afc9fb',
        lineWidth: 1,
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

  attributeChangedCallback(name: string, value: any) {
    if (name === 'values') {
      this.emit('valuechange', value);
    }
    if (name in ['names', 'values']) {
      this.setHandle();
    }
  }

  public getValues() {
    return this.getAttribute('values');
  }

  public setValues(values: SliderOptions['values']) {
    this.setAttribute('values', this.getSafetyValues(values));
  }

  public getNames() {
    return this.getAttribute('names');
  }

  public setNames(names: SliderOptions['names']) {
    this.setAttribute('names', names);
  }

  public init() {
    this.createBackground();
    this.createSparkline();
    this.createForeground();
    this.createHandles();
    this.bindEvents();
  }

  /**
   * 组件的更新
   */
  public update(attrs: SliderAttrs) {
    this.attr(deepMix({}, this.attributes, attrs));
    this.backgroundShape.attr(this.getBackgroundAttrs());
    this.sparklineShape.update(this.getSparklineAttrs());
    this.foregroundShape.attr(this.getForegroundAttrs());
    this.startHandle.attr(this.getHandleAttrs('start'));
    this.endHandle.attr(this.getHandleAttrs('end'));
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
   * @returns ShapeAttrs
   */
  private getStyle(name: string | string[], isActive?: boolean, handleType?: HandleType) {
    const { active, ...args } = get(handleType ? this.getHandleCfg(handleType) : this.attributes, name);
    if (isActive) {
      return active || {};
    }
    return args?.default || args;
  }

  private getBackgroundAttrs() {
    return {
      cursor: 'crosshair',
      ...this.getAvailableSpace(),
      ...this.getStyle('backgroundStyle'),
    };
  }

  private createBackground() {
    this.backgroundShape = new Rect({
      name: 'background',
      attrs: this.getBackgroundAttrs(),
    });
    this.backgroundShape.toBack();
    this.appendChild(this.backgroundShape);
  }

  private getSparklineAttrs() {
    const { orient, sparklineCfg } = this.attributes;
    // 暂时只在水平模式下绘制
    if (orient !== 'horizontal') {
      return {};
    }
    const { padding, ...args } = sparklineCfg;
    const [top, right, bottom, left] = padding;
    const { width, height } = this.getAvailableSpace();
    const { lineWidth: bkgLW } = this.getStyle('backgroundStyle');
    return {
      x: bkgLW / 2 + left,
      y: bkgLW / 2 + top,
      width: width - bkgLW - left - right,
      height: height - bkgLW - top - bottom,
      ...args,
    };
  }

  /**
   * 生成sparkline
   */
  private createSparkline() {
    this.sparklineShape = new Sparkline({
      name: 'sparkline',
      attrs: this.getSparklineAttrs(),
    });
    this.backgroundShape.appendChild(this.sparklineShape);
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

  private getForegroundAttrs() {
    return { cursor: 'move', ...this.calcMask(), ...this.getStyle('foregroundStyle') };
  }

  private createForeground() {
    this.foregroundShape = new Rect({
      name: 'foreground',
      attrs: this.getForegroundAttrs(),
    });
    this.backgroundShape.appendChild(this.foregroundShape);
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
      const handle = this[`${handleType}Handle`];
      handle.attr(this.calcHandlePosition(handleType));
      const handleText = handle.getElementsByName('handleText')[0];
      handleText.attr(this.calcHandleText(handleType));
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

    const formattedText = formatter(...(handleType === 'start' ? [names[0], values[0]] : [names[1], values[1]]));
    const _ = new Text({
      attrs: {
        text: formattedText,
        ...textStyle,
      },
    });
    // 文字的包围盒
    const tBox = _.getBounds();
    _.destroy();

    let x = 0;
    let y = 0;
    const R = size / 2;
    if (orient === 'horizontal') {
      const textWidth = tBox.getMax()[0] - tBox.getMin()[0];
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
      const textHeight = tBox.getMax()[1] - tBox.getMin()[1];
      if (handleType === 'start') {
        y = fY - R > textHeight ? -_ : _;
      } else {
        y = iH - fY - fH - R > textHeight ? _ : -_;
      }
    }
    return { x, y, text: formattedText };
  }

  private getHandleAttrs(handleType: HandleType) {
    return this.calcHandlePosition(handleType);
  }

  private getHandleTextAttrs(handleType: HandleType) {
    const handleCfg = this.getHandleCfg(handleType);
    const { textStyle } = handleCfg;
    return {
      ...textStyle,
      ...this.calcHandleText(handleType),
    };
  }

  private getHandleIconAttrs(handleType: HandleType) {
    const { height: H, orient } = this.attributes;
    const handleCfg = this.getHandleCfg(handleType);
    const { show, handleIcon, handleStyle: attrs } = handleCfg;
    const cursor = this.getOrientVal(['ew-resize', 'ns-resize']);
    const size = this.getHandleSize(handleType);
    if (!show) {
      // 不显示handleIcon
      return {
        type: 'hide',
        cursor,
        x: -size / 2,
        y: -H / 2,
        height: H,
        width: size,
        opacity: 0,
        fill: 'red',
      };
    }
    if (!handleIcon) {
      // 默认handleIcon
      return {
        type: 'default',
        orient,
        ...attrs,
        size,
      };
    }
    // 使用symbol
    return {
      type: 'symbol',
      ...attrs,
      r: size,
      symbol: handleIcon,
    };
  }

  /**
   * 创建手柄
   */
  private createHandle(options: HandleCfg, handleType: HandleType) {
    // 手柄容器

    const handleEl = new DisplayObject({
      handleType,
      name: 'handle',
      attrs: this.getHandleAttrs(handleType),
    });
    // 将手柄容器挂载到foregroundShape下
    this.foregroundShape.appendChild(handleEl);

    // 手柄文本挂载到handle容器下
    const handleText = new Text({
      name: 'handleText',
      attrs: this.getHandleTextAttrs(handleType),
    });
    handleEl.appendChild(handleText);

    // 手柄icon也挂载到handle容器
    const handleIcon = new Handle({
      name: 'handleIcon',
      attrs: this.getHandleIconAttrs(handleType),
    });
    handleEl.appendChild(handleIcon);

    this[`${handleType}Handle`] = handleEl;
  }

  private getHandleCfg(handleType: HandleType) {
    const { start, end, ...args } = this.getAttribute('handle');
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

  private createHandles() {
    this.createHandle(this.getHandleCfg('start'), 'start');
    this.createHandle(this.getHandleCfg('end'), 'end');
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

    this.getElementsByName('handle').forEach((handle) => {
      const { handleType } = handle.getConfig();
      const handleIcon = handle.getElementsByName('handleIcon')[0];
      // 手柄按下开始drag
      handleIcon.addEventListener('mousedown', this.onDragStart(handleType));
      handleIcon.addEventListener('touchstart', this.onDragStart(handleType));

      // icon hover事件
      handleIcon.addEventListener('mouseenter', () => {
        handleIcon.attr(this.getStyle('handleStyle', true, handleType));
      });
      handleIcon.addEventListener('mouseleave', () => {
        handleIcon.attr(this.getStyle('handleStyle', false, handleType));
      });
    });
  }

  private getOrientVal<T>([x, y]: Pair<T>) {
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

  private onDragStart = (target: string) => (e) => {
    e.stopPropagation();
    this.target = target;
    this.prevPos = this.getOrientVal([e.x, e.y]);
    const { x, y } = this.getAvailableSpace();
    const { x: X, y: Y } = this.attributes;
    this.selectionStartPos = this.getRatio(this.prevPos - this.getOrientVal([x, y]) - this.getOrientVal([X, Y]));
    this.selectionWidth = 0;
    this.addEventListener('mousemove', this.onDragging);
    this.addEventListener('touchmove', this.onDragging);
    document.addEventListener('mouseup', this.onDragEnd);
    document.addEventListener('touchend', this.onDragEnd);
  };

  private onDragging = (e) => {
    e.stopPropagation();
    const currPos = this.getOrientVal([e.x, e.y]);
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
