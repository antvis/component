import { Group, Rect, Text } from '@antv/g';
import { clamp, deepMix, get, isUndefined } from '@antv/util';
import { Rail } from './rail';
import { Labels } from './labels';
import { LegendBase } from './base';
import { getShapeSpace, getValueOffset, getStepValueByValue } from './utils';
import { CONTINUOUS_DEFAULT_OPTIONS, STEP_RATIO } from './constant';
import { Marker } from '../marker';
import { toPrecision } from '../../util';
import type { Pair } from '../slider/types';
import type { MarkerAttrs } from '../marker';
import type { ContinuousCfg, ContinuousOptions, IndicatorCfg } from './types';
import type { DisplayObject, ShapeAttrs } from '../../types';

export type { ContinuousOptions };

type HandleType = 'start' | 'end';

export class Continuous extends LegendBase<ContinuousCfg> {
  public static tag = 'Continuous';

  /**
   * 结构：
   * this
   * |- titleShape
   * |-backgroundShape
   *   |- labelsShape
   *   |- railShape
   *      |- pathGroup
   *      |- backgroundGroup
   *      |- startHandle
   *      |- endHandle
   *      |- indicator
   */

  //
  private labelsShape: Group;

  // 色板
  private railShape: Rail;

  // 开始滑块
  private startHandle: Group;

  // 结束滑块
  private endHandle: Group;

  /**
   * 指示器
   */
  private indicatorShape: Group;

  /**
   * 当前交互的对象
   */
  private target: string;

  /**
   * 上次鼠标事件的位置
   */
  private prevValue: number;

  protected static defaultOptions = {
    type: Continuous.tag,
    ...CONTINUOUS_DEFAULT_OPTIONS,
  };

  constructor(options: ContinuousOptions) {
    super(deepMix({}, Continuous.defaultOptions, options));
    super.init();
    this.init();
  }

  public init() {
    // 创建labels
    this.createLabels();
    // 创建色板及其背景
    this.createRail();
    // // 创建滑动手柄
    this.createHandles();
    // 设置手柄文本
    this.setHandleText();
    // 调整布局
    this.adjustLayout();
    // 调整title
    this.adjustTitle();
    // 最后再绘制背景
    this.createBackground();
    // 指示器
    this.createIndicator();
    // // 监听事件
    this.bindEvents();
  }

  public update(attrs: ContinuousCfg) {
    this.attr(deepMix({}, this.attributes, attrs));
    // 更新label内容
    this.labelsShape.attr({ labelsAttrs: this.getLabelsAttrs() });
    // 更新rail
    this.railShape.update(this.getRailAttrs());
    // 更新选区
    this.setSelection(...this.getSelection());
    // 更新title内容
    this.titleShape.attr(this.getTitleAttrs());
    // 更新handle
    this.updateHandles();
    // 更新手柄文本
    this.setHandleText();
    // 关闭指示器
    this.setIndicator(false);
    // 更新布局
    this.adjustLayout();
    // 更新背景
    this.backgroundShape.attr(this.getBackgroundAttrs());
  }

  public clear() {}

  /**
   * 设置指示器
   * @param value 设置的值，用于确定位置
   * @param text 可选；显示的文本，若无则通过value取值
   * @param useFormatter 是否使用formatter
   * @returns
   */
  public setIndicator(value: false | number, text?: string, useFormatter = true) {
    // 值校验
    const { min, max, rail, indicator } = this.attributes;
    const safeValue = value === false ? false : clamp(value, min, max);
    if (safeValue === false || !indicator) {
      this.indicatorShape.hide();
      return;
    }
    this.indicatorShape.show();

    const { type, width: railWidth, height: railHeight } = rail;
    const { spacing } = indicator;
    const offsetX = this.getValueOffset(safeValue);
    // 设置指示器位置
    // type = color;
    // type=size时，指示器需要贴合轨道上边缘
    // handle会影响rail高度

    const offsetY =
      type === 'size' ? (1 - (safeValue - min) / (max - min)) * this.getOrientVal([railHeight, railWidth]) : 0;

    this.indicatorShape?.attr(
      this.getOrientVal([
        { x: offsetX, y: offsetY - spacing },
        { x: offsetY + spacing, y: offsetX },
      ])
    );

    const formatter = get(this.attributes, ['indicator', 'text', 'formatter']);
    let showText = text || safeValue;
    if (useFormatter) {
      showText = formatter(showText);
    }
    // 设置文本
    this.indicatorShape.getElementsByTagName('text')[0].attr({
      text: showText,
    });

    // 调整指示器
    this.adjustIndicator();
  }

  public getSelection() {
    const { min, max, start, end } = this.attributes;
    return [start || min, end || max] as [number, number];
  }

  /**
   * 设置选区
   * @param stVal 开始值
   * @param endVal 结束值
   * @param isOffset stVal和endVal是否为偏移量
   */
  public setSelection(stVal: number, endVal: number, isOffset: boolean = false) {
    const [currSt, currEnd] = this.getSelection();
    let [start, end] = [stVal, endVal];
    if (isOffset) {
      // 获取当前值
      start += currSt;
      end += currEnd;
    }
    // 值校验
    [start, end] = this.getSafetySelections(start, end);

    this.setAttribute('start', start);
    this.setAttribute('end', end);
    this.railShape.update({ start, end });
    this.adjustLayout();
    this.setHandleText();
  }

  /**
   * 设置Handle的文本
   */
  public setHandleText(text1?: string, text2?: string, useFormatter: boolean = true) {
    const [start, end] = this.getSelection();
    let [startText, endText] = [text1 || String(start), text2 || String(end)];
    if (useFormatter) {
      const formatter =
        get(this.attributes, ['handle', 'text', 'formatter']) ||
        get(Continuous.defaultOptions, ['attrs', 'handle', 'text', 'formatter']);
      [startText, endText] = [formatter(startText), formatter(endText)];
    }
    this.getHandle('start', 'text').attr('text', startText);
    this.getHandle('end', 'text').attr('text', endText);
  }

  // TODO
  // public getBounds() {}

  /**
   * 获取颜色
   */
  protected getColor() {
    const { color } = this.attributes;
    // TODO 待G 5.0 提供渐变色方法后使用
    // // 数组颜色
    // if (isArray(color)) {
    //   // 生成渐变色样式
    //   return color.join('-');
    // }
    return color;
  }

  protected getBackgroundAttrs() {
    const { handle } = this.attributes;
    const { width, height } = getShapeSpace(this);
    const [, right, bottom, left] = this.getPadding();
    // 问就是调试工程
    const offsetX = handle ? -20 : 0;
    const offsetY = handle ? -10 : 0;
    return {
      width: width + left + right + offsetX,
      height: height + bottom + offsetY,
      ...this.getStyle('backgroundStyle'),
    };
  }

  /**
   * 获得滑动步长
   * 未指定时默认为range的1%;
   */
  private getStep(): number {
    const { step, min, max } = this.attributes;
    if (isUndefined(step)) {
      return toPrecision((max - min) * STEP_RATIO, 0);
    }
    return step;
  }

  /**
   * 取值附近的步长刻度上的值
   */
  private getStepValueByValue(value: number): number {
    const { min } = this.attributes;
    return getStepValueByValue(value, this.getStep(), min);
  }

  /**
   * 取值所在的刻度范围
   */
  private getTickIntervalByValue(value: number) {
    const [start, end] = this.getSelection();
    const ticks = get(this.attributes, ['rail', 'ticks']);
    const temp = [start, ...ticks, end];
    for (let i = 1; i < temp.length; i += 1) {
      const st = temp[i - 1];
      const end = temp[i];
      if (value >= st && value <= end) {
        return [st, end];
      }
    }
    return false;
  }

  /**
   * 将选区调整至tick位置
   */
  private adjustSelection() {
    const [start, end] = this.getSelection();
    this.setSelection(this.getStepValueByValue(start), this.getStepValueByValue(end));
  }

  /**
   * 获取某个值在orient方向上的偏移量
   * reverse: 屏幕偏移量 -> 值
   */
  private getValueOffset(value: number, reverse = false): number {
    const { min, max, rail } = this.attributes;
    const { width: railWidth, height: railHeight } = rail;
    const innerLen = this.getOrientVal([railWidth, railHeight]);
    return getValueOffset(value, min, max, innerLen, reverse);
  }

  private getSafetySelections(start: number, end: number, precision: number = 4): [number, number] {
    const { min, max } = this.attributes;
    const [prevStart, prevEnd] = this.getSelection();
    let [startVal, endVal] = [start, end];
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

  // 获取Label属性
  private getLabelsAttrs(): ShapeAttrs[] {
    const { label } = this.attributes;
    // 不绘制label
    if (!label) {
      return [];
    }
    const { min, max, rail } = this.attributes;
    const { style, formatter, align } = label;
    const attrs = [];
    // align为rail时仅显示min、max的label
    if (align === 'rail') {
      [min, max].forEach((value, idx) => {
        attrs.push({
          x: 0,
          y: 0,
          text: formatter(value, idx),
          ...style,
        });
      });
    } else {
      const ticks = [min, ...rail.ticks, max];
      ticks.forEach((value, idx) => {
        attrs.push({
          x: 0,
          y: 0,
          text: formatter(value, idx),
          ...style,
        });
      });
    }
    return attrs;
  }

  // 创建Label
  private createLabels() {
    // 创建label容器
    this.labelsShape = new Labels({
      name: 'labels',
      id: 'labels',
      attrs: {
        labelsAttrs: this.getLabelsAttrs(),
      },
    });
    this.appendChild(this.labelsShape);
  }

  // 获取色板属性
  private getRailAttrs() {
    // 直接绘制色板，布局在adjustLayout方法中进行
    const { min, max, rail, orient } = this.attributes;
    const [start, end] = this.getSelection();
    const color = this.getColor();
    return {
      x: 0,
      y: 0,
      min,
      max,
      start,
      end,
      orient,
      color,
      cursor: 'point',
      ...rail,
    };
  }

  // 创建色板
  private createRail() {
    // 确定绘制类型
    this.railShape = new Rail({
      name: 'rail',
      id: 'rail',
      attrs: this.getRailAttrs(),
    });
    this.appendChild(this.railShape);
  }

  /**
   * 获取手柄属性
   */
  private getHandleAttrs() {
    const { handle } = this.attributes;
    if (!handle)
      return {
        markerAttrs: {
          size: 8,
          symbol: 'hiddenHandle',
          opacity: 0,
        },
        textAttrs: {
          text: '',
          opacity: 0,
        },
      };

    const { size, icon, text } = handle;
    const { style: textStyle } = text;
    const { marker, style: markerStyle } = icon;
    // 替换默认手柄
    const symbol = marker === 'default' ? this.getOrientVal(['horizontalHandle', 'verticalHandle']) : marker;
    return {
      markerAttrs: {
        symbol,
        size,
        cursor: this.getOrientVal(['ew-resize', 'ns-resize']),
        ...markerStyle,
      },
      textAttrs: {
        text: '',
        ...textStyle,
      },
    };
  }

  /**
   *  创建手柄
   */
  private createHandle(handleType: HandleType) {
    const { markerAttrs, textAttrs } = this.getHandleAttrs();
    const groupName = `${handleType}Handle`;
    const el = new Group({
      name: groupName,
      id: groupName,
    });
    // 将tag挂载到rail
    this.railShape.appendChild(el);

    const text = new Text({
      name: 'text',
      attrs: textAttrs,
    });
    el.appendChild(text);

    const icon = new Marker({
      name: 'icon',
      attrs: markerAttrs as MarkerAttrs,
    });
    el.appendChild(icon);
    this[`${handleType}handle`] = el;
  }

  // 创建手柄
  private createHandles() {
    this.createHandle('start');
    this.createHandle('end');
  }

  /**
   * 更新handle
   */
  updateHandles() {
    const { markerAttrs, textAttrs } = this.getHandleAttrs();
    ['start', 'end'].forEach((handleType) => {
      const el = this.getElementById(`${handleType}Handle`);
      const icon = el.getElementsByName('icon')[0] as Marker;
      icon.update(markerAttrs);
      el.getElementsByName('text')[0].attr(textAttrs);
    });
  }

  /**
   * 获得手柄、手柄内icon和text的对象
   */
  private getHandle(handleType: HandleType, subNode?: 'text' | 'icon') {
    // TODO fix 需要替换成查询方式
    const handle = this.getElementById(`${handleType}Handle`);
    if (subNode) {
      return handle.getElementsByName(subNode)[0];
    }
    return handle;
  }

  private getRail(item?: string) {
    if (item === 'rail') {
      return this.getElementById('railPathGroup');
    }
    if (item === 'background') {
      return this.getElementById('railBackgroundGroup');
    }
    return this.getElementById('rail');
  }

  /**
   * 获得指示器配置
   */
  private getIndicatorAttrs() {
    const { indicator } = this.attributes;
    if (!indicator) return {};
    const { size, text, backgroundStyle } = indicator as IndicatorCfg;
    const { style: textStyle } = text;
    return {
      markerAttrs: {
        size,
        symbol: this.getOrientVal(['downArrow', 'leftArrow']),
        fill: backgroundStyle.fill,
      },
      textAttrs: {
        text: '',
        ...this.getOrientVal([
          {
            textAlign: 'center' as 'center',
            textBaseline: 'middle' as 'middle',
          },
          {
            textAlign: 'left' as 'left',
            textBaseline: 'middle' as 'middle',
          },
        ]),
        ...textStyle,
      },
      backgroundAttrs: backgroundStyle,
    };
  }

  private createIndicator() {
    const { indicator } = this.attributes;
    if (!indicator) return;
    const { markerAttrs, textAttrs, backgroundAttrs } = this.getIndicatorAttrs();
    const el = new Group({
      name: 'indicator',
      id: 'indicator',
    });
    // 将tag挂载到rail
    this.railShape.appendChild(el);

    const text = new Text({
      name: 'text',
      attrs: textAttrs,
    });
    el.appendChild(text);

    // 创建 取用icon填充色
    // 位置大小在setIndicator中设置

    const background = new Rect({
      name: 'background',
      attrs: {
        width: 0,
        height: 0,
        ...backgroundAttrs,
      },
    });
    el.appendChild(background);
    background.toBack();

    // 指示器小箭头
    const icon = new Marker({
      name: `icon`,
      attrs: markerAttrs as MarkerAttrs,
    });
    el.appendChild(icon);
    this.indicatorShape = el;
    // 默认隐藏
    this.indicatorShape.hide();
  }

  /**
   * 调整handle结构
   */
  private adjustHandle() {
    const { x: innerX, y: innerY } = this.getAvailableSpace();
    const { rail, handle } = this.attributes;
    const [start, end] = this.getSelection();
    const { height: railHeight } = rail;

    // handle为false时，取默认布局方式进行布局，但不会显示出来
    const handleCfg = handle || get(Continuous.defaultOptions, ['attrs', 'handle']);
    const { spacing: handleSpacing, text: handleText } = handleCfg;
    const { align: handleTextAlign } = handleText;

    this.railShape.attr({
      x: innerX,
      y: innerY,
    });
    // 设置Handle位置
    const startHandle = this.getHandle('start');
    const endHandle = this.getHandle('end');
    startHandle.attr({
      x: this.getValueOffset(start),
      y: railHeight / 2,
    });
    endHandle.attr({
      x: this.getValueOffset(end),
      y: railHeight / 2,
    });
    // 调整文本位置
    let handleTextStyle = {};
    if (handleTextAlign === 'rail') {
      // 不做处理
      handleTextStyle = {};
    } else if (handleTextAlign === 'inside') {
      handleTextStyle = {
        y: -railHeight / 2 - handleSpacing,
        textBaseline: 'bottom',
      };
    } else if (handleTextAlign === 'outside') {
      handleTextStyle = {
        y: railHeight / 2 + handleSpacing,
        textBaseline: 'top',
      };
    }

    this.getHandle('start', 'text').attr(handleTextStyle);
    this.getHandle('end', 'text').attr(handleTextStyle);
  }

  /**
   * 调整labels结构
   */
  private adjustLabels() {
    const { min, max, label, rail, orient } = this.attributes;
    if (!label) return;
    // 容器内可用空间起点
    const { x: innerX, y: innerY } = this.getAvailableSpace();
    const { width: railWidth, height: railHeight, ticks: _t } = rail;
    // 绘制label
    const { align: labelAlign, spacing: labelSpacing } = label;
    // label位置
    if (labelAlign === 'rail') {
      /**
       * 此时labelsShape中只包含min、max label
       * 1. 设置minLabel位置
       */
      if (orient === 'horizontal') {
        /**
         * 0  ||||||||||||||||||||||  100
         */

        this.labelsShape.attr({
          x: innerX,
          y: innerY + railHeight / 2,
        });
        // 设置左侧文本
        this.labelsShape.firstChild.attr({ textAlign: 'start' });

        // 左侧文本的宽度
        const { width: leftTextWidth } = getShapeSpace(this.labelsShape.firstChild);

        const railStart = innerX + leftTextWidth + labelSpacing;
        // 设置rail位置
        this.railShape.attr({
          x: railStart,
          y: innerY,
        });

        // 设置右侧文本位置
        this.labelsShape.lastChild.attr({
          x: railStart + railWidth + labelSpacing,
          y: 0,
          textAlign: 'start',
        });
        return;
      }
      /**
       * else if orient === 'vertical'
       *   0
       *  --
       *  --
       *  --
       *  --
       *  --
       *  --
       *  400
       */
      this.labelsShape.attr({
        x: railWidth / 2,
        y: innerY,
      });
      // 顶部文本高度
      const { height: topTextHeight } = getShapeSpace(this.labelsShape.firstChild);
      this.labelsShape.firstChild.attr({
        textBaseline: 'top',
      });
      // rail位置
      const railStart = innerY + topTextHeight + labelSpacing;
      this.railShape.attr({
        x: innerX,
        y: railStart,
      });

      // 底部文本位置
      this.labelsShape.lastChild.attr({
        x: 0,
        y: railStart + railHeight + labelSpacing,
        textBaseline: 'top',
      });
      return;
    }

    /**
     * if labelAlign == 'inside' | 'outside'
     *  ||||||||||||||||||||||
     *  0  20  40  60  80  100
     *
     *  -- 0
     *  -- 20
     *  -- 40
     *  -- 60
     *  -- 80
     *  -- 100
     */
    if (orient === 'horizontal') {
      // labelsShape 高度
      const { height: labelsHeight } = getShapeSpace(this.labelsShape);
      const labelSpace = labelsHeight + labelSpacing;

      this.railShape.attr({
        x: innerX,
        // label在上，rail在下
        y: innerY + (labelAlign === 'inside' ? labelSpace : 0),
      });
      this.labelsShape.attr({
        x: innerX,
        // label在上
        y: innerY + (labelAlign === 'inside' ? 0 : labelSpace) + 10,
      });

      // 补上min，max
      const ticks = [min, ..._t, max];
      // 设置labelsShape中每个文本的位置
      this.labelsShape.children.forEach((child, idx) => {
        const val = ticks[idx];
        // 通过val拿到偏移量

        child.attr({
          x: this.getValueOffset(val),
          y: 0,
          textBaseline: 'top',
          textAlign: (() => {
            // 调整两端label位置
            if (idx === 0) return 'start';
            if (idx === ticks.length - 1) return 'end';
            return 'center';
          })(),
        });
      });
      return;
    }
    /**
     * orient === 'vertical'
     */
    const a = 1;
  }

  /**
   * 调整指示器结构
   */
  private adjustIndicator() {
    const text = this.indicatorShape.getElementsByName('text')[0];
    const background = this.indicatorShape.getElementsByName('background')[0];
    const { width, height } = getShapeSpace(text);

    const [top, right, bottom, left] = this.getPadding(get(this.attributes, ['indicator', 'padding']));

    const leftRight = left + right;
    const topBottom = top + bottom;

    // 设置背景大小
    background.attr({
      x: -width / 2 - left,
      y: -height - topBottom,
      width: width + leftRight,
      height: height + topBottom,
    });
    text.attr({
      y: -height / 2 - top,
    });
  }

  /**
   * 对图例进行布局
   */
  private adjustLayout() {
    // if (!label && !handle) {
    //   // 没有label和Handle
    //   // 直接绘制色板即可
    // }

    const { handle, label } = this.attributes;
    // 调整handle
    // 显示handle时不显示label
    if (handle) {
      this.labelsShape?.hide();
    } else {
      this.labelsShape?.show();
    }
    if (this.getHandle('start')) {
      this.adjustHandle();
    }

    // 调整labels
    if (label && this.labelsShape.isVisible()) {
      this.adjustLabels();
    }

    // rail位置
  }

  /**
   * 获取鼠标、触摸事件中的指针坐标
   */
  private getEventPos(e) {
    // TODO 需要区分touch和mouse事件
    const pos = e.screen;
    return [pos.x, pos.y] as Pair<number>;
  }

  /**
   * 事件触发的位置对应的value值
   */
  private getEventPosValue(e, limit: boolean = false) {
    const { min, max } = this.attributes;
    const startPos = this.getOrientVal(this.getRail().getPosition().slice(0, 2) as Pair<number>);
    const currValue = this.getOrientVal(this.getEventPos(e));
    const offset = currValue - startPos;
    const value = clamp(this.getValueOffset(offset, true) + min, min, max);
    return value;
  }

  /**
   * 绑定事件
   */
  private bindEvents() {
    // 如果！slidable，则不绑定事件或者事件响应不生效
    // 各种hover事件

    // 放置需要绑定drag事件的对象
    const dragObject = new Map<string, DisplayObject>();
    dragObject.set('rail', this.getElementById('railBackgroundGroup'));
    dragObject.set('start', this.getHandle('start', 'icon'));
    dragObject.set('end', this.getHandle('end', 'icon'));
    // 绑定drag开始事件
    dragObject.forEach((obj, key) => {
      obj.addEventListener('mousedown', this.onDragStart(key));
      obj.addEventListener('touchstart', this.onDragStart(key));
    });

    // indicator hover事件
    this.getRail('background').addEventListener('mouseenter', this.onHoverStart('rail'));
    this.backgroundShape.addEventListener('mouseover', this.onHoverEnd);
  }

  /**
   * 开始拖拽
   */
  private onDragStart = (target: string) => (e) => {
    e.stopPropagation();
    const { slidable } = this.attributes;
    // 关闭滑动
    if (!slidable) return;
    this.onHoverEnd();
    this.target = target;
    this.prevValue = this.getStepValueByValue(this.getEventPosValue(e));
    this.addEventListener('mousemove', this.onDragging);
    this.addEventListener('touchmove', this.onDragging);
    document.addEventListener('mouseup', this.onDragEnd);
    document.addEventListener('touchend', this.onDragEnd);
  };

  /**
   * 拖拽
   */
  private onDragging = (e) => {
    e.stopPropagation();
    const [start, end] = this.getSelection();
    const currValue = this.getStepValueByValue(this.getEventPosValue(e));
    const diffValue = currValue - this.prevValue;

    switch (this.target) {
      case 'start':
        start !== currValue && this.setSelection(currValue, end);
        break;
      case 'end':
        end !== currValue && this.setSelection(start, currValue);
        break;
      case 'rail':
        if (diffValue !== 0) {
          this.prevValue = currValue;
          this.setSelection(diffValue, diffValue, true);
        }
        break;
      default:
        break;
    }
  };

  /**
   * 结束拖拽
   */
  private onDragEnd = () => {
    this.removeEventListener('mousemove', this.onDragging);
    this.removeEventListener('touchmove', this.onDragging);
    document.removeEventListener('mouseup', this.onDragEnd);
    document.removeEventListener('touchend', this.onDragEnd);
    // 抬起时修正位置
    this.target = undefined;
  };

  private onHoverStart = (target: string) => (e) => {
    e.stopPropagation();
    // 如果target不为undefine，表明当前有其他事件被监听
    if (isUndefined(this.target)) {
      this.target = target;
      this.addEventListener('mousemove', this.onHovering);
      this.addEventListener('touchmove', this.onHovering);
    }
  };

  private onHovering = (e) => {
    e.stopPropagation();
    const value = this.getEventPosValue(e);
    // chunked为true时
    if (get(this.attributes, ['rail', 'chunked'])) {
      const interval = this.getTickIntervalByValue(value);
      if (!interval) return;
      const [st, end] = interval;
      this.setIndicator(toPrecision((st + end) / 2, 0), `${st}-${end}`, false);
      // 计算value并发出事件
      this.emit('onIndicated', interval);
    } else {
      const val = this.getStepValueByValue(value);
      this.setIndicator(val);
      // TODO 节流
      this.emit('onIndicated', val);
    }
  };

  /**
   * hover结束
   */
  private onHoverEnd = () => {
    this.removeEventListener('mousemove', this.onHovering);
    this.removeEventListener('touchmove', this.onHovering);
    // 关闭指示器
    this.setIndicator(false);
    // 恢复状态
    this.target = undefined;
  };
}
