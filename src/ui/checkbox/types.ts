import type { RectStyleProps, TextStyleProps, DisplayObjectConfig } from '@antv/g';

export type CheckboxStyleProps = {
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
   * @title 是否选中
   * @description 指定当前是否选中
   */
  checked?: boolean;
  /**
   * @title label chebox 间距
   * @description label 与 chebox 的方块的间距
   * @default 2
   */
  spacing?: number;
  /**
   * @title label 文本配置
   * @description
   */
  label?: TextStyleProps;
  /**
   * @title checkbox 的方块样式
   * @description checkbox 的方块样式
   */
  boxStyle?: Partial<RectStyleProps> | null;
  /**
   * @title checkbox 的内部图标样式
   * @description
   */
  checkedStyle?: Partial<RectStyleProps> | null;
};

export type CheckboxOptions = DisplayObjectConfig<CheckboxStyleProps>;
