import { LineStyleProps } from '@antv/g';
import type { TagStyleProps } from '../tag';
import type { DisplayObjectConfig, LineProps, Point, ShapeAttrs, PrefixedStyle } from '../../types';

export interface CrosshairBaseStyleProps
  extends ShapeAttrs,
    PrefixedStyle<LineStyleProps, 'line'>,
    Partial<PrefixedStyle<TagStyleProps, 'tag'>> {
  type?: 'line' | 'circle' | 'polygon';
  tagPosition?: 'start' | 'end';
}

export interface LineCrosshairStyleProps extends CrosshairBaseStyleProps {
  type?: 'line';
  startPos: Point;
  endPos: Point;
}

export interface CircleCrosshairStyleProps extends CrosshairBaseStyleProps {
  type?: 'circle';
  center: Point;
  // 初始化半径
  defaultRadius?: number;
}

export interface PolygonCrosshairStyleProps extends CrosshairBaseStyleProps {
  type?: 'polygon';
  center: Point;
  // 初始化半径
  defaultRadius?: number;
  // 边数
  sides: number;
  // 初始角度
  startAngle?: number;
}

export type CrosshairBaseOptions = DisplayObjectConfig<CrosshairBaseStyleProps>;
export type LineCrosshairOptions = DisplayObjectConfig<LineCrosshairStyleProps>;
export type CircleCrosshairOptions = DisplayObjectConfig<CircleCrosshairStyleProps>;
export type PolygonCrosshairOptions = DisplayObjectConfig<PolygonCrosshairStyleProps>;
