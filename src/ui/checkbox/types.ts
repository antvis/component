import type { DisplayObjectConfig, MixAttrs, RectProps, LabelProps } from '../../types';

export type CheckboxCfg = {
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
   * @title 是否禁用
   * @description 指定当前是否禁用
   */
  disabled?: boolean;
  /**
   * @title label chebox 间距
   * @description label 与 chebox 的方块的间距
   * @default 2
   */
  spacing?: number;
  /**
   * @title 初始是否选中
   * @description 指定组件的初始状态，是否选中
   * @default true
   */
  defaultChecked?: boolean;
  /**
   * @title 样式
   * @description 可设置组件的默认样式（default），选中样式（selected）以及禁用样式（disabled)
   */
  label?: LabelProps;
  /**
   * @title checkbox 的方块样式
   * @description checkbox 的方块样式
   */
  style?: MixAttrs<Partial<RectProps>>;
  /**
   * @title 变化时回调函数
   * @description 变化时回调函数
   */
  onChange?: (checked: boolean) => void;
};

export type CheckboxOptions = DisplayObjectConfig<CheckboxCfg>;
