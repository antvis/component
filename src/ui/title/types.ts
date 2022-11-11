import type { GroupStyleProps, TextStyleProps } from '@antv/g';
import type { Padding } from '../../util';

export interface TitleStyle extends GroupStyleProps, TextStyleProps {}

export interface TitleCfg {
  /** bbox of target to add titled */
  spacing?: Padding;
  inset?: Padding;
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
