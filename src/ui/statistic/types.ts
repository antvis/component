import { MarkerStyleProps } from 'ui/marker';
import type { DisplayObjectConfig, LabelProps, RectProps } from '../../types';

export type StatisticCfg = {
  /**
   * @title x 坐标
   * @description 局部坐标系下 x 轴坐标
   */
  x?: number;
  /**
   * @title y 坐标
   * @description 局部坐标系下 y 轴坐标
   */
  y?: number;
  /**
   * @title 标题
   * @description 指标卡标题，可以自定义文本和图标。
   */
  title?: LabelProps & {
    /**
     * @title 图标
     * @description 标签文本前缀的图标
     */
    marker?: MarkerStyleProps;
  };
  /**
   * @title 值 string | 数值 | 时间(毫秒)
   * @description 指标卡数值内容，可以自定义文本和图标
   */
  value?: LabelProps & {
    /**
     * @title 图标
     * @description 标签文本前缀的图标
     */
    marker?: MarkerStyleProps;
  };
  /**
   * @title 间距
   * @description 标题、值的上下间距
   */
  spacing?: number;

  /**
   * @title 背景样式
   * @description background 背景样式
   */
  backgroundStyle?: {
    /** 默认样式 */
    default?: Partial<RectProps>;
    /** 激活样式 */
    active?: Partial<RectProps>;
  };
};

export type StatisticOptions = DisplayObjectConfig<StatisticCfg>;
