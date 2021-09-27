import type { TagCfg } from '../tag';
import type { DisplayObjectConfig, LineProps, Point, ShapeAttrs } from '../../types';

export interface CrosshairBaseCfg extends ShapeAttrs {
  type?: 'line' | 'circle' | 'polygon';
  lineStyle?: Partial<LineProps>;
  text?: TagCfg & {
    position?: 'start' | 'end';
  };
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
