import type {
  ShapeAttrs,
  CircleProps,
  EllipseProps,
  RectProps,
  ImageProps,
  LineProps,
  PathProps,
  PolylineProps,
  TextProps,
} from './index';
import { STATE_LIST } from '../constant';

type UnionShapeProps =
  | ShapeAttrs
  | CircleProps
  | EllipseProps
  | RectProps
  | ImageProps
  | LineProps
  | PathProps
  | PolylineProps
  | TextProps;

export type StyleState = typeof STATE_LIST[number];

export type MixAttrs<T extends UnionShapeProps | null> = {
  [state in StyleState]?: T;
};
