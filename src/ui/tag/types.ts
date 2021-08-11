import type { MarkerCfg } from '../marker';
import type { RectProps, TextProps, DisplayObjectConfig } from '../../types';

export type TagCfg = {
  /** 位置 x */
  x?: number;
  /** 位置 y */
  y?: number;
  /**
   * tag 文本
   */
  text: string;
  /**
   * 图标类型，也可以自定义; 默认不显示
   */
  marker?: MarkerCfg;
  /**
   * text 和 marker 的间距，默认为 4px (只有当 marker 存在时，才生效)
   */
  spacing?: number;

  // 样式相关
  /** 内边距 */
  padding?: number | number[];
  /** border-radius 圆角 */
  radius?: number;
  /** 文本的样式 */
  textStyle?: {
    /** 默认样式 */
    default?: Partial<TextProps>;
    /** 激活样式 */
    active?: Partial<TextProps>;
  };

  /** background 背景样式 */
  backgroundStyle?: {
    /** 默认样式 */
    default?: Partial<RectProps>;
    /** 激活样式 */
    active?: Partial<RectProps>;
  };
};

export type TagOptions = DisplayObjectConfig<TagCfg>;
