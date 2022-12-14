import { GroupStyleProps, RectStyleProps } from '@antv/g';
import type { DisplayObjectConfig, PrefixedStyle } from '../../types';
import type { Padding } from '../../util/padding';
import type { SparklineStyleProps } from '../sparkline/types';
import type { HandleStyleProps as HandleBaseStyleProps } from './handle';

export interface HandleStyleProps extends PrefixedStyle<HandleBaseStyleProps, 'handle'> {
  /**  是否显示Handle */
  showHandle?: boolean;
  /** 是否显示文本 */
  showLabel?: boolean;
  /** 文本格式化 */
  formatter?: (value: number) => string;
}

export interface SliderStyleProps
  extends GroupStyleProps,
    PrefixedStyle<Omit<SparklineStyleProps, 'width' | 'height'> & { padding?: Padding }, 'sparkline'>,
    PrefixedStyle<RectStyleProps, 'track'>,
    PrefixedStyle<RectStyleProps, 'selection'>,
    HandleStyleProps {
  orient?: 'vertical' | 'horizontal';
  trackLength?: number;
  trackSize?: number;
  slidable?: boolean;
  brushable?: boolean;
  scrollable?: boolean;
  values?: [number, number];
  padding?: Padding;
}

export type SliderOptions = DisplayObjectConfig<SliderStyleProps>;
