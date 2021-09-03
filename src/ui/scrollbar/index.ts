import { Rect, CustomEvent } from '@antv/g';
import { clamp, deepMix, get } from '@antv/util';
import { GUI } from '../../core/gui';
import { getStateStyle, getEventPos, normalPadding } from '../../util';
import type { RectProps } from '../../types';
import type { ScrollbarOptions, ScrollbarCfg } from './types';

export type { ScrollbarOptions, ScrollbarCfg };

export class Scrollbar extends GUI<Required<ScrollbarCfg>> {
  /**
   * tag
   */
  public static tag = 'scrollbar';

  private static defaultOptions = {
    type: Scrollbar.tag,
    style: {
      // 滑条朝向
      orient: 'vertical',

      // 轨道宽高
      width: 10,
      height: 200,
      value: 0,

      // 滑块范围控制
      min: 0,
      max: 1,
      // 滑块是否为圆角
      isRound: true,

      // 滑块长度
      thumbLen: 20,

      // 滚动条内边距，影响滑轨的实际可用空间
      padding: [2, 2, 2, 2],

      trackStyle: {
        default: {
          fill: '#fafafa',
          lineWidth: 1,
          stroke: '#e8e8e8',
        },
        active: {},
      },

      thumbStyle: {
        default: {
          fill: '#c1c1c1',
        },
        active: {
          opacity: 0.8,
        },
      },
    },
  };

  /**
   * 计算滑块重心在轨道的比例位置
   * @param offset 额外的偏移量
   */
  public get value() {
    return this.getAttribute('value') as number;
  }

  /**
   * 设置value
   * @param value 当前位置的占比
   */
  public set value(value: number) {
    const { value: oldValue, min, max } = this.attributes;
    this.setAttribute('value', clamp(value, min, max));
    // 通知触发valueChanged
    this.onValueChanged(oldValue);
  }

  // 滑道
  private trackShape!: Rect;

  // 滑块
  private thumbShape!: Rect;

  /**
   * 拖动开始位置
   */
  private prevPos!: number;

  private get padding(): [number, number, number, number] {
    const { padding } = this.attributes;
    return normalPadding(padding);
  }

  /**
   * 获得轨道可用空间
   */
  private get availableSpace() {
    const { width, height } = this.attributes;
    const [top, right, bottom, left] = this.padding;
    return {
      x: left,
      y: top,
      width: width - (left + right),
      height: height - (top + bottom),
    };
  }

  /**
   * 获得轨道长度
   */
  private get trackLen() {
    const { width, height } = this.availableSpace;
    return this.getOrientVal([width, height]);
  }

  /**
   * 滑块的圆角半径
   */
  private get thumbRadius() {
    const { isRound } = this.attributes;
    const { width, height } = this.availableSpace;
    const radius = get(this.attributes, ['thumbStyle', 'default', 'radius']);
    if (!isRound) return 0;
    return radius || this.getOrientVal([height, width]) / 2;
  }

  private get trackShapeCfg() {
    const { x, y, width, height } = this.attributes;
    return { x, y, ...this.getStyle('trackStyle'), width, height };
  }

  private get thumbShapeCfg() {
    const { value, thumbLen } = this.attributes;
    const trackInner = this.availableSpace;
    const { x, y } = trackInner;
    const { thumbRadius } = this;
    const valueOffset = this.valueOffset(value);
    return {
      ...trackInner,
      ...this.getStyle('thumbStyle'),
      ...this.getOrientVal([
        { x: x + valueOffset, width: thumbLen },
        { y: y + valueOffset, height: thumbLen },
      ]),
      radius: thumbRadius,
    };
  }

  constructor(options: ScrollbarOptions) {
    super(deepMix({}, Scrollbar.defaultOptions, options));
    this.init();
  }

  attributeChangedCallback<Key extends keyof ScrollbarCfg>(
    name: Key,
    oldValue: ScrollbarCfg[Key],
    newValue: ScrollbarCfg[Key]
  ): void {
    // 变更属性时需要重新计算value
    if (name === 'value') {
      const thumbOffset = this.valueOffset(newValue as number);
      const [top, , , left] = this.padding;
      this.setThumbOffset(thumbOffset + this.getOrientVal([left, top]));
    }
  }

  /**
   * 计算滑块重心在轨道的比例位置
   * @param offset 额外的偏移量
   */
  public getValue() {
    return this.getAttribute('value');
  }

  /**
   * 设置value
   * @param value 当前位置的占比
   */
  public setValue(value: number) {
    this.value = value;
  }

  /**
   * 设置相对偏移，鼠标拖动、滚轮滑动时使用
   * @param offset 鼠标、滚轮的偏移量
   */
  public setOffset(deltaOffset: number) {
    const value = this.getValue() as number;
    this.setValue(this.valueOffset(deltaOffset, true) + value);
  }

  public init() {
    this.initShape();
    this.trackShape.attr(this.trackShapeCfg);
    this.thumbShape.attr(this.thumbShapeCfg);
    this.bindEvents();
  }

  /**
   * 组件的更新
   */
  public update(cfg: Partial<ScrollbarCfg>) {
    this.attr(deepMix({}, this.attributes, cfg));
    this.trackShape.attr(this.trackShapeCfg);
    this.thumbShape.attr(this.thumbShapeCfg);
  }

  /**
   * 组件的清除
   */
  public clear() {}

  public destroy() {
    this.removeChildren(true);
  }

  private initShape() {
    this.trackShape = new Rect({ name: 'track' });
    this.appendChild(this.trackShape);
    this.thumbShape = new Rect({ name: 'thumb' });
    this.trackShape.appendChild(this.thumbShape);
  }

  /**
   * 值改变事件
   */
  private onValueChanged = (oldValue: any) => {
    const newValue = this.value;
    if (oldValue === newValue) return;
    const evtVal = {
      detail: {
        oldValue,
        value: newValue,
      },
    };
    const scrollEvt = new CustomEvent('scroll', evtVal);
    this.dispatchEvent(scrollEvt);
    const valueChangedEvt = new CustomEvent('valueChanged', evtVal);
    this.dispatchEvent(valueChangedEvt);
  };

  /**
   * value - offset 相互转换
   * @param num
   * @param reverse true - value -> offset; false - offset -> value
   * @returns
   */
  private valueOffset(num: number, reverse = false) {
    const { thumbLen, min, max } = this.attributes;
    const L = this.trackLen - thumbLen;
    if (!reverse) {
      // value2offset
      return L * clamp(num, min, max);
    }
    // offset2value
    return num / L;
  }

  /* 获取样式属性
   * @param name style的key值
   * @param isActive 是否激活状态的样式
   */
  private getStyle(name: 'thumbStyle' | 'trackStyle', state: 'default' | 'active' = 'default') {
    return getStateStyle<RectProps>(get(this.attributes, name), state);
  }

  /**
   * 将滑块移动至指定位置
   * @param thumbOffset 滑块位置偏移量
   */
  private setThumbOffset(thumbOffset: number) {
    this.thumbShape.attr(this.getOrientVal<'x' | 'y'>(['x', 'y']), thumbOffset);
  }

  private bindEvents() {
    this.trackShape.addEventListener('click', this.onTrackClick);
    this.thumbShape.addEventListener('mousedown', this.onDragStart);
    this.thumbShape.addEventListener('touchstart', this.onDragStart);
    this.onHover();
  }

  /**
   * 根据orient取出对应轴向上的值
   * 主要用于取鼠标坐标在orient方向上的位置
   */
  private getOrientVal<T>(values: [T, T]) {
    const { orient } = this.attributes;
    return orient === 'horizontal' ? values[0] : values[1];
  }

  /**
   * 点击轨道事件
   */
  private onTrackClick = (e: any) => {
    const { x, y, thumbLen } = this.attributes;
    const [top, , , left] = this.padding;
    const basePos = this.getOrientVal([x + left, y + top]);
    const clickPos = this.getOrientVal(getEventPos(e)) - thumbLen / 2;
    const value = this.valueOffset(clickPos - basePos, true);
    this.setValue(value);
  };

  /**
   * 悬浮事件
   */
  private onHover() {
    this.thumbShape.addEventListener('mouseenter', this.onThumbMouseenter);
    this.trackShape.addEventListener('mouseenter', this.onTrackMouseenter);
    this.thumbShape.addEventListener('mouseleave', this.onThumbMouseleave);
    this.trackShape.addEventListener('mouseleave', this.onTrackMouseleave);
  }

  private onThumbMouseenter = () => {
    this.thumbShape.attr(this.getStyle('thumbStyle', 'active'));
  };

  private onTrackMouseenter = () => {
    this.trackShape.attr(this.getStyle('trackStyle', 'active'));
  };

  private onThumbMouseleave = () => {
    this.thumbShape.attr(this.getStyle('thumbStyle'));
  };

  private onTrackMouseleave = () => {
    this.trackShape.attr(this.getStyle('trackStyle'));
  };

  private onDragStart = (e: any) => {
    e.stopPropagation();
    this.prevPos = this.getOrientVal(getEventPos(e));
    document.addEventListener('mousemove', this.onDragging);
    document.addEventListener('mouseup', this.onDragEnd);
    document.addEventListener('touchmove', this.onDragging);
    document.addEventListener('touchcancel', this.onDragEnd);
  };

  private onDragging = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation();
    const currPos = this.getOrientVal(getEventPos(e));
    const diff = currPos - this.prevPos;
    this.setOffset(diff);
    this.prevPos = currPos;
  };

  private onDragEnd = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    document.removeEventListener('mousemove', this.onDragging);
    document.removeEventListener('mouseup', this.onDragEnd);
    document.removeEventListener('touchmove', this.onDragging);
    document.removeEventListener('touchcancel', this.onDragEnd);
  };
}
