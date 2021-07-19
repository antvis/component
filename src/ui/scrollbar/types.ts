import type { ShapeAttrs, ShapeCfg } from '../../types';

export interface ScrollStyle {
  default: ShapeAttrs;
  active: ShapeAttrs;
}

export type Orient = 'horizontal' | 'vertical';

/**
 * 滚动条组件的属性配置
 */
export type ScrollbarAttrs = ShapeAttrs & {
  /**
   * 滑条朝向
   */
  orient?: Orient;

  /**
   * 轨道宽度
   */
  width?: number;

  /**
   * 轨道高度
   */
  height?: number;

  /**
   * 滚动条的值
   */
  value?: number;

  /**
   * 可滚动范围的值的上限
   */
  min?: number;

  /**
   * 可滚动范围的值的下限
   */
  max?: number;

  /**
   * 滑块是否圆角
   */
  isRound?: boolean;

  /**
   * 滑块长度
   */
  thumbLen?: number;

  /**
   * 滚动条内边距，影响滑轨的实际可用空间 [top, right, bottom, left]
   */
  padding?: [number, number, number, number];

  /**
   * 滑轨样式
   */
  trackStyle?: ScrollStyle;

  /**
   * 滑块样式
   */
  thumbStyle?: ScrollStyle;
};

/**
 * 滚动条组件的配置项
 */
export type ScrollbarOptions = ShapeCfg & { attrs: ScrollbarAttrs };
