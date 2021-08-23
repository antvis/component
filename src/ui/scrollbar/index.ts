import { Rect, CustomEvent } from '@antv/g';
import { clamp, deepMix, get } from '@antv/util';
import { GUI } from '../../core/gui';
import { getStateStyle, getEventPos } from '../../util';
import type { RectProps } from '../../types';
import type { ScrollbarOptions, ScrollbarCfg } from './types';

export type { ScrollbarOptions, ScrollbarCfg };

export class Scrollbar extends GUI<Required<ScrollbarCfg>> {
  /**
   * tag
   */
  public static tag = 'scrollbar';

  // 滑道
  private trackShape!: Rect;

  // 滑块
  private thumbShape!: Rect;

  /**
   * 拖动开始位置
   */
  private prevPos!: number;

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
          fill: '#7d7d7d',
        },
      },
    },
  };

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
      const { padding } = this.attributes;
      const thumbOffset = this.valueOffset(newValue as number);
      const [top, , , left] = padding;
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
    const { value: oldValue } = this.attributes;
    this.setAttribute('value', value);
    // 通知触发valueChange
    this.onValueChanged(oldValue);
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
    this.trackShape.attr(this.getTrackShapeCfg());
    this.thumbShape.attr(this.getThumbShapeCfg());
    this.bindEvents();
  }

  /**
   * 组件的更新
   */
  public update(cfg: Partial<ScrollbarCfg>) {
    this.attr(deepMix({}, this.attributes, cfg));
    this.trackShape.attr(this.getTrackShapeCfg());
    this.thumbShape.attr(this.getThumbShapeCfg());
  }

  /**
   * 组件的清除
   */
  public clear() {}

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
    const newValue = this.getValue();
    if (oldValue === newValue) return;
    const evtVal = {
      detail: {
        oldValue,
        value: newValue,
      },
    };
    const scrollEvt = new CustomEvent('scroll', evtVal);
    this.dispatchEvent(scrollEvt);
    const valuechangeEvt = new CustomEvent('valueChange', evtVal);
    this.dispatchEvent(valuechangeEvt);
  };

  /**
   * value - offset 相互转换
   * @param num
   * @param reverse true - value -> offset; false - offset -> value
   * @returns
   */
  private valueOffset(num: number, reverse = false) {
    const { thumbLen, min, max } = this.attributes;
    const L = this.getTrackLen() - thumbLen;
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
   * 获得轨道可用空间
   */
  private getAvailableSpace() {
    const { width, height, padding } = this.attributes;
    const [top, right, bottom, left] = padding;
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
  private getTrackLen() {
    const { width, height } = this.getAvailableSpace();
    return this.getOrientVal([width, height]);
  }

  /**
   * 将滑块移动至指定位置
   * @param thumbOffset 滑块位置偏移量
   */
  private setThumbOffset(thumbOffset: number) {
    this.thumbShape.attr(this.getOrientVal<'x' | 'y'>(['x', 'y']), thumbOffset);
  }

  private getTrackShapeCfg() {
    const { x, y, width, height } = this.attributes;
    return { x, y, ...this.getStyle('trackStyle'), width, height };
  }

  private getThumbShapeCfg() {
    const { orient, value, isRound, thumbLen } = this.attributes;
    const trackInner = this.getAvailableSpace();
    const { x, y, width, height } = trackInner;
    const baseCfg = {
      ...trackInner,
      ...this.getStyle('thumbStyle'),
    };
    let half = width / 2;
    if (orient === 'vertical') {
      return {
        ...baseCfg,
        y: y + this.valueOffset(value),
        height: thumbLen,
        radius: isRound ? half : 0,
      };
    }
    half = height / 2;
    return {
      ...baseCfg,
      x: x + this.valueOffset(value),
      width: thumbLen,
      radius: isRound ? half : 0,
    };
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
    const { x, y, padding, thumbLen } = this.attributes;
    const [top, , , left] = padding;
    const basePos = this.getOrientVal([x + left, y + top]);
    const clickPos = this.getOrientVal(getEventPos(e)) - thumbLen / 2;
    const value = this.valueOffset(clickPos - basePos, true);
    this.setValue(value);
  };

  /**
   * 悬浮事件
   */
  private onHover() {
    ['thumb', 'track'].forEach((name) => {
      const target = get(this, `${name}Shape`);
      target.addEventListener('mouseenter', () => {
        target.attr(this.getStyle(`${name}Style` as 'thumbStyle' | 'trackStyle', 'active'));
      });
      target.addEventListener('mouseleave', () => {
        target.attr(this.getStyle(`${name}Style` as 'thumbStyle' | 'trackStyle'));
      });
    });
  }

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
