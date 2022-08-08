import { Rect, CustomEvent, Group } from '@antv/g';
import { clamp, deepMix, get } from '@antv/util';
import { GUI } from '../../core/gui';
import { getStateStyle, getEventPos, normalPadding, maybeAppend, applyStyle } from '../../util';
import type { RectProps } from '../../types';
import type { ScrollbarOptions, ScrollbarStyleProps } from './types';

export type { ScrollbarOptions, ScrollbarStyleProps };

export class Scrollbar extends GUI<Required<ScrollbarStyleProps>> {
  /**
   * tag
   */
  public static tag = 'scrollbar';

  private static defaultOptions = {
    type: Scrollbar.tag,
    style: {
      // 滑条朝向
      orient: 'vertical',

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

  constructor(options: ScrollbarOptions) {
    super(deepMix({}, Scrollbar.defaultOptions, options));
  }

  public render(attributes: ScrollbarStyleProps, container: Group) {
    const { width, height, trackStyle, thumbStyle, value, thumbLen, orient } = attributes;

    const group = maybeAppend(container, '.track', 'rect')
      .attr('className', 'track')
      .style('width', width ?? 10)
      .style('height', height ?? 200)
      .call(applyStyle, getStateStyle(trackStyle))
      .node();

    const valueOffset = this.valueOffset(value || 0);
    const bbox = this.availableSpace;
    this.thumbShape = maybeAppend(group, '.thumb', 'rect')
      .attr('className', 'thumb')
      .style('x', orient === 'vertical' ? bbox.x : bbox.x + valueOffset)
      .style('y', orient === 'vertical' ? bbox.y + valueOffset : bbox.y)
      .style('width', orient === 'vertical' ? bbox.width : thumbLen)
      .style('height', orient === 'vertical' ? thumbLen : bbox.height)
      .style('radius', this.thumbRadius)
      .call(applyStyle, getStateStyle(thumbStyle))
      .node();

    this.trackShape = group;
  }

  /**
   * 计算滑块重心在轨道的比例位置
   * @param offset 额外的偏移量
   */
  public getValue() {
    return this.style.value;
  }

  /**
   * 设置value
   * @param value 当前位置的占比
   */
  public setValue(value: number) {
    const { value: oldValue, min, max } = this.style;
    this.update({ value: clamp(value, min, max) });

    // 通知触发valueChanged
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

  /**
   * 值改变事件
   */
  private onValueChanged = (oldValue: any) => {
    const { value: newValue } = this.style;
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

  public bindEvents() {
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
    const { thumbLen } = this.attributes;
    const [x, y] = this.getLocalPosition();
    const [top, , , left] = this.padding;
    const basePos = this.getOrientVal([(x as number) + left, (y as number) + top]);
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
