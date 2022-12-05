import { GroupStyleProps, RectStyleProps } from '@antv/g';
import type { DisplayObjectConfig, PrefixedStyle } from '../../types';
import type { Selection } from '../../util';
import type { Padding } from '../../util/padding';
import type { SparklineStyleProps } from '../sparkline/types';
import type { HandleStyleProps as HandleBaseStyleProps } from './handle';

export interface HandleStyleProps extends PrefixedStyle<HandleBaseStyleProps, 'handle'> {
  /**  是否显示Handle */
  showHandle?: boolean;
  /** 文本格式化 */
  formatter?: (value: number) => string;
}

export interface SliderStyleProps
  extends GroupStyleProps,
    PrefixedStyle<Omit<SparklineStyleProps, 'width' | 'height'> & { padding?: Padding }, 'sparkline'>,
    PrefixedStyle<RectStyleProps, 'background'>,
    PrefixedStyle<RectStyleProps, 'Selection'>,
    HandleStyleProps {
  orient?: 'vertical' | 'horizontal';
  length?: number;
  size?: number;
  values?: [number, number];
  padding?: Padding;
  onBackgroundMouseenter?: (el: Selection) => void;
  onBackgroundMouseleave?: (el: Selection) => void;
  onSelectionMouseenter?: (el: Selection) => void;
  onSelectionMouseleave?: (el: Selection) => void;
  onValueChange?: (value: [number, number], oldValue: [number, number]) => void;
}

export type SliderOptions = DisplayObjectConfig<SliderStyleProps>;
