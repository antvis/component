import type { DisplayObjectConfig, GroupStyleProps, TextStyleProps } from '@antv/g';
import type { SeriesAttr } from '../../util';

export interface TitleStyle extends GroupStyleProps, TextStyleProps {}

export type PositionAbbr = 't' | 'r' | 'l' | 'b' | 'lt' | 'tl' | 'rt' | 'tr' | 'lb' | 'bl' | 'rb' | 'br' | 'i';

export interface TitleCfg {
  /** bbox of target to add titled */
  spacing?: SeriesAttr;
  inset?: SeriesAttr;
  position?:
    | PositionAbbr
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'left-top'
    | 'top-left'
    | 'left-bottom'
    | 'bottom-left'
    | 'right-top'
    | 'top-right'
    | 'right-bottom'
    | 'bottom-right'
    | 'inner';
}

export type TitleStyleProps = TitleStyle & TitleCfg;

export type TitleOptions = DisplayObjectConfig<TitleStyleProps>;
