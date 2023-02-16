import type { DisplayObjectConfig, GroupStyleProps, TextStyleProps } from '@antv/g';
import { ExtendDisplayObject } from 'src/types';
import type { ComponentStyleProps, ComponentOptions } from '../../core/types';
import type { SeriesAttr } from '../../util';

export type PositionAbbr = 't' | 'r' | 'l' | 'b' | 'lt' | 'tl' | 'rt' | 'tr' | 'lb' | 'bl' | 'rb' | 'br' | 'i';

export type TitleStyleProps = {
  style: GroupStyleProps &
    Omit<TextStyleProps, 'text'> & {
      text: ExtendDisplayObject;
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
    };
};

export type TitleOptions = ComponentOptions<TitleStyleProps>;
