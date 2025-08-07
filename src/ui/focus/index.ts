import { deepMix } from '@antv/util';
import { DisplayObject, Group } from '../../shapes';
import { Component } from '../../core';
import { Marker } from '../marker';
import { focus as focusSymbol } from '../marker/symbol';
import type { FocusOptions, FocusStyleProps } from './types';

export type { FocusStyleProps, FocusOptions };

export class Focus extends Component<FocusStyleProps> {
  public static tag = 'focus';

  private static defaultOptions = {
    style: {
      x: 0,
      y: 0,
      size: 16,
      opacity: 1,
      symbol: 'focus',
      stroke: '#aaaaaa',
      lineWidth: 1,
    },
  };

  /** 所有绑定的目标对象 */
  private map: Map<DisplayObject, any[]> = new Map();

  /** 当前显示的marker */
  private marker: any = null;

  constructor(options: FocusOptions) {
    super(deepMix({}, Focus.defaultOptions, options));
    this.render(this.attributes);
  }

  public render(attributes: FocusStyleProps) {
    if (!this.marker) {
      this.marker = new Marker({
        style: {
          x: 0,
          y: 0,
          symbol: focusSymbol,
          opacity: this.style.opacity,
          size: this.style.size,
          stroke: this.style.stroke,
          lineWidth: this.style.lineWidth,
        },
      });
      this.appendChild(this.marker);
    }
  }

  /**
   * 绑定元素
   */
  public bind(element: DisplayObject) {
    if (!element) return this;

    const onmouseenter = (e: any) => {
      const { x, y } = this.getElementCenter(element);
      this.showFocus(x, y);
    };

    const onmouseleave = () => {
      this.hideFocus();
    };

    element.addEventListener('mouseenter', onmouseenter);
    element.addEventListener('mouseleave', onmouseleave);

    // 存储监听
    this.map.set(element, [onmouseenter, onmouseleave]);

    return this;
  }

  public unbind(element: DisplayObject): void {
    if (this.map.has(element)) {
      const [listener1, listener2] = this.map.get(element) || [];
      listener1 && element.removeEventListener('mouseenter', listener1);
      listener2 && element.removeEventListener('mouseleave', listener2);
      this.map.delete(element);
    }
  }

  /**
   * 显示focus图标
   */
  public showFocus(x: number, y: number) {
    this.marker.update({
      x,
      y,
    });

    this.style.opacity = 0.6;
  }

  /**
   * 隐藏focus图标
   */
  public hideFocus() {
    this.style.opacity = 0;
  }

  /**
   * 清除
   */
  public destroy() {
    [...this.map.keys()].forEach((ele) => this.unbind(ele));

    if (this.marker) {
      this.marker.destroy();
      this.marker = null;
    }

    super.destroy();
  }

  /**
   * 获取元素中心点坐标
   */
  private getElementCenter(element: DisplayObject): { x: number; y: number } {
    const bbox = element.getBounds();
    return {
      x: bbox.center[0],
      y: bbox.center[1],
    };
  }
}
