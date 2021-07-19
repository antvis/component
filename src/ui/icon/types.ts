import type { ShapeAttrs, ShapeCfg } from '../../types';
import type { MarkerOptions } from '../marker';

export type IconAttrs = ShapeAttrs & {
  /**
   * symbol 的图标类型，也可以自定义
   */
  symbol: MarkerOptions['symbol'];
  /**
   * 图标的大小，默认为 16px
   */
  size?: number;
  /**
   * Icon 图标的颜色
   */
  fill?: string;
  /**
   * 图标的样式
   */
  markerStyle?: ShapeAttrs;
  /**
   * 间距，默认为 8px
   */
  spacing?: number;
  /**
   * 图标附属的文本，默认不显示
   */
  text?: string;
  /**
   * 文本的样式
   */
  textStyle?: ShapeAttrs;
};

export type IconOptions = ShapeCfg & {
  attrs: IconAttrs;
};
