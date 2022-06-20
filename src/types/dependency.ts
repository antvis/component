import { BaseCustomElementStyleProps } from '@antv/g';

export type ShapeAttrs = Partial<BaseCustomElementStyleProps> & {
  cursor?: string;
};

export type {
  DisplayObject,
  DisplayObjectConfig,
  CircleStyleProps as CircleProps,
  EllipseStyleProps as EllipseProps,
  RectStyleProps as RectProps,
  ImageStyleProps as ImageProps,
  LineStyleProps as LineProps,
  PathStyleProps as PathProps,
  PolylineStyleProps as PolylineProps,
  TextStyleProps as TextProps,
  Group,
} from '@antv/g';
