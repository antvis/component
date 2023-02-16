import { LineStyleProps } from '@antv/g';
import type { ComponentOptions, PrefixStyleProps } from '../../core';
import type { Merge, Point, PrefixObject, ShapeAttrs } from '../../types';
import type { TagStyleProps } from '../tag';

export type CrosshairBaseStyleProps = Merge<
  Partial<PrefixStyleProps<TagStyleProps, 'tag'>>,
  {
    style: ShapeAttrs &
      PrefixObject<LineStyleProps, 'line'> & {
        type?: 'line' | 'circle' | 'polygon';
        tagPosition?: 'start' | 'end';
      };
  }
>;

export type LineCrosshairStyleProps = Merge<
  CrosshairBaseStyleProps,
  {
    style: {
      type?: 'line';
      startPos: Point;
      endPos: Point;
    };
  }
>;

export type CircleCrosshairStyleProps = Merge<
  CrosshairBaseStyleProps,
  {
    style: {
      type?: 'circle';
      center: Point;
      defaultRadius?: number;
    };
  }
>;

export type PolygonCrosshairStyleProps = Merge<
  CrosshairBaseStyleProps,
  {
    style: {
      type?: 'polygon';
      center: Point;
      defaultRadius?: number;
      // 边数
      sides: number;
      startAngle?: number;
    };
  }
>;

export type CrosshairBaseOptions = ComponentOptions<CrosshairBaseStyleProps>;
export type LineCrosshairOptions = ComponentOptions<LineCrosshairStyleProps>;
export type CircleCrosshairOptions = ComponentOptions<CircleCrosshairStyleProps>;
export type PolygonCrosshairOptions = ComponentOptions<PolygonCrosshairStyleProps>;
