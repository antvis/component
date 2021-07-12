import { Rect, Text, Image, Line, DisplayObject } from '@antv/g';
import { deepMix, get, isFunction, isString, isObject } from '@antv/util';
import { GUI } from '../core/gui';
import { applyAttrs, toPrecision } from '../../util';
import { Sparkline } from '../sparkline';
import { Marker, MarkerOptions } from '../marker';
import type { SliderOptions, HandleCfg, Pair } from './types';

export { SliderOptions };

type HandleType = 'start' | 'end';

export class Slider extends GUI<SliderOptions> {
  public static tag = 'slider';

  /**
   * 层级关系
   * backgroundShape
   *  |- sparklineShape
   *  |- foregroundShape
   *       |- startHandle
   *       |- endHandle
   */

  /**
   * 背景
   */
  private backgroundShape: DisplayObject;

  /**
   * 缩略图
   */
  private sparklineShape: DisplayObject;

  /**
   * 前景，即选区
   */
  private foregroundShape: DisplayObject;

  /**
   * 起始手柄
   */
  private startHandle: DisplayObject;

  /**
   * 终点手柄
   */
  private endHandle: DisplayObject;

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
        padding: {
          left: 1,
          right: 1,
          top: 1,
          bottom: 1,
        },
      },
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
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
  public update() {
    throw new Error('Method not implemented.');
  }

  /**
   * 组件的清除
   */
  public clear() {
    throw new Error('Method not implemented.');
  }

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
    return {
      x: padding.left,
      y: padding.top,
      width: width - (padding.left + padding.right),
      height: height - (padding.top + padding.bottom),
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

  private createBackground() {
    this.backgroundShape = new Rect({
      name: 'background',
      attrs: {
        cursor: 'crosshair',
        ...this.getAvailableSpace(),
        ...this.getStyle('backgroundStyle'),
      },
    });
    this.appendChild(this.backgroundShape);
  }

  /**
   * 生成sparkline
   */
  private createSparkline() {
    const { orient, sparklineCfg } = this.attributes;
    console.log(sparklineCfg);

    // 暂时只在水平模式下绘制
    if (orient !== 'horizontal') {
      return;
    }
    const { padding, ...args } = sparklineCfg;

    const { width, height } = this.getAvailableSpace();
    const { lineWidth: bkgLW } = this.getStyle('backgroundStyle');
    this.sparklineShape = new Sparkline({
      attrs: {
        x: bkgLW / 2 + padding.left,
        y: bkgLW / 2 + padding.top,
        width: width - bkgLW - padding.left - padding.right,
        height: height - bkgLW - padding.top - padding.bottom,
        ...args,
      },
    });
    this.backgroundShape.appendChild(this.sparklineShape);
    this.sparklineShape.toBack();
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

  private createForeground() {
    this.foregroundShape = new Rect({
      name: 'foreground',
      attrs: {
        cursor: 'move',
        ...this.calcMask(),
        ...this.getStyle('foregroundStyle'),
      },
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
    applyAttrs(this.foregroundShape, this.calcMask());
    applyAttrs(this.startHandle, this.calcHandlePosition('start'));
    applyAttrs(this.endHandle, this.calcHandlePosition('end'));
    this.getElementsByName('handleText').forEach((handleText) => {
      applyAttrs(handleText, this.calcHandleText(handleText.getConfig().identity));
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

  /**
   * 解析icon类型
   */
  private parseIcon(icon: MarkerOptions['symbol'] | string) {
    let type = 'unknown';
    if (isObject(icon) && icon instanceof Image) type = 'image';
    else if (isFunction(icon)) type = 'symbol';
    else if (isString(icon)) {
      const dataURLsPattern = new RegExp('data:(image|text)');
      if (icon.match(dataURLsPattern)) {
        type = 'base64';
      } else if (/^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/.test(icon)) {
        type = 'url';
      } else {
        // 不然就当作symbol string 处理
        type = 'symbol';
      }
    }
    return type;
  }

  /**
   * 创建手柄
   */
  private createHandle(options: HandleCfg, handleType: HandleType) {
    const { show, textStyle, handleIcon: icon, handleStyle } = options;
    const size = this.getHandleSize(handleType);
    const iconType = this.parseIcon(icon);
    const baseCfg = {
      name: 'handleIcon',
      identity: handleType,
    };
    const cursor = this.getOrientVal(['ew-resize', 'ns-resize']);

    const handleIcon = (() => {
      if (!show) {
        // 如果不显示的话，就创建透明的rect
        return new Marker({
          ...baseCfg,
          attrs: {
            r: size / 2,
            symbol: 'square',
            markerStyle: {
              opacity: 0,
            },
            cursor,
          },
        });
      }

      if (['base64', 'url', 'image'].includes(iconType)) {
        // TODO G那边似乎还是有点问题，暂不考虑Image
        return new Image({
          ...baseCfg,
          attrs: {
            x: -size / 2,
            y: -size / 2,
            width: size,
            height: size,
            img: icon,
            cursor,
          },
        });
      }
      if (iconType === 'symbol') {
        return new Marker({
          ...baseCfg,
          attrs: {
            r: size / 2,
            symbol: icon,
            cursor,
            ...handleStyle,
          },
        });
      }

      const width = size;
      const height = size * 2.4;

      // 创建默认图形
      const handleBody = new Rect({
        ...baseCfg,
        attrs: {
          cursor,
          width,
          height,
          x: -width / 2,
          y: -height / 2,
          radius: size / 4,
          ...handleStyle,
        },
      });
      const { stroke, lineWidth } = handleStyle;
      const X1 = (1 / 3) * width;
      const X2 = (2 / 3) * width;
      const Y1 = (1 / 4) * height;
      const Y2 = (3 / 4) * height;

      const createLine = (x1: number, y1: number, x2: number, y2: number) => {
        return new Line({
          name: 'line',
          attrs: {
            x1,
            y1,
            x2,
            y2,
            cursor,
            stroke,
            lineWidth,
          },
        });
      };

      handleBody.appendChild(createLine(X1, Y1, X1, Y2));
      handleBody.appendChild(createLine(X2, Y1, X2, Y2));

      // 根据orient进行rotate
      // 设置旋转中心
      handleBody.setOrigin(width / 2, height / 2);
      handleBody.rotate(this.getOrientVal([0, 90]));

      return handleBody;
    })();

    const handleText = new Text({
      name: 'handleText',
      identity: handleType,
      attrs: {
        // TODO 之后考虑添加文字超长省略，可以在calcHandleTextPosition中实现
        ...textStyle,
        ...this.calcHandleText(handleType),
      },
    });

    // 用 Group 创建对象会提示没有attrs属性
    const handle = new DisplayObject({
      name: 'handle',
      identity: handleType,
      attrs: this.calcHandlePosition(handleType),
    });
    handle.appendChild(handleIcon);
    handle.appendChild(handleText);
    return handle;
  }

  private getHandleCfg(handleType: HandleType) {
    const { start, end, ...args } = this.getAttribute('handle');
    let _ = {};
    if (handleType === 'start') {
      _ = start;
    } else if (handleType === 'end') {
      _ = end;
    }
    return deepMix({}, args, _);
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
    this.startHandle = this.createHandle(this.getHandleCfg('start'), 'start');
    this.foregroundShape.appendChild(this.startHandle);
    this.endHandle = this.createHandle(this.getHandleCfg('end'), 'end');
    this.foregroundShape.appendChild(this.endHandle);
  }

  private bindEvents() {
    // Drag and brush
    this.backgroundShape.addEventListener('mousedown', this.onDragStart('background'));
    this.backgroundShape.addEventListener('touchstart', this.onDragStart('background'));

    this.foregroundShape.addEventListener('mousedown', this.onDragStart('foreground'));
    this.foregroundShape.addEventListener('touchstart', this.onDragStart('foreground'));

    this.getElementsByName('handleIcon').forEach((handleIcon) => {
      handleIcon.addEventListener('mousedown', this.onDragStart(`${handleIcon.getConfig().identity}Handle`));
      handleIcon.addEventListener('touchstart', this.onDragStart(`${handleIcon.getConfig().identity}Handle`));
    });
    // Hover
    this.bindHoverEvents();
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
      case 'startHandle':
        this.setValuesOffset(dVal);
        break;
      case 'endHandle':
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

  private bindHoverEvents = () => {
    this.foregroundShape.addEventListener('mouseenter', () => {
      applyAttrs(this.foregroundShape, this.getStyle('foregroundStyle', true));
    });
    this.foregroundShape.addEventListener('mouseleave', () => {
      applyAttrs(this.foregroundShape, this.getStyle('foregroundStyle'));
    });

    this.getElementsByName('handle').forEach((handle) => {
      const icon = handle.getElementsByName('handleIcon')[0];
      const text = handle.getElementsByName('handleText')[0];
      handle.addEventListener('mouseenter', () => {
        applyAttrs(icon, this.getStyle('handleStyle', true, icon.getConfig().identity));
        applyAttrs(text, this.getStyle('textStyle', true, text.getConfig().identity));
      });
      handle.addEventListener('mouseleave', () => {
        applyAttrs(icon, this.getStyle('handleStyle', false, icon.getConfig().identity));
        applyAttrs(text, this.getStyle('textStyle', false, text.getConfig().identity));
      });
    });
  };
}
