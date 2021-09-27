export type {
  BaseStyleProps as ShapeAttrs,
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
  PathCommand,
} from '@antv/g';
export type { MixAttrs, StyleState } from './styles';

export type GUIOption<C> = {
  type: string;
  style: C;
};

export type Point = [number, number];
