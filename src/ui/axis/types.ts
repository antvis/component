import { DisplayObject, GroupStyleProps, LineStyleProps, TextStyleProps } from '@antv/g';
import type { AnimationOption } from '../../animation/types';
import type { ComponentOptions, PrefixStyleProps } from '../../core/types';
import type { Callbackable, CallbackParameter, ExtendDisplayObject, Merge, MergeMultiple, Vector2 } from '../../types';
import type { GridStyleProps } from '../grid/types';
import type { TitleStyleProps } from '../title';

export type AxisType = 'linear' | 'arc' | 'helix';

export type VerticalFactor = -1 | 1;

export interface AxisDatum {
  id?: string;
  value: number;
  label?: string;
  [keys: string]: any;
}

export type AxisDatumCP = CallbackParameter<AxisDatum>;

export type Direction = 'positive' | 'negative';

export interface Overlap {
  margin?: number[];
}
export interface EllipsisOverlapCfg extends Overlap {
  type: 'ellipsis';
  suffix?: string;
  /** The minimum length that label can reach when ellipsis operation */
  minLength: string | number;
  maxLength?: string | number;
  step?: string | number;
}
export interface RotateOverlapCfg extends Overlap {
  type: 'rotate';
  optionalAngles: number[];
  /** reset angle to preset when auto rotate failed */
  recoverWhenFailed?: boolean;
}
export interface HideOverlapCfg extends Overlap {
  type: 'hide';
  keepHeader?: boolean;
  keepTail?: boolean;
}
export interface WrapOverlapCfg extends Overlap {
  type: 'wrap';
  // TODO
}
export interface CustomOverlapCfg extends Overlap {
  type: 'custom';
  /** adjust labels position by yourself  */
  callback?: (labels: DisplayObject[]) => void;
}
export type LabelOverlapCfg =
  | EllipsisOverlapCfg
  | RotateOverlapCfg
  | HideOverlapCfg
  | WrapOverlapCfg
  | CustomOverlapCfg;

export type AxisTitleStyleProps = Merge<
  Omit<TitleStyleProps, 'style'>,
  {
    showTitle?: boolean;
    style: Omit<TitleStyleProps['style'], 'position'> & {
      position: TitleStyleProps['style']['position'] | 'start' | 'end';
    };
  }
>;

export type AxisTruncateStyleProps = {
  showTrunc?: boolean;
  style?: {
    /** truncate range in the axis line */
    range?: [number, number];
    /**
     * the shape of truncate point or area
     * when using a callback form, the argument will additional returns the position of two points
     * we will provide several default shapes
     */
    shape?: Callbackable<
      ExtendDisplayObject | [ExtendDisplayObject, ExtendDisplayObject],
      CallbackParameter<AxisDatum, [Vector2, Vector2]>
    >;
  };
};

export type AxisLineStyleProps = {
  showLine: boolean;
  showArrow: boolean;
  style: Omit<LineStyleProps, 'x1' | 'x2' | 'y1' | 'y2'> & {
    /**
     * extend lenth on the head and tail of axis line
     */
    extension?: [number, number];
    /**
     * line arrow shape
     * When string is passed, use the build-in arrow shape
     */
    arrow?: ExtendDisplayObject;
    /** line arrow offset, -20 ~ 20 is safety */
    arrowOffset?: number;
    /** size of line arrow */
    arrowSize?: number;
  };
};

export type AxisTickStyleProps = {
  showTick: boolean;
  style: {
    [key in keyof LineStyleProps]?: Callbackable<LineStyleProps[key], AxisDatumCP>;
  } & {
    length?: Callbackable<number, AxisDatumCP>;
    /**
     * the position of ticks
     * @description `negative` means ticks is opposite to the direction of cross axis
     * @description `positive` means ticks have same direction of cross axis
     */
    direction?: Direction;
  };
  filter: (...params: AxisDatumCP) => boolean;
  /**
   * tick formatter
   * the callback will additionally return the tick direction
   */
  formatter: Callbackable<ExtendDisplayObject, CallbackParameter<AxisDatum, [Vector2]>>;
};

export type AxisLabelStyleProps = {
  showLabel: boolean;
  filter: (...params: AxisDatumCP) => boolean;
  /**
   * formatter for labels, if string, return directly. you can even format it as a g shape
   */
  formatter: Callbackable<ExtendDisplayObject, AxisDatumCP>;
  style: {
    [key in keyof TextStyleProps]?: Callbackable<TextStyleProps[key], AxisDatumCP>;
  } & {
    direction?: Direction;
    /**
     * @description `horizontal` means the labels are always horizontal
     * @description `parallel` means the labels are parallel to the axis line
     * @description `perpendicular` means the labels are perpendicular to the axis line
     */
    align?: 'horizontal' | 'parallel' | 'perpendicular';
    /**
     * spacing between label and it's tick
     */
    spacing?: Callbackable<number | `${number}%`, AxisDatumCP>;
  };
  /**
   * transform label by using ellipsis, hide and rotate to avoid overlap
   */
  transform: LabelOverlapCfg[];
};

export type AxisGridStyleProps = Merge<
  GridStyleProps,
  {
    showGrid: boolean;
    style: {
      direction?: Direction;
      /** the grid line length */
      length?: number;
      type?: 'segment' | 'surround';
      connect?: 'line' | 'arc';
      /**
       * by using grid controller, you can set the grid line in polar coordinates
       * each value is the rotate angle(degree), the grid points are obtained by rotating tick position around the center
       */
      controlAngles?: number[];
      /**
       * the area fill color between adjacent grid line
       * when string array is passed, it will be used interchangeably
       * when callback function is passed, it will provide the area index, previous and next grid datum
       */
      areaFill?: string | string[] | Callbackable<string, AxisDatumCP>;
    };
    filter: (...params: AxisDatumCP) => boolean;
  }
>;

export type AxisBaseStyleProps = MergeMultiple<
  [
    PrefixStyleProps<AxisTitleStyleProps, 'title'>,
    PrefixStyleProps<AxisLineStyleProps, 'line'>,
    PrefixStyleProps<AxisTickStyleProps, 'tick'>,
    PrefixStyleProps<AxisLabelStyleProps, 'label'>,
    PrefixStyleProps<Omit<AxisGridStyleProps, 'animate'>, 'grid'>,
    PrefixStyleProps<AxisTruncateStyleProps, 'trunc'>,
    {
      animate: AnimationOption;
      data: AxisDatum[];
      style: GroupStyleProps & {
        /** the maximum number of data */
        dataThreshold?: number;
        /** the width of axis occupied in the cross direction */
        crossSize?: number;
      };
    }
  ]
>;

export type LinearAxisStyleProps = Merge<
  AxisBaseStyleProps,
  { style: { type: 'linear'; startPos: Vector2; endPos: Vector2 } }
>;

export type ArcAxisStyleProps = Merge<
  AxisBaseStyleProps,
  {
    style: {
      type: 'arc';
      startAngle: number;
      endAngle: number;
      radius: number;
      center: Vector2;
    };
  }
>;

export type AxisStyleProps = LinearAxisStyleProps | ArcAxisStyleProps;

export type LinearAxisOptions = ComponentOptions<LinearAxisStyleProps>;
export type ArcAxisOptions = ComponentOptions<ArcAxisStyleProps>;
export type AxisOptions = LinearAxisOptions | ArcAxisOptions;
