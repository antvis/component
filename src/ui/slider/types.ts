import { GroupStyleProps, RectStyleProps } from '@antv/g';
import type { ComponentOptions, PrefixStyleProps } from '../../core';
import type { Merge, MergeMultiple, PrefixObject } from '../../types';
import type { SeriesAttr } from '../../util/series';
import type { SparklineStyleProps } from '../sparkline/types';
import type { HandleStyleProps as HandleBaseStyleProps } from './handle';

export type HandleStyleProps = Merge<
  PrefixStyleProps<HandleBaseStyleProps, 'handle'>,
  {
    /**  是否显示Handle */
    showHandle?: boolean;
    /** 是否显示文本 */
    showLabel?: boolean;
    /** 文本格式化 */
    formatter?: (value: number) => string;
  }
>;

export type SliderStyleProps = MergeMultiple<
  [
    HandleStyleProps,
    PrefixStyleProps<Omit<SparklineStyleProps, 'width' | 'height'> & { padding?: SeriesAttr }, 'sparkline'>,
    {
      style: GroupStyleProps &
        PrefixObject<RectStyleProps, 'track'> &
        PrefixObject<RectStyleProps, 'selection'> & {
          orientation?: 'vertical' | 'horizontal';
          trackLength?: number;
          trackSize?: number;
          slidable?: boolean;
          brushable?: boolean;
          scrollable?: boolean;
          padding?: SeriesAttr;
          values?: [number, number];
        };
    }
  ]
>;

export type SliderOptions = ComponentOptions<SliderStyleProps>;
