import { LineStyleProps } from '@antv/g';
import type { TagStyleProps } from '../tag';
import type { DisplayObjectConfig, LineProps, Point, ShapeAttrs, PrefixedStyle } from '../../types';

export interface CrosshairBaseCfg
  extends ShapeAttrs,
    PrefixedStyle<LineStyleProps, 'line'>,
    Partial<PrefixedStyle<TagStyleProps, 'tag'>> {
  type?: 'line' | 'circle' | 'polygon';
  tagPosition?: 'start' | 'end';
}

export interface LineCrosshairCfg extends CrosshairBaseCfg {
  type?: 'line';
  startPos: Point;
  endPos: Point;
}

export interface CircleCrosshairCfg extends CrosshairBaseCfg {
  type?: 'circle';
  center: Point;
  // 初始化半径
  defaultRadius?: number;
}

export interface PolygonCrosshairCfg extends CrosshairBaseCfg {
  type?: 'polygon';
  center: Point;
  // 初始化半径
  defaultRadius?: number;
  // 边数
  sides: number;
  // 初始角度
  startAngle?: number;
}

export type CrosshairBaseOptions = DisplayObjectConfig<CrosshairBaseCfg>;
export type LineCrosshairOptions = DisplayObjectConfig<LineCrosshairCfg>;
export type CircleCrosshairOptions = DisplayObjectConfig<CircleCrosshairCfg>;
export type PolygonCrosshairOptions = DisplayObjectConfig<PolygonCrosshairCfg>;
