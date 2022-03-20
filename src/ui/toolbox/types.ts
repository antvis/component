import type { DisplayObject, DisplayObjectConfig, MixAttrs, ShapeAttrs, TextProps } from '../../types';

/**
 * @title toolbox 菜单项的构造函数
 */
export type FeatureCtor = (style: { size?: number }) => DisplayObject;

/**
 * @title Toolbox 组件
 */
export type ToolboxCfg = {
  /**
   * @title x 坐标
   * @description 局部坐标系下 x 轴坐标
   * @default 0
   */
  x?: number;
  /**
   * @title y 坐标
   * @description 局部坐标系下 y 轴坐标
   * @default 0
   */
  y?: number;
  /**
   * @title 宽度
   * @title toolbox 容器宽度，默认根据子元素自适应
   */
  width?: number;
  /**
   * @title 高度
   * @title toolbox 容器高度，默认根据子元素自适应
   */
  height?: number;
  /**
   * @title 菜单项列表
   */
  features: string[];
  /**
   * @description feature 之间的间距
   * @default 8
   */
  spacing?: number;
  /**
   * @description 操作菜单的 marker 大小
   * @default 24
   */
  markerSize?: number;
  /**
   * @description 操作菜单的 marker 样式
   */
  markerStyle?: MixAttrs<Partial<ShapeAttrs>>;
  /**
   * @title 字体样式
   */
  textStyle?: Partial<TextProps>;
  /**
   * @title 布局
   * @description 排列布局，纵向或横向
   */
  orient?: 'horizontal' | 'vertical';
  /**
   * @title 监听点击事件
   */
  onClick?: (name: string, e: any) => void;
};

export type ToolboxOptions = DisplayObjectConfig<ToolboxCfg>;
