import type { ComponentOptions } from '../../core';
import type { BaseCustomElementStyleProps } from '../../shapes';

export interface FocusStyleProps extends BaseCustomElementStyleProps {
  /**
   * @title 图标大小
   * @description focus图标的大小
   */
  size?: number;
  /**
   * @title 填充颜色
   * @description 图标的填充颜色
   */
  fill?: string;
  /**
   * @title 描边颜色
   * @description 图标的描边颜色
   */
  stroke?: string;
  /**
   * @title 线宽
   * @description 图标的描边线宽
   */
  lineWidth?: number;
  /**
   * @title 透明度
   */
  opacity?: number;
}

export type FocusOptions = ComponentOptions<FocusStyleProps>;
