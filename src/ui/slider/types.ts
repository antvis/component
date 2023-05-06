import type { ComponentOptions, PrefixStyleProps } from '../../core';
import { GroupStyleProps, RectStyleProps } from '../../shapes';
import type { PrefixObject } from '../../types';
import type { SeriesAttr } from '../../util/series';
import type { GenericAnimation } from '../../animation';
import type { SparklineStyleProps } from '../sparkline/types';
import type { HandleStyleProps as HandleBaseStyleProps } from './handle';

export type HandleStyleProps = PrefixStyleProps<HandleBaseStyleProps, 'handle'> & {
  /** 文本格式化 */
  formatter?: (value: number) => string;
};

export type SliderStyleProps = GroupStyleProps &
  PrefixObject<RectStyleProps, 'track'> &
  PrefixObject<RectStyleProps, 'selection'> &
  HandleStyleProps &
  Partial<PrefixStyleProps<Omit<SparklineStyleProps, 'width' | 'height'>, 'sparkline'>> & {
    animate?: GenericAnimation;
    brushable?: boolean;
    orientation?: 'vertical' | 'horizontal';
    padding?: SeriesAttr;
    scrollable?: boolean;
    showHandle?: boolean;
    showLabel?: boolean;
    autoFitLabel?: boolean;
    slidable?: boolean;
    trackLength?: number;
    trackSize?: number;
    values?: [number, number];
  };

export type SliderOptions = ComponentOptions<SliderStyleProps>;
