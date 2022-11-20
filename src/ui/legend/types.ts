import type { GroupStyleProps, PathStyleProps, RectStyleProps, TextStyleProps } from '@antv/g';
import type { DisplayObjectConfig, ExtendDisplayObject, PrefixedStyle } from '../../types';
import type { Padding } from '../../util';
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
type HandleCfg<T = any> = {
  showHandle?: boolean;
};

export type LabelStyle = PrefixedStyle<TextStyleProps, 'label'>;
export type LabelCfg<T = any> = {
  showLabel?: boolean;
  labelDirection?: 'ends' | 'positive' | 'negative';
  /** spacing between label and legend item */
  labelSpacing?: number;
  labelAlign?: 'value' | 'range';
  labelFormatter?: (val: T, index: number, arr: T[]) => string;
  labelFilter?: (val: T, index: number, arr: T[]) => boolean;
};

export type IndicatorStyle = PrefixedStyle<PathStyleProps & TextStyleProps, 'indicator'>;
export type IndicatorCfg<T = any> = {
  showIndicator?: boolean;
  indicatorFormatter: (val: T) => ExtendDisplayObject;
  indicatorPadding: Padding;
  onIndicate: (val: T) => void;
};

export type LegendBaseStyle = GroupStyleProps &
  PrefixedStyle<TitleStyleProps, 'title'> &
  PrefixedStyle<RectStyleProps, 'background'>;
export type LegendBaseCfg = {
  padding?: Padding;
  orient?: 'horizontal' | 'vertical';
  type?: 'category' | 'continuous';
  showTitle?: boolean;
};

export type LegendBaseStyleProps = LegendBaseStyle & LegendBaseCfg;
export type LegendBaseOptions = DisplayObjectConfig<LegendBaseStyleProps>;

export type ContinuousStyle = LegendBaseStyle & HandleLabelStyle & IndicatorStyle;
export type RibbonCfg = Omit<RibbonStyleProps, 'orient' | 'range' | 'blocks' | 'size' | 'len'> & {
  ribbonSize: number;
  ribbonLen: number;
};
export type ContinuousCfg = LegendBaseCfg &
  RibbonCfg &
  HandleCfg &
  LabelCfg &
  IndicatorCfg & {
    data: ContinuousDatum[];
    defaultValue?: [number, number];
    slidable?: boolean;
    step?: number;
  };

export type ContinuousStyleProps = ContinuousStyle & ContinuousCfg;
export type ContinuousOptions = DisplayObjectConfig<ContinuousStyleProps>;

export type CategoryStyleProps = LegendBaseStyle & CategoryItemsStyleProps;
export type CategoryOptions = DisplayObjectConfig<CategoryStyleProps>;
