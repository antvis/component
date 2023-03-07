import { Band, Linear } from '@antv/scale';
import type { ComponentOptions } from '../../core';
import type { GroupStyleProps, LineStyleProps as GLineStyleProps, PathStyleProps, RectStyleProps } from '../../shapes';
import type { CallbackableObject, CallbackParameter, PrefixObject } from '../../types';

export type Point = [number, number];
export type Line = Point[];
export type Data = number[][];
export type Scales = {
  type: 'line' | 'column';
  y: Linear;
  x: Linear | Band;
};

type LineStyleProps = CallbackableObject<
  PrefixObject<Omit<GLineStyleProps, 'x1' | 'x2' | 'y1' | 'y2'>, 'line'>,
  CallbackParameter<Data>
> &
  CallbackableObject<PrefixObject<Omit<PathStyleProps, 'path' | 'd'>, 'area'>, CallbackParameter<Data>> & {
    /** 是否光滑 */
    smooth?: boolean;
  };

type ColumnStyleProps = CallbackableObject<PrefixObject<RectStyleProps, 'column'>, CallbackParameter<Data>> & {
  /** 是否分组 */
  isGroup?: boolean;
  /** 分组柱子的间距 */
  spacing?: number;
};

export type SparklineStyleProps = GroupStyleProps &
  LineStyleProps &
  ColumnStyleProps & {
    color?: string | string[] | ((idx: number) => string);
    data?: number[] | number[][];
    isStack?: boolean;
    range?: [number, number];
    type: 'line' | 'column';
  };

export type SparklineOptions = ComponentOptions<SparklineStyleProps>;
