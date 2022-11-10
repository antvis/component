import type { DisplayObject, LineStyleProps, TextStyleProps } from '@antv/g';
import type { GridCfg } from '@/ui/grid/types';
import type {
  Callbackable,
  CallbackParameter,
  CallbackableObject,
  ExtendDisplayObject,
  PrefixedStyle,
  Point,
  Vector2,
} from '@/types';

export type AxisType = 'linear' | 'arc' | 'helix';

export type VerticalFactor = -1 | 1;

export interface AxisDatum {
  id?: string;
  value: number;
  label?: string;
  [keys: string]: any;
}

export type AxisDatumCP = CallbackParameter<AxisDatum>;

export type AxisPosition = 'left' | 'right' | 'top' | 'bottom' | 'center';

export type AxisLabelPosition = 'left' | 'right' | 'top' | 'bottom' | 'inner' | 'outter';

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

export type AxisTitleStyle = PrefixedStyle<TextStyleProps, 'title'>;
export type AxisTitleCfg = {
  title?: ExtendDisplayObject;
  /**
   * distance between axis body (line with ticks and labels)
   */
  titleSpacing?: number;
  /**
   * title align relative to the axis
   */
  titleAlign?: 'start' | 'middle' | 'end';
  /**
   * the position of title relative to axis
   * 'inner' can only be used in polar coordinates
   */
  titlePosition?: 'bottom' | 'top' | 'left' | 'right' | 'inner';
};
export type AxisLineStyle = PrefixedStyle<LineStyleProps, 'line'>;
export type AxisLineCfg = {
  showLine?: boolean;
  /**
   * truncate range in the axis line
   */
  truncRange?: [number, number];
  /**
   * the shape of truncate point or area
   * when using a callback form, the argument will additional returns the positon of two points
   * we will provide sevaral default shapes
   */
  truncShape?: Callbackable<
    ExtendDisplayObject | [ExtendDisplayObject, ExtendDisplayObject],
    CallbackParameter<AxisDatum, [Vector2, Vector2]>
  >;
  /**
   * extend lenth on the head and tail of axis line
   */
  lineExtension?: [number, number];
  /**
   * line arrow shape
   * When string is passed, use the build-in arrow shape
   */
  lineArrow?: ExtendDisplayObject;
  /** line arrow offset, -20 ~ 20 is safety */
  lineArrowOffset?: number;
  /** size of line arrow */
  lineArrowSize?: number;
};
export type AxisTickStyle = CallbackableObject<PrefixedStyle<LineStyleProps, 'tick'>, AxisDatumCP>;
export type AxisTickCfg = {
  showTick?: boolean;
  /**
   * the position of ticks
   * @description `negative` means ticks is opposite to the direction of cross axis
   * @description `positive` means ticks have same direction of cross axis
   */
  tickDirection?: Direction;
  tickLength?: Callbackable<number, AxisDatumCP>;
  tickFilter?: (...params: AxisDatumCP) => boolean;
  /**
   * tick formatter
   * the callback will additionally return the tick direction
   */
  tickFormatter?: Callbackable<ExtendDisplayObject, CallbackParameter<AxisDatum, [Vector2]>>;
  /**
   * @description `horizontal` means the labels are always horizontal
   * @description `parallel` means the labels are parallel to the axis line
   * @description `perpendicular` means the labels are perpendicular to the axis line
   */
};
export type AxisLabelStyle = CallbackableObject<PrefixedStyle<TextStyleProps, 'label'>, AxisDatumCP>;
export type AxisLabelCfg = {
  showLabel?: boolean;
  labelAlign?: 'horizontal' | 'parallel' | 'perpendicular';
  labelDirection?: Direction;
  /**
   * spacing between label and it's tick
   */
  labelSpacing?: Callbackable<number, AxisDatumCP>;
  labelFilter?: (...params: AxisDatumCP) => boolean;
  /**
   * formatter for labels, if string, return directly. you can even format it as a g shape
   */
  labelFormatter?: Callbackable<ExtendDisplayObject, AxisDatumCP>;
  /**
   * transform label by using ellipsis, hide and rotate to avoid overlap
   */
  labelTransforms?: LabelOverlapCfg[];
};
export type AxisGridStyle = PrefixedStyle<GridCfg, 'grid'>;
export type AxisGridCfg = {
  showGrid?: boolean;
  gridFilter?: (...params: AxisDatumCP) => boolean;
  gridDirection?: Direction;
  /**
   * the grid line length
   */
  gridLength?: number;
  gridType?: 'segment' | 'surround';
  gridConnect?: 'line' | 'arc';
  /**
   * by using grid controller, you can set the grid line in polar coordinates
   * each value is the rotate angle(degree), the grid points are obtained by rotating tick position around the center
   */
  gridControlAngles?: number[];
  /**
   * the area fill color between adjacent grid line
   * when string array is passed, it will be used interchangeably
   * when callback function is passed, it will provide the area index, previous and next grid datum
   */
  gridAreaFill?: string | string[] | Callbackable<string, AxisDatumCP>;
};
export type AxisBaseStyleProps = AxisTitleStyle &
  AxisTitleCfg &
  AxisLineStyle &
  AxisLineCfg &
  AxisTickStyle &
  AxisTickCfg &
  AxisLabelStyle &
  AxisLabelCfg &
  AxisGridStyle &
  AxisGridCfg & {
    /**
     * the animation effect when axis is rendered
     */
    animation?: string;
    /**
     * a datum corresponding to a tick and label
     */
    data: AxisDatum[];
    /**
     * the maximum number of data
     */
    dataThreshold?: number;
    /**
     * the width of axis occupied in the cross direction
     */
    crossSize?: number;
  };
export interface LinearAxisStyleProps extends AxisBaseStyleProps {
  type: 'linear';
  startPos: Vector2;
  endPos: Vector2;
}
export interface ArcAxisStyleProps extends AxisBaseStyleProps {
  type: 'arc';
  angleRange: [number, number];
  radius: number;
  center: Vector2;
}

export type AxisStyleProps = LinearAxisStyleProps | ArcAxisStyleProps;
