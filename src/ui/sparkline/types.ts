import type { GroupStyleProps, LineStyleProps as GLineStyleProps, PathStyleProps, RectStyleProps } from '@antv/g';
import { Band, Linear } from '@antv/scale';
import type { CallbackableObject, CallbackParameter, DisplayObjectConfig, PrefixedStyle } from '../../types';

export type Point = [number, number];
export type Line = Point[];
export type Data = number[][];
export type Scales = {
  type: 'line' | 'column';
  y: Linear;
  x: Linear | Band;
};

interface LineStyleProps
  extends CallbackableObject<PrefixedStyle<GLineStyleProps, 'line'>, CallbackParameter<Data>>,
    CallbackableObject<PrefixedStyle<PathStyleProps, 'area'>, CallbackParameter<Data>> {
  /**
   * @title 是否光滑
   * @description 折线是否光滑
   */
  smooth?: boolean;
}

interface ColumnStyleProps
  extends CallbackableObject<PrefixedStyle<RectStyleProps, 'column'>, CallbackParameter<Data>> {
  /**
   * @title 是否分组
   */
  isGroup?: boolean;
  /**
   * @title 分组柱子的间距
   */
  spacing?: number;
}

export type SparklineStyleProps = GroupStyleProps & {
  type: 'line' | 'column';
  data?: number[] | number[][];
  isStack?: boolean;
  range?: [number, number];
  color?: string | string[] | ((idx: number) => string);
} & LineStyleProps &
  ColumnStyleProps;

export type SparklineOptions = DisplayObjectConfig<SparklineStyleProps>;
