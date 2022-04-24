import { CustomElement, DisplayObject, Text, TextStyleProps } from '@antv/g';
import { ORIGIN } from '../constant';
import { Bounds } from '../utils/intersect';

export type AxisLabel = Text &
  CustomElement<
    TextStyleProps & {
      id: string;
      orient: 'top' | 'bottom' | 'left' | 'right';
      bounds: Bounds;
      [ORIGIN]: { value: string; text: string };
    }
  >;

export type AxisTitle = Text & DisplayObject<TextStyleProps & { [ORIGIN]?: { text?: string } }>;
