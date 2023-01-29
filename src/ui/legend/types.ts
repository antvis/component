import type { GroupStyleProps, LineStyleProps, PathStyleProps, RectStyleProps, TextStyleProps } from '@antv/g';
import type { DisplayObjectConfig, ExtendDisplayObject, PrefixedStyle } from '../../types';
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

type HandleLabelStyle = PrefixedStyle<HandleStyleProps, 'handle'>;
type HandleCfg = {
  showHandle?: boolean;
};

export type LabelStyle = PrefixedStyle<TextStyleProps, 'label'> & PrefixedStyle<LineStyleProps, 'labelTick'>;
export type LabelCfg<T = any> = {
  showLabel?: boolean;
  labelDirection?: 'positive' | 'negative';
  /** spacing between label and legend item */
  labelSpacing?: number;
  labelAlign?: 'value' | 'range';
  labelShowTick?: boolean;
  labelFormatter?: (val: T, index: number, arr: T[]) => string;
  labelFilter?: (val: T, index: number, arr: T[]) => boolean;
};

export type IndicatorStyle = PrefixedStyle<PathStyleProps & TextStyleProps, 'indicator'>;
export type IndicatorCfg<T = any> = {
  showIndicator?: boolean;
  indicatorFormatter: (val: T) => ExtendDisplayObject;
  indicatorPadding: SeriesAttr;
  onIndicate: (val: T) => void;
};

export type LegendBaseStyle = GroupStyleProps &
  PrefixedStyle<TitleStyleProps, 'title'> &
  PrefixedStyle<RectStyleProps, 'background'>;
export type LegendBaseCfg = {
  padding?: SeriesAttr;
  orient?: 'horizontal' | 'vertical';
  type?: 'category' | 'continuous';
  showTitle?: boolean;
};

export type LegendBaseStyleProps = LegendBaseStyle & LegendBaseCfg;
export type LegendBaseOptions = DisplayObjectConfig<LegendBaseStyleProps>;

export type ContinuousStyle = LegendBaseStyle & HandleLabelStyle & IndicatorStyle & LabelStyle;
export type RibbonCfg = Omit<RibbonStyleProps, 'orient' | 'range' | 'partition' | 'size' | 'len'>;

export type ContinuousCfg = LegendBaseCfg &
  RibbonCfg &
  HandleCfg &
  LabelCfg &
  IndicatorCfg & {
    data: ContinuousDatum[];
    defaultValue?: [number, number];
    slidable?: boolean;
    step?: number;
    width: number;
    height: number;
  };

export type ContinuousStyleProps = ContinuousStyle & ContinuousCfg;
export type ContinuousOptions = DisplayObjectConfig<ContinuousStyleProps>;

export type CategoryStyleProps = LegendBaseStyleProps & CategoryItemsStyleProps;
export type CategoryOptions = DisplayObjectConfig<CategoryStyleProps>;
