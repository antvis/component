import type { DisplayObjectConfig, RectProps } from '../../types';
import type { TagCfg } from '../tag/types';

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
