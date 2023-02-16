import type { GroupStyleProps, LineStyleProps, PathStyleProps, RectStyleProps, TextStyleProps } from '@antv/g';
import type { ComponentOptions, PrefixStyleProps } from '../../core';
import type { ExtendDisplayObject, Merge, MergeMultiple, PrefixObject } from '../../types';
import type { SeriesAttr } from '../../util';
import type { TitleStyleProps } from '../title';
import type { CategoryItemsStyleProps } from './category/items';
import type { HandleStyleProps } from './continuous/handle';
import type { RibbonStyleProps } from './continuous/ribbon';

export type Interpolate<T = string> = (val: number) => T;

export interface ContinuousBaseDatum {
  id?: string;
  [keys: string]: any;
}
export interface ContinuousDatum extends ContinuousBaseDatum {
  value: number;
}

export type LabelStyleProps<T = any> = {
  showLabel?: boolean;
  showTick?: boolean;
  formatter?: (val: T, index: number, arr: T[]) => string;
  filter?: (val: T, index: number, arr: T[]) => boolean;
  style: TextStyleProps &
    PrefixObject<LineStyleProps, 'tick'> & {
      direction?: 'positive' | 'negative';
      /** spacing between label and legend item */
      spacing?: number;
      align?: 'value' | 'range';
    };
};

export type IndicatorStyleProps<T = any> = {
  showIndicator?: boolean;
  formatter: (val: T) => ExtendDisplayObject;
  style: PathStyleProps &
    TextStyleProps & {
      padding: SeriesAttr;
    };
  events: {
    onIndicate: (val: T) => void;
  };
};

export type LegendBaseStyleProps = Merge<
  PrefixStyleProps<TitleStyleProps, 'title'>,
  {
    showTitle?: boolean;
    style: GroupStyleProps &
      PrefixObject<RectStyleProps, 'background'> & {
        padding?: SeriesAttr;
        orientation?: 'horizontal' | 'vertical';
        type?: 'category' | 'continuous';
      };
  }
>;

export type LegendBaseOptions = ComponentOptions<LegendBaseStyleProps>;

export type ContinuousStyleProps = MergeMultiple<
  [
    LegendBaseStyleProps,
    PrefixStyleProps<HandleStyleProps, 'handle'>,
    PrefixStyleProps<IndicatorStyleProps, 'indicator'>,
    PrefixStyleProps<LabelStyleProps, 'label'>,
    {
      showHandle?: boolean;
      data: ContinuousDatum[];
      style: Omit<RibbonStyleProps['style'], 'orientation' | 'range' | 'partition' | 'size' | 'len'> &
        Omit<RibbonStyleProps, 'style'> & {
          defaultValue?: [number, number];
          slidable?: boolean;
          step?: number;
          width: number;
          height: number;
        };
    }
  ]
>;

export type ContinuousOptions = ComponentOptions<ContinuousStyleProps>;

export type CategoryStyleProps = Merge<LegendBaseStyleProps, CategoryItemsStyleProps>;
export type CategoryOptions = ComponentOptions<CategoryStyleProps>;
