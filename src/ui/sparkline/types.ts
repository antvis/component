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

  /**
   * @title 类型。line 或 column
   */
  type?: 'line' | 'column';

  // line
  /**
   * @title 是否光滑
   * @description 折线是否光滑
   */
  smooth?: boolean;
  /**
   * @title 折线样式
   */
  lineStyle?: ShapeAttrs | ((idx: number) => ShapeAttrs);
  /**
   * @title 面积图样式
   */
  areaStyle?: ShapeAttrs | ((idx: number) => ShapeAttrs);
  /**
   * @title 数据的最小值
   */
  minValue?: number;
  /**
   * @title 数据的最大值
   */
  maxValue?: number;
  /**
   * @title 是否 nice。如果开启的话，会对数据进行扩展
   * @description Extends the domain so that it starts and ends on nice round values if it is true.
   * @default true
   */
  nice?: boolean;

  // column
  /**
   * @title 是否分组
   */
  isGroup?: boolean;
  /**
   * @title 柱子样式
   */
  columnStyle?: ShapeAttrs | ((idx: number) => ShapeAttrs);
  /**
   * @title 分组柱子的间距
   */
  barPadding?: number;
};

export type SparklineOptions = DisplayObjectConfig<SparklineCfg>;
