import type { ShapeAttrs, DisplayObjectConfig, RectProps } from '../../types';
import type { TagCfg } from '../tag/types';

export type TitleCfg = {
  /** 文本内容 */
  text?: string | number;
  /** 文本样式 */
  style?: ShapeAttrs;
  /** 文本格式化 */
  formatter?: (text: any) => string;
};

export type ValueCfg = TitleCfg & {
  /**
   * 值 前缀
   */
  prefix?: any;
  /**
   * 值 后缀
   */
  suffix?: any;
};

export type StatisticCfg = {
  x?: number;
  y?: number;
  /**
   * 标题
   */
  title?: TagCfg;
  /**
   * 值 string | 数值 | 时间(毫秒)
   */
  value?: TagCfg;
  /**
   * 标题 值 上下间距
   */
  spacing?: number;

  /** background 背景样式 */
  backgroundStyle?: {
    /** 默认样式 */
    default?: Partial<RectProps>;
    /** 激活样式 */
    active?: Partial<RectProps>;
  };
};

export type StatisticOptions = DisplayObjectConfig<StatisticCfg>;
