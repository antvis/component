import type { ShapeAttrs, ShapeCfg } from '../../types';

export type ButtonAttrs = {
  x?: number;
  y?: number;
  /**
   * 按钮类型
   */
  type?: 'primary' | 'dashed' | 'link' | 'text' | 'default';
  /**
   * 按钮尺寸
   */
  size?: 'small' | 'middle' | 'large';
  /**
   * 按钮形状
   */
  shape?: 'circle' | 'round';
  /**
   * 按钮禁用
   */
  disabled?: boolean;
  /**
   * 省略超长文本
   */
  ellipsis?: boolean;
  /**
   * 文本与按钮边缘的间距
   */
  padding?: number;
  /**
   * 按钮文本
   */
  text?: string;
  /**
   * 点击回调函数
   */
  onClick?: Function;
  /**
   * 自定义文本样式
   */
  textStyle?: ShapeAttrs;
  /**
   * 自定义按钮样式
   */
  buttonStyle?: ShapeAttrs;
  /**
   * 自定义激活状态
   */
  hoverStyle?: {
    textStyle: ShapeAttrs;
    buttonStyle: ShapeAttrs;
  };
};

export type ButtonOptions = ShapeCfg & {
  attrs: ButtonAttrs;
};
