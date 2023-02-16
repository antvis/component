import type { GroupStyleProps, LineStyleProps as GLineStyleProps, PathStyleProps, RectStyleProps } from '@antv/g';
import { Band, Linear } from '@antv/scale';
import type { ComponentOptions } from '../../core';
import type { CallbackableObject, CallbackParameter, MergeMultiple, PrefixObject } from '../../types';

export type Point = [number, number];
export type Line = Point[];
export type Data = number[][];
export type Scales = {
  type: 'line' | 'column';
  y: Linear;
  x: Linear | Band;
};

type LineStyleProps = {
  style: CallbackableObject<
    PrefixObject<Omit<GLineStyleProps, 'x1' | 'x2' | 'y1' | 'y2'>, 'line'>,
    CallbackParameter<Data>
  > &
    CallbackableObject<PrefixObject<Omit<PathStyleProps, 'path' | 'd'>, 'area'>, CallbackParameter<Data>> & {
      /**
       * @title 是否光滑
       * @description 折线是否光滑
       */
      smooth?: boolean;
    };
};

type ColumnStyleProps = {
  style: CallbackableObject<PrefixObject<RectStyleProps, 'column'>, CallbackParameter<Data>> & {
    /**
     * @title 是否分组
     */
    isGroup?: boolean;
    /**
     * @title 分组柱子的间距
     */
    spacing?: number;
  };
};

export type SparklineStyleProps = MergeMultiple<
  [
    LineStyleProps,
    ColumnStyleProps,
    {
      data?: number[] | number[][];
      style: GroupStyleProps & {
        type: 'line' | 'column';
        isStack?: boolean;
        range?: [number, number];
        color?: string | string[] | ((idx: number) => string);
      };
    }
  ]
>;

export type SparklineOptions = ComponentOptions<SparklineStyleProps>;
