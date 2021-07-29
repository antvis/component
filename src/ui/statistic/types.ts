import { DisplayObject } from '@antv/g';
import type { ShapeAttrs, ShapeCfg } from '../../types';

export interface TitleOption {
  text?: string | number;
  /**
   * 标题 自定义文本样式
   */
  style?: ShapeAttrs;
  /**
   * 文本格式化
   */
  formatter?: (text: string) => string | DisplayObject;
}
export interface ValueOption extends TitleOption {
  /**
   * 值 前缀
   */
  prefix?: any;
  /**
   * 值 前缀
   */
  suffix?: any;
}

export type StatisticAttrs = {
  x?: number;
  y?: number;
  /**
   * 标题
   */
  title?: TitleOption;
  /**
   * 值 string | 数值 | 时间(毫秒)
   */
  value?: ValueOption;
  /**
   * 标题 值 上下间距
   */
  spacing?: number;
};

export type StatisticOptions = ShapeCfg & {
  attrs: StatisticAttrs;
};
