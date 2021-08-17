import type { MarkerCfg } from '../marker';
import type { RectProps, TextProps, MixAttrs, DisplayObjectConfig } from '../../types';

export type TagCfg = {
  /** 位置 x */
  x?: number;
  /** 位置 y */
  y?: number;
  /**
   * tag 文本
   */
  text?: string;
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
  textStyle?: MixAttrs<Partial<TextProps>>;

  /** background 背景样式 */
  backgroundStyle?: MixAttrs<Partial<TextProps>>;
};

export type TagOptions = DisplayObjectConfig<TagCfg>;
