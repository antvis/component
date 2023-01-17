import type { GroupStyleProps, TextStyleProps } from '@antv/g';
import type { SeriesAttr } from '../../util';

export interface TitleStyle extends GroupStyleProps, TextStyleProps {}

export interface TitleCfg {
  /** bbox of target to add titled */
  spacing?: SeriesAttr;
  inset?: SeriesAttr;
  position?:
    | 't'
    | 'top'
    | 'b'
    | 'bottom'
    | 'l'
    | 'left'
    | 'r'
    | 'right'
    | 'lt'
    | 'left-top'
    | 'lb'
    | 'left-bottom'
    | 'rt'
    | 'right-top'
    | 'rb'
    | 'right-bottom'
    | 'inner'
    | 'i';
}

export type TitleStyleProps = TitleStyle & TitleCfg;
