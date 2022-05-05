import { CustomEvent, Group, Text } from '@antv/g';
import { clamp, deepMix, get, isUndefined, minBy, uniqueId, omit } from '@antv/util';
import { Rail } from './rail';
import { Labels } from './labels';
import { Marker } from '../marker';
import { LegendBase } from './base';
import { getValueOffset, getStepValueByValue } from './utils';
import { CONTINUOUS_DEFAULT_OPTIONS, STEP_RATIO } from './constant';
import { toPrecision, getShapeSpace, getEventPos, deepAssign, throttle, TEXT_INHERITABLE_PROPS } from '../../util';
import { wrapper, WrapperNode } from '../../util/wrapper';
import { Poptip, PoptipCfg } from '../poptip';
import type { Pair } from '../slider/types';
import type { IRailCfg } from './rail';
import type { ILabelsCfg } from './labels';
import type { MarkerStyleProps } from '../marker';
import type { DisplayObject, TextProps } from '../../types';
import type { ContinuousCfg, ContinuousOptions, RailCfg, HandleCfg, SymbolCfg } from './types';

export type { ContinuousOptions };

type HandleType = 'start' | 'end';
interface IHandleCfg {
  markerCfg: MarkerStyleProps;
  textCfg: TextProps;
}

const RAIL_NAME = 'rail';
export class Continuous extends LegendBase<ContinuousCfg> {
  public static tag = 'continuous';

  protected static defaultOptions = {
    type: Continuous.tag,
    ...CONTINUOUS_DEFAULT_OPTIONS,
  };

  /**
   * 结构：
   * this
   * |- titleShape
   * |- middleGroup
   *   |- labelsShape
   *   |- railShape
   *      |- pathGroup (.rail-path)
   *      |- backgroundGroup (.rail-path)
   *      |- startHandle
   *      |- endHandle
   *      |- indicator
   * |-backgroundShape
   */

  public get selection() {
    const { min, max, start, end } = this.attributes;
    return [start || min, end || max] as [number, number];
  }

  /* 背景配置项 */
  protected get backgroundShapeCfg() {
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
  private get step(): number {
    const { step, min, max } = this.attributes;
    if (isUndefined(step)) {
      return toPrecision((max - min) * STEP_RATIO, 0);
    }
    return step;
  }

  /**
   * 获取颜色
   */
  protected get color() {
    const { color, rail } = this.attributes;
    const { ticks, chunked } = rail;
    return chunked ? color.slice(0, ticks!.length + 1) : color;
  }

  // 获取色板属性
  private get railShapeCfg(): IRailCfg {
    // 直接绘制色板，布局在adjustLayout方法中进行
    const { min, max, rail, orient } = this.attributes;
    const [start, end] = this.selection;
    const { color } = this;
    return {
      x: 0,
      y: 0,
      min,
      max,
      start,
      end,
      orient,
      color,
      // todo 鼠标样式有闪动问题
      cursor: 'pointer',
      ...(rail as Required<RailCfg>),
    };
  }

  /**
   * 获取手柄属性
   */
  private get handleShapeCfg(): IHandleCfg {
    const { handle, label, slidable } = this.attributes;
    if (!handle)
      return {
        markerCfg: {
          size: 8,
          symbol: 'hiddenHandle',
          opacity: 0,
        },
        textCfg: {
          text: '',
          opacity: 0,
        },
      };

    const { size, icon } = handle as Required<Pick<HandleCfg, 'size' | 'icon'>>;
    const { marker, style: markerStyle } = icon;
    // 替换默认手柄
    const symbol =
      marker === 'default' ? this.getOrientVal(['horizontalHandle', 'verticalHandle']) : (marker as SymbolCfg);
    return {
      // @ts-ignore
      markerCfg: {
        symbol,
        size,
        opacity: 1,
        cursor: slidable ? this.getOrientVal(['ew-resize', 'ns-resize']) : 'not-allowed',
        ...markerStyle,
      },
      textCfg: {
        ...TEXT_INHERITABLE_PROPS,
        text: '',
        opacity: label ? 1 : 0,
        ...(label?.style || {}),
      },
    };
  }

  // 获取 Label 属性
  private get labelsShapeCfg(): ILabelsCfg {
    const { label } = this.attributes;
    // 不绘制label
    if (!label) {
      return {
        labels: [],
      };
    }
    const { min, max, rail } = this.attributes;
    const { style, formatter, align } = label;
    const cfg: TextProps[] = [];
    // align 为rail 时仅显示 min、max 的 label
    if (align === 'rail') {
      [min, max].forEach((value, idx) => {
        cfg.push({
          x: 0,
          y: 0,
          text: formatter!(value, idx),
          ...style,
        });
      });
    } else {
      const ticks = [min, ...rail.ticks!, max];
      ticks.forEach((value, idx) => {
        cfg.push({
          x: 0,
          y: 0,
          text: formatter!(value, idx),
          ...style,
        });
      });
    }
    return {
      labels: cfg,
    };
  }

  private labelsGroup!: Labels;

  private middleGroup!: Group;

  // 色板
  private railShape!: Rail;

  // 开始滑块
  private startHandle!: Group;

  // 结束滑块
  private endHandle!: Group;

  /**
   * 悬浮提示
   */
  private poptip!: WrapperNode<PoptipCfg, Poptip>;

  /**
   * 当前交互的对象
   */
  private target!: string | undefined;

  /**
   * 上次鼠标事件的位置
   */
  private prevValue!: number;

  constructor(options: ContinuousOptions) {
    super(deepMix({}, Continuous.defaultOptions, options));
    this.init();
  }

  public init() {
    super.init();
    this.appendChild((this.middleGroup = new Group()));
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
    this.updateIndicator();
    // // 监听事件
    this.bindEvents();
  }

  public update(cfg: Partial<ContinuousCfg>) {
    this.attr(deepAssign({}, this.attributes, cfg));
    // 更新label内容
    this.labelsGroup.update(this.labelsShapeCfg);
    // 更新rail
    this.railShape.update(this.railShapeCfg);
    // 更新选区
    this.updateSelection(...this.selection);
    // 更新title内容
    this.titleShape.attr(this.titleShapeCfg);
    // 更新handle
    this.updateHandles();
    // 更新手柄文本
    this.setHandleText();
    // 更新指示器
    this.updateIndicator();
    // 更新布局
    this.adjustLayout();
    // 更新背景
    this.backgroundShape.attr(this.backgroundShapeCfg);
  }

  public clear() {
    this.poptip.node().destroy();
  }

  public destroy() {
    super.destroy();
    this.poptip.node().destroy();
  }

  // /**
  //  * 设置指示器 (暂时不提供)
  //  * @param value 设置的值，用于确定位置
  //  * @param text 可选；显示的文本，若无则通过value取值
  //  * @param useFormatter 是否使用formatter
  //  * @returns
  //  */
  // public setIndicator(value: false | number) {
  //   const { indicator } = this.attributes;

  //   const poptip = this.poptip.node();
  //   if (!indicator || value === false) {
  //     poptip.hideTip();
  //     return;
  //   }

  //   const railPath = this.railShape.getElementsByClassName('rail-path')[0] as Path;
  //   const { x, y } = railPath.getBoundingClientRect();
  //   const { min, max } = this.attributes;
  //   const safeValue = clamp(value, min, max);
  //   const offsetX = this.getValueOffset(safeValue);
  //   const [v1] = this.getIndicatorValue(value) || [];

  //   poptip.showTip(x + offsetX, y, { text: v1 });
  // }

  public setSelection(stVal: number, endVal: number) {
    // 值校验
    this.updateSelectionLayout(...this.getSafetySelections(stVal, endVal));
  }

  /**
   * 设置Handle的文本
   */
  public setHandleText(text1?: string, text2?: string, useFormatter: boolean = true) {
    const [start, end] = this.selection;
    let [startText, endText] = [text1 || String(start), text2 || String(end)];
    if (useFormatter) {
      const formatter =
        get(this.attributes, ['handle', 'text', 'formatter']) ||
        get(Continuous.defaultOptions, ['style', 'handle', 'text', 'formatter']);
      [startText, endText] = [formatter(startText), formatter(endText)];
    }
    this.getHandle('start', 'text').attr({ text: startText });
    this.getHandle('end', 'text').attr({ text: endText });
  }

  protected initShape() {
    super.initShape();
  }

  /**
   * 设置选区
   * @param stVal 开始值
   * @param endVal 结束值
   * @param isOffset stVal和endVal是否为偏移量
   */
  private updateSelection(stVal: number, endVal: number, isOffset: boolean = false) {
    const [currSt, currEnd] = this.selection;
    let [start, end] = [stVal, endVal];
    if (isOffset) {
      // 获取当前值
      start += currSt;
      end += currEnd;
    }
    // 值校验
    [start, end] = this.getSafetySelections(start, end);
    this.updateSelectionLayout(start, end);
    this.dispatchSelection();
  }

  private updateSelectionLayout(start: number, end: number) {
    this.setAttribute('start', start);
    this.setAttribute('end', end);
    this.railShape.update({ start, end });
    this.adjustLayout();
    this.setHandleText();
  }

  /**
   * 取值附近的步长刻度上的值
   */
  private getTickValue(value: number): number {
    const {
      min,
      max,
      rail: { chunked, ticks },
    } = this.attributes;
    if (chunked) {
      const range = [min, ...ticks!, max];
      for (let i = 0; i < range.length - 1; i += 1) {
        if (value >= range[i] && value <= range[i + 1]) {
          return minBy([range[i], range[i + 1]], (val) => Math.abs(value - val));
        }
      }
    }
    return getStepValueByValue(value, this.step, min);
  }

  /**
   * 取值所在的刻度范围
   */
  private getTickIntervalByValue(value: number) {
    const { min, max } = this.attributes;
    const ticks = get(this.attributes, ['rail', 'ticks']);
    const temp = [min, ...ticks, max];
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
   * 获取某个值在orient方向上的偏移量
   * reverse: 屏幕偏移量 -> 值
   */
  private getValueOffset(value: number, reverse = false): number {
    const { min, max, rail } = this.attributes;
    const { width: railWidth, height: railHeight } = rail;
    const innerLen = this.getOrientVal([railWidth!, railHeight!]);
    return getValueOffset(value, min, max, innerLen, reverse);
  }

  private getSafetySelections(start: number, end: number, precision: number = 4): [number, number] {
    const { min, max } = this.attributes;
    const [prevStart, prevEnd] = this.selection;
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

  // 创建 Label
  private createLabels() {
    // 创建 label 容器
    this.labelsGroup = new Labels({
      name: 'labels',
      id: 'labels',
      style: this.labelsShapeCfg as any,
    });
    this.middleGroup.appendChild(this.labelsGroup);
  }

  // 创建色板
  private createRail() {
    // 确定绘制类型
    this.railShape = new Rail({
      name: RAIL_NAME,
      id: 'rail',
      style: this.railShapeCfg as any,
    });
    this.middleGroup.appendChild(this.railShape);
  }

  /**
   *  创建手柄
   */
  private createHandle(handleType: HandleType) {
    const { markerCfg, textCfg } = this.handleShapeCfg;
    const groupName = `${handleType}Handle`;
    const el = new Group({
      name: groupName,
      id: groupName,
    });
    // 将tag挂载到rail
    this.railShape.appendChild(el);

    const text = new Text({
      name: 'text',
      style: {
        ...TEXT_INHERITABLE_PROPS,
        ...textCfg,
      },
    });
    el.appendChild(text);

    const icon = new Marker({
      name: 'icon',
      style: markerCfg as MarkerStyleProps,
    });
    el.appendChild(icon);

    if (handleType === 'start') this.startHandle = el;
    else this.endHandle = el;
  }

  // 创建手柄
  private createHandles() {
    this.createHandle('start');
    this.createHandle('end');
  }

  /**
   * 更新handle
   */
  public updateHandles() {
    const { markerCfg, textCfg } = this.handleShapeCfg;
    (['start', 'end'] as HandleType[]).forEach((handleType) => {
      (this.getHandle(handleType, 'icon') as Marker).update(markerCfg);
      (this.getHandle(handleType, 'text') as Text).attr(textCfg);
    });
  }

  /**
   * 获得手柄、手柄内icon和text的对象
   */
  private getHandle(handleType: HandleType, subNode?: 'text' | 'icon') {
    let handle: Group;
    if (handleType === 'start') handle = this.startHandle;
    else handle = this.endHandle;
    if (!subNode) return handle;
    if (subNode === 'text') {
      return handle.getElementsByName('text')[0] as Text;
    }
    return handle.getElementsByName('icon')[0] as Marker;
  }

  private updateIndicator() {
    const { indicator, orient, rail, min, max } = this.attributes;

    if (!indicator) return;
    if (!this.poptip) {
      const bgStyle = indicator.backgroundStyle || {};
      const textStyle = get(indicator, ['text', 'style']) || {};
      // indicator hover事件
      const cls = `${uniqueId('gui-poptip-')}`;

      this.poptip = wrapper<PoptipCfg, Poptip>(
        Poptip,
        deepMix(
          {},
          {
            id: 'continuous-legend-poptip',
            containerClassName: cls,
            domStyles: { '.gui-poptip': { padding: '2px', radius: '4px', 'box-shadow': 'none', 'min-width': '20px' } },
          },
          {
            ...indicator,
            domStyles: {
              [`.gui-poptip.${cls}`]: bgStyle,
              [`.${cls} .gui-poptip-arrow`]: omit(bgStyle, ['border-radius']),
              [`.${cls} .gui-poptip-text`]: textStyle,
            },
          }
        )
      );
      const { width: railWidth, height: railHeight } = rail as Required<Pick<IRailCfg, 'width' | 'height'>>;

      this.poptip.node().bind(this.railShape, (e) => {
        const value = this.getEventPosValue(e);
        const [v1, v2] = this.getIndicatorValue(value) || [];
        value && this.dispatchIndicated(value, v2);

        // type = size 时，指示器需要贴合轨道上边缘
        // handle 会影响 rail 高度
        const offsetY =
          rail?.type === 'size' && !rail?.chunked
            ? (1 - (clamp(value, min, max) - min) / (max - min)) * this.getOrientVal([railHeight, railWidth])
            : 0;

        return {
          position: orient === 'vertical' ? 'left' : 'top',
          html: v1 || '',
          target: e.target.className === 'rail-path' ? e.target : false,
          offset: [0, offsetY],
        };
      });
      return;
    }

    this.poptip.node().hide();
  }

  /**
   * 调整handle结构
   */
  private adjustHandle() {
    const { rail, label } = this.attributes;
    const [start, end] = this.selection;
    const { width: railWidth, height: railHeight } = rail as Required<Pick<IRailCfg, 'width' | 'height'>>;

    // 设置Handle位置
    const { startHandle } = this;
    const { endHandle } = this;
    startHandle.attr(
      this.getOrientVal([
        {
          x: this.getValueOffset(start),
          y: railHeight / 2,
        },
        {
          x: railWidth / 2,
          y: this.getValueOffset(start),
        },
      ])
    );
    endHandle.attr(
      this.getOrientVal([
        {
          x: this.getValueOffset(end),
          y: railHeight / 2,
        },
        {
          x: railWidth / 2,
          y: this.getValueOffset(end),
        },
      ])
    );

    // handle为false时，取默认布局方式进行布局，但不会显示出来
    if (!label) return;
    const { spacing = 0 } = label;
    const align = label.align === 'rail' ? 'end' : label.align;

    // 调整文本位置
    let handleTextStyle = {};
    // rail 不做处理
    if (align === 'start') {
      handleTextStyle = this.getOrientVal([
        {
          x: 0,
          y: -railHeight / 2 - spacing,
          textAlign: 'center',
          textBaseline: 'bottom',
        },
        {
          x: -railWidth / 2 - spacing,
          y: 0,
          textAlign: 'end',
          textBaseline: 'middle',
        },
      ]);
    } else if (align === 'end') {
      handleTextStyle = this.getOrientVal([
        {
          x: 0,
          y: railHeight / 2 + spacing,
          textAlign: 'center',
          textBaseline: 'top',
        },
        {
          x: railWidth + spacing,
          y: 0,
          textAlign: 'start',
          textBaseline: 'middle',
        },
      ]);
    }

    this.getHandle('start', 'text').attr(handleTextStyle);
    this.getHandle('end', 'text').attr(handleTextStyle);
  }

  /**
   * 调整 labels 布局位置
   *
   * if labelAlign == 'inside' | 'outside'
   *    orient: horizontal
   *      ||||||||||||||||||||||
   *      0  20  40  60  80  100
   *    orient: vertical
   *      —— 0
   *      —— 20
   *      —— 40
   *      —— 60
   */
  private adjustLabels() {
    const { min, max, label, rail, orient } = this.attributes;

    if (!label) return;

    // 容器内可用空间起点
    const { x: innerX, y: innerY } = this.availableSpace;
    const {
      width: railWidth,
      height: railHeight,
      ticks: _t,
    } = rail as Required<Pick<IRailCfg, 'width' | 'height' | 'ticks'>>;

    const { align = 'rail', spacing: labelSpacing = 0, flush: labelFlush, offset = [] } = label!;
    const [offsetX = 0, offsetY = 0] = offset;

    if (align === 'rail') {
      // 此时 labelsShape 中只包含 min、max label。1. 设置 minLabel 位置
      if (orient === 'horizontal') {
        /**
         * 0  ||||||||||||||||||||||  100
         */
        this.labelsGroup.attr({
          x: innerX,
          y: innerY + railHeight / 2,
        });
        const [firstChild] = this.labelsGroup.getLabels();
        // 设置左侧文本
        if (firstChild) {
          firstChild.attr({ textAlign: 'start', x: offsetX, y: offsetY });
        }

        const [lastChild] = this.labelsGroup.getLabels().slice(-1);
        if (lastChild) {
          firstChild;
          // 设置右侧文本位置
          lastChild.attr({
            x: getShapeSpace(firstChild).width + railWidth + labelSpacing * 2 + offsetX,
            y: offsetY,
            textAlign: 'start',
          });
        }
      } else {
        this.labelsGroup.attr({
          x: innerX + railWidth / 2,
          y: innerY,
        });
        // 顶部文本高度
        const firstLabelText = this.labelsGroup.getLabels()[0];
        const { height: topTextHeight } = getShapeSpace(firstLabelText);
        firstLabelText.attr({
          x: offsetX,
          y: topTextHeight / 2 + offsetY,
          textBaseline: 'middle',
        });
        // 底部文本位置
        const lastLabelText = this.labelsGroup.getLabels().slice(-1)[0];
        lastLabelText.attr({
          x: offsetX,
          y: railHeight + topTextHeight * 1.5 + labelSpacing * 2 + offsetY,
          textBaseline: 'middle',
        });
      }

      return;
    }

    if (orient === 'horizontal') {
      // labelsShape 高度
      const { height: labelsHeight } = getShapeSpace(this.labelsGroup);

      this.labelsGroup.attr({
        x: innerX,
        y: innerY + (align === 'start' ? labelsHeight / 2 : labelSpacing + railHeight + labelsHeight / 2),
      });
      // 补上 min，max
      const ticks = [min, ..._t, max];
      // 设置labelsShape中每个文本的位置
      this.labelsGroup.getLabels().forEach((child, idx) => {
        const val = ticks[idx];
        // 通过val拿到偏移量
        child.attr({
          x: this.getValueOffset(val),
          y: 0,
          textBaseline: 'middle',
          textAlign: (() => {
            if (!labelFlush) return 'center';

            // use LabelFlush to control whether change the textAlign of labels on the edge of the axis os that they could stay inside the span of axis.
            if (idx === 0) return 'start';
            return idx < ticks.length - 1 ? 'center' : 'end';
          })(),
        });
      });
      return;
    }

    // vertical orient
    this.labelsGroup.attr({
      x: innerX + (align === 'end' ? labelSpacing + railWidth : 0),
      y: innerY,
    });

    // 补上 min，max
    const ticks = [min, ..._t, max];
    this.labelsGroup.getLabels().forEach((child, idx) => {
      const val = ticks[idx];
      // 通过 val 拿到偏移量
      child.attr({
        x: 0,
        y: this.getValueOffset(val),
        textBaseline: (() => {
          if (!labelFlush) return 'middle';

          // use LabelFlush to control whether change the textAlign of labels on the edge of the axis os that they could stay inside the span of axis.
          if (idx === 0) return 'top';
          return idx < ticks.length - 1 ? 'middle' : 'bottom';
        })(),
        textAlign: align === 'end' ? 'start' : 'end',
      });
    });
  }

  /**
   * 对图例进行布局
   *
   * 1. 存在 handle 的情况，不展示标签 labelsGroup
   * 2. label.align === 'rail' 时，需要调整 rail 位置
   */
  private adjustLayout() {
    const { handle, label, orient } = this.attributes;

    const { x: innerX, y: innerY } = this.availableSpace;
    const { width: handleW } = getShapeSpace(this.startHandle);

    let railX = innerX;
    let railY = innerY;

    let labelW = 0;
    let labelH = 0;
    if (handle) {
      this.labelsGroup?.hide();

      if (orient === 'horizontal') railX = innerX + handleW / 2;
    } else if (this.labelsGroup && label) {
      this.labelsGroup.show();
      this.adjustLabels();

      const { align: labelAlign, spacing: labelSpacing = 0 } = label;
      const [firstChild] = this.labelsGroup.getLabels();

      labelW = getShapeSpace(firstChild).width;
      labelH = getShapeSpace(firstChild).height;

      if (labelAlign === 'rail') {
        railX = innerX + labelW + labelSpacing;

        if (orient === 'vertical') {
          railX = innerX;
          railY = innerY + labelH + labelSpacing;
        }
      } else if (labelAlign === 'start' && orient === 'horizontal') {
        railY = innerY + getShapeSpace(firstChild).height + labelSpacing;
      } else if (labelAlign === 'start' && orient === 'vertical') {
        railX = innerX + labelSpacing;
      }
    }

    // 调整 rail位置
    this.railShape.attr({
      x: railX,
      y: railY,
    });

    // 调整 handle 位置
    this.adjustHandle();

    // 整体调整位置
    if (!label?.flush) {
      if (orient === 'horizontal') this.middleGroup.setLocalPosition(labelW / 2, 0);
      if (orient === 'vertical') this.middleGroup.setLocalPosition(0, labelH / 2);
    }
    if (orient === 'vertical') {
      let offsetX = 0;
      let offsetY = 0;

      if (handle && this.startHandle) offsetY = getShapeSpace(this.startHandle).height / 2;
      if (label?.align === 'start') offsetX = getShapeSpace(this.labelsGroup).width + (label?.spacing || 0);

      this.middleGroup.setLocalPosition(offsetX, offsetY);
    }
  }

  /**
   * 事件触发的位置对应的value值
   * @param limit {boolean} 我也忘了要干啥了
   */
  private getEventPosValue(e: any, limit: boolean = false) {
    const { min, max } = this.attributes;
    const startPos = this.getOrientVal(this.railShape.getPosition().slice(0, 2) as Pair<number>);
    const currValue = this.getOrientVal(getEventPos(e));
    const offset = currValue - startPos;
    const value = clamp(this.getValueOffset(offset, true) + min, min, max);
    return value;
  }

  /**
   * 绑定事件
   */
  private bindEvents() {
    const { orient } = this.attributes;
    // 如果！slidable，则不绑定事件或者事件响应不生效
    // 放置需要绑定drag事件的对象
    const dragObject = new Map<string, DisplayObject>();
    dragObject.set('rail', this.railShape);
    dragObject.set('start', this.startHandle);
    dragObject.set('end', this.endHandle);
    // 绑定 drag 开始事件
    dragObject.forEach((obj, key) => {
      obj.addEventListener('mousedown', this.onDragStart(key));
      obj.addEventListener('touchstart', this.onDragStart(key));
    });
  }

  /**
   * 开始拖拽
   */
  private onDragStart = (target: string) => (e: any) => {
    e.stopPropagation();
    const { slidable } = this.attributes;
    // 关闭滑动
    if (!slidable) return;
    this.target = target;
    this.prevValue = this.getTickValue(this.getEventPosValue(e));
    this.addEventListener('mousemove', this.onDragging);
    this.addEventListener('touchmove', this.onDragging);
    document.addEventListener('mouseup', this.onDragEnd);
    document.addEventListener('touchend', this.onDragEnd);
  };

  /**
   * 拖拽
   */
  private onDragging = (e: any) => {
    e.stopPropagation();
    const [start, end] = this.selection;
    const currValue = this.getTickValue(this.getEventPosValue(e));
    const diffValue = currValue - this.prevValue;
    const { target } = this;
    if (target === 'start') start !== currValue && this.updateSelection(currValue, end);
    else if (target === 'end') end !== currValue && this.updateSelection(start, currValue);
    else if (target === 'rail') {
      if (diffValue !== 0) {
        this.prevValue = currValue;
        this.updateSelection(diffValue, diffValue, true);
      }
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

  /**
   * 获取指示器内容
   */
  private getIndicatorValue(value: number): [string, unknown] {
    const { min, max, rail } = this.attributes;

    let val;
    let actualValue;

    // chunked 为 true 时
    const chunked = get(rail, ['chunked']);
    if (chunked) {
      const interval = this.getTickIntervalByValue(value);
      if (!interval) return ['', null];

      const [st, end] = interval;
      val = toPrecision((st + end) / 2, 0);
      actualValue = interval;
    } else {
      val = clamp(this.getTickValue(value), min, max);
      actualValue = val;
    }

    const formatter =
      get(this.attributes, ['indicator', 'text', 'formatter']) ??
      (chunked ? ([v1, v2]: [number, number]) => `${v1}-${v2}` : (v: number) => `${v ?? ''}`);
    const poptipValue = formatter(actualValue);

    return [poptipValue, actualValue];
  }

  @throttle(20)
  private dispatchIndicated(value: number, range?: unknown) {
    const evt = new CustomEvent('onIndicated', {
      detail: { value, range },
    });

    this.dispatchEvent(evt);
  }

  @throttle(20)
  private dispatchSelection() {
    const evt = new CustomEvent('valueChanged', {
      detail: {
        value: this.selection,
      },
    });
    this.dispatchEvent(evt);
  }
}
