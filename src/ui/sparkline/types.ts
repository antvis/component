import { Linear, Band } from '@antv/scale';
import type { ShapeAttrs, DisplayObjectConfig } from '../../types';

export type Point = [number, number];
export type Line = Point[];
export type Data = number[][];
export type Scales = {
  type: 'line' | 'column';
  y: Linear;
  x: Linear | Band;
};

export type SparklineCfg = ShapeAttrs & {
  data?: number[] | number[][];
  width?: number;
  height?: number;
  isStack?: boolean;
  color?: string | string[] | ((idx: number) => string);

  type?: 'line' | 'column';
  // line
  smooth?: boolean;
  lineStyle?: ShapeAttrs | ((idx: number) => ShapeAttrs);
  areaStyle?: ShapeAttrs | ((idx: number) => ShapeAttrs);
  // column
  isGroup?: boolean;
  columnStyle?: ShapeAttrs | ((idx: number) => ShapeAttrs);
  barPadding?: number;
};

export type SparklineOptions = DisplayObjectConfig<SparklineCfg>;
