import { ShapeAttrs, ShapeCfg } from '../../types';

export interface ScrollStyle {
  default: ShapeAttrs;
  active: ShapeAttrs;
}

export type Orient = 'horizontal' | 'vertical';

export type ScrollbarOptions = ShapeCfg & {
  attrs: {
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
     * 滑轨样式
     */
    trackStyle?: ScrollStyle;

    /**
     * 滑块样式
     */
    thumbStyle?: ScrollStyle;
  };
};
