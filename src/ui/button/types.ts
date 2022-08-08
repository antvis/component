import { Cursor } from '@antv/g';
import type { MarkerStyleProps } from '../marker';
import type { DisplayObjectConfig, MixAttrs, TextProps, RectProps } from '../../types';

export type IMarkerCfg = Omit<MarkerStyleProps, 'symbol'>;

/**
 * @title Button 组件
 * @description Button 组件默认交互行为，hover 触发 active 状态，可以设置 disabled 状态，通过 onClick 事件可以设置点击回调处理。
 */
export type ButtonCfg = {
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
   * @title 类型
   * @description 按钮类型
   */
  type?: 'primary' | 'dashed' | 'link' | 'text' | 'default';
  /**
   * @title 大小
   * @description 按钮大小尺寸
   */
  size?: 'small' | 'middle' | 'large';
  /**
   * @title 宽度
   * @description 按钮宽度
   */
  width?: number;
  /**
   * @title 高度
   * @description 按钮高度
   */
  height?: number;
  /**
   * @title 形状
   * @description 按钮形状
   */
  shape?: 'circle' | 'round';
  /**
   * @title 按钮状态
   * @description disabled 代表禁用按钮, active 代表
   */
  state?: 'disabled' | 'active' | 'default';
  /**
   * @title 超长省略
   * @description 按钮文本超长时，是否省略文本
   */
  ellipsis?: boolean;
  /**
   * @title 内间距
   * @description 文本与按钮边缘的间距
   */
  padding?: number;
  /**
   * @title 标签文本
   * @description 按钮文本
   */
  text?: string;
  /**
   * @title 图标
   * @description 图标
   */
  marker?: MarkerStyleProps['symbol'];
  /**
   * @description marker 位置
   */
  markerAlign?: 'left' | 'right';
  /**
   * @description marker 与文本 间距
   */
  markerSpacing?: number;
  /**
   * @title 文本样式
   * @description 自定义文本样式，各种状态样式（default、active 和 disabled）
   */
  textStyle?: MixAttrs<Partial<TextProps>>;
  /**
   * @title 按钮样式
   * @description 自定义按钮样式，各种状态样式（default、active 和 disabled）
   */
  buttonStyle?: MixAttrs<Partial<RectProps>>;
  /**
   * @title 图标样式
   * @description 自定义图标样式，各种状态样式（default、active 和 disabled）
   */
  markerStyle?: MixAttrs<IMarkerCfg>;
  /**
   * @title 指针样式
   */
  cursor?: Cursor;
  /**
   * @title 点击回调函数
   * @description 点击回调函数
   */
  onClick?: Function;
};

export type ButtonOptions = DisplayObjectConfig<ButtonCfg>;
