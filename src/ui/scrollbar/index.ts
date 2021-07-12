import { Rect } from '@antv/g';
import { clamp, deepMix } from '@antv/util';
import { GUI } from '../core/gui';
import { applyAttrs, isPC } from '../../util';
import type { DisplayObject } from '../../types';
import type { ScrollbarOptions, ScrollbarAttrs } from './types';

export type { ScrollbarOptions, ScrollbarAttrs };

export class Scrollbar extends GUI<ScrollbarOptions> {
  /**
   * tag
   */
  public static tag = 'scrollbar';

  /**
   * 轨道
   */
  private trackShape: DisplayObject;

  /**
   * 滑块
   */
  private thumbShape: DisplayObject;

  /**
   * 拖动开始位置
   */
  private prevPos: number;

  private static defaultOptions = {
    type: Scrollbar.tag,
    attrs: {
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

  attributeChangedCallback(name: string, value: any): void {
    // 变更属性时需要重新计算value
    if (name === 'value') {
      const { padding } = this.attributes;
      const thumbOffset = this.valueOffset(value);
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
    const value = this.getValue();
    this.setValue(this.valueOffset(deltaOffset, true) + value);
  }

  public init() {
    this.createTrack();
    this.createThumb();

    const { x, y } = this.attributes;
    this.translate(x, y);
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
   * 值改变事件
   */
  private onValueChanged = (oldValue: any) => {
    const newValue = this.getValue();
    if (oldValue === newValue) return;
    this.emit('scroll', newValue);
    this.emit('valuechange', {
      oldValue,
      value: newValue,
    });
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
    this.thumbShape.setAttribute(this.getOrientVal(['x', 'y']), thumbOffset);
  }

  /**
   * 生成轨道属性
   */
  private createTrack() {
    const { width, height, trackStyle } = this.attributes;
    this.trackShape = new Rect({
      attrs: {
        x: 0,
        y: 0,
        ...trackStyle.default,
        width,
        height,
      },
    });
    this.appendChild(this.trackShape);
  }

  /**
   * 生成滑块属性
   */
  private createThumb() {
    const { orient, value, isRound, thumbLen, thumbStyle } = this.attributes;
    const trackInner = this.getAvailableSpace();
    const { x, y, width, height } = trackInner;
    const baseAttrs = {
      ...trackInner,
      ...thumbStyle.default,
    };

    this.thumbShape = new Rect({
      attrs: (() => {
        let half = width / 2;
        if (orient === 'vertical') {
          return {
            ...baseAttrs,
            y: y + this.valueOffset(value),
            height: thumbLen,
            radius: isRound ? half : 0,
          };
        }
        half = height / 2;
        return {
          ...baseAttrs,
          x: x + this.valueOffset(value),
          width: thumbLen,
          radius: isRound ? half : 0,
        };
      })(),
    });
    this.appendChild(this.thumbShape);
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
  private onTrackClick = (e) => {
    const { x, y, padding, thumbLen } = this.attributes;
    const [top, , , left] = padding;
    const basePos = this.getOrientVal([x + left, y + top]);
    const clickPos = this.getOrientVal([e.x, e.y]) - thumbLen / 2;
    const value = this.valueOffset(clickPos - basePos, true);
    this.setValue(value);
  };

  /**
   * 悬浮事件
   */
  private onHover() {
    const { thumbStyle, trackStyle } = this.attributes;
    // 滑块hover
    this.thumbShape.addEventListener('mouseenter', () => {
      applyAttrs(this.thumbShape, thumbStyle.active);
    });
    this.thumbShape.addEventListener('mouseleave', () => {
      applyAttrs(this.thumbShape, thumbStyle.default);
    });

    // 滑轨hover
    this.trackShape.addEventListener('mouseenter', () => {
      applyAttrs(this.trackShape, trackStyle.active);
    });
    this.trackShape.addEventListener('mouseleave', () => {
      applyAttrs(this.trackShape, trackStyle.default);
    });
  }

  private onDragStart = (e: MouseEvent) => {
    e.stopPropagation();
    this.prevPos = this.getOrientVal([e.x, e.y]);
    document.addEventListener('mousemove', this.onDragging);
    document.addEventListener('mouseup', this.onDragEnd);
    document.addEventListener('touchmove', this.onDragging);
    document.addEventListener('touchcancel', this.onDragEnd);
  };

  private onDragging = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation();
    // @ts-ignore
    const currPos = this.getOrientVal(isPC() ? [e.offsetX, e.offsetY] : [e.touches[0].clientX, e.touches[0].clientY]);
    const diff = currPos - this.prevPos;
    this.setOffset(diff);
    this.prevPos = currPos;
  };

  private onDragEnd = (e: MouseEvent) => {
    e.preventDefault();
    document.removeEventListener('mousemove', this.onDragging);
    document.removeEventListener('mouseup', this.onDragEnd);
    document.removeEventListener('touchmove', this.onDragging);
    document.removeEventListener('touchcancel', this.onDragEnd);
  };
}
