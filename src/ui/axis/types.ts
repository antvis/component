import type { TextStyleProps } from '@antv/g';
import type { MarkerStyleProps } from '../marker';
import type { DisplayObjectConfig, LineProps, ShapeAttrs, Vector2 } from '../../types';
import type { OverlapCallback } from './overlap';

export type LabelType = 'text' | 'number' | 'time';
export type Position = 'start' | 'center' | 'end';
export type AxisType = 'linear' | 'arc' | 'helix';
export type OverlapType = 'autoRotate' | 'autoEllipsis' | 'autoHide';
export type AxisOrient = 'left' | 'right' | 'top' | 'bottom' | 'outside' | 'inside';
// `tip` is the origin text of label.
export type AxisTextStyleProps = TextStyleProps & { id?: string; tip?: string; rotation?: number };

export type TickDatum = {
  value: number; // range: [0, 1]
  text?: string;
  id?: string;
};

export type AxisTitleCfg = {
  content?: string;
  /**
   * The anchor position for placing the axis title.
   * If axis is in left or right orientation, `titleAnchor="start"` means placing axis title in the top edge of axis.
   * If axis is in top or bottom orientation, `titleAnchor="start"` means placing axis title in the left edge of axis.
   */
  titleAnchor?: Position;
  /**
   * The padding in pixels between the axis labels and axis title.
   */
  titlePadding?: number;
  /**
   * Rotation angle of axis title.
   */
  rotate?: number;
  /**
   * Custom X position of the axis title relative to the axis line, overriding the standard layout.
   */
  positionX?: number;
  /**
   * Custom Y position of the axis title relative to the axis line, overriding the standard layout.
   */
  positionY?: number;
  /**
   * The maximum allowed length in pixels of axis title.
   */
  maxLength?: number;
  style?: Omit<TextStyleProps, 'text'>;
  // animate?: boolean;
};

export type AxisLineCfg = {
  style?: ShapeAttrs;
  arrow?: {
    start?: Partial<MarkerStyleProps> | null;
    end?: Partial<MarkerStyleProps> | null;
  };
  // animate?: boolean;
};

export type AxisTickLineCfg = {
  // 刻度线长度
  len?: number;
  style?: Partial<LineProps>;
};

export type AxisSubTickLineCfg = {
  // 刻度线长度
  len?: number;
  // 两个刻度之间的子刻度数
  count?: number;
  style?: Partial<LineProps>;
};

export type AxisLabelCfg = {
  type?: LabelType;
  style?: Partial<TextStyleProps> | ((tick: TickDatum, index: number, ticks: TickDatum[]) => Partial<TextStyleProps>);
  formatter?: (tick: TickDatum, index?: number) => string;
  // label是否与Tick对齐
  alignTick?: boolean;
  // 标签文本与轴线的对齐方式，normal-水平，tangential-切向 radial-径向
  align?: 'normal' | 'tangential' | 'radial';
  /**
   * @description determine additional offset (pixel) to the position of `tickLine`
   * @description 4
   */
  tickPadding?: number;
  /**
   * The offset in pixels of the labels along the axis line.
   */
  offset?: number;
  // 处理label重叠的优先级
  overlapOrder?: OverlapType[];
  // 标签外边距，在进行自动避免重叠时的额外间隔
  margin?: number[];

  // 自动旋转范围
  // 自动旋转时，将会尝试从 min 旋转到 max
  // rotateRange?: [number, number];
  // 旋转更新步长
  // rotateStep?: number;
  /**
   * @title Auto Rotate
   * @description The strategy to use for resolving overlap of axis labels by rotating labels. Auto Rotate will adjust label align.
   */
  autoRotate?: boolean | string | { type: string; cfg?: any } | OverlapCallback;
  /**
   * @description Optional angels to rotate when the autoRotate strategy is applied.
   */
  optionalAngles?: number[];
  /**
   * Rotation degree of axis label. If specified, `autoRotate` will be ignore.
   */
  rotate?: number;
  /**
   * @title Auto Hide
   * @description The strategy to use for resolving overlap of axis labels by hiding overlapped labels.
   *
   * If set to true or { type: "parity" }, a strategy of removing every other label is used (this works well for standard linear axes).
   * If set to "greedy", a linear scan of the labels is performed, removing any label that overlaps with the last visible label
   */
  autoHide?: boolean | string | { type: string; cfg?: any } | OverlapCallback;
  // 隐藏 label 时，同时隐藏掉其对应的 tickLine
  /**
   * @title Auto Hide TickLine
   * @description whether to hide tickLine when axis label is hidden by the strategy of `autoHide`
   */
  autoHideTickLine?: boolean;
  /**
   * @title Auto Ellipsis
   * @description The strategy to use for limit the length of axis tick labels (in pixel).
   */
  autoEllipsis?: boolean | string | { type: string; cfg?: any } | OverlapCallback;
  /**
   * @description The minimum text length in pixels of axis tick labels. If string, the length of given string will be calculated.
   */
  minLength?: string | number;
  /**
   * @description The maximum text length in pixels of axis tick labels. If string, the length of given string will be calculated.
   */
  maxLength?: string | number;

  // 最小显示 label 数量 [todo] 是否需要保留
  minLabel?: number;
  // 缩略步长，字符串长度或数值长度
  ellipsisStep?: string | number;

  /**
   * @title Show the first tick label.
   * @description Whether to show the label of the first tick. It is auto determined by default, it means if labels are overlapped, the first label maybe hidden.
   */
  showFirst?: boolean;
  /**
   * @title Show the last tick label.
   * @description Whether to show the label of the last tick. It is auto determined by default, it means if labels are overlapped, the last label maybe hidden.
   */
  showLast?: boolean;
};

type AxisGridCfg = {
  items: Array<{ points: Vector2[]; id?: string }>;
  type?: 'line' | 'circle';
  // If type is 'circle', should specify the center.
  center?: Vector2;
  // If type is 'circle', determine whether to close path.
  closed?: boolean;
  // Style of grid line path.
  lineStyle?: { stroke?: string; lineWidth?: number; strokeOpacity?: number; lineDash?: string | (string | number)[] };
  /** FillColors between lines. */
  alternateColor?: string | string[] | null;
};

export type AxisBaseStyleProps = {
  type?: AxisType;
  title?: AxisTitleCfg;
  axisLine?: AxisLineCfg | null;
  ticks?: TickDatum[];
  ticksThreshold?: false | number;
  tickLine?: AxisTickLineCfg | null;
  label?: AxisLabelCfg | null;
  subTickLine?: AxisSubTickLineCfg;
  verticalFactor?: -1 | 1;
  // 末尾追加tick，一般适用于 label alignTick 为 false 的情况
  appendTick?: boolean;
  grid?: AxisGridCfg | null;
};

export type AxisBaseOptions = DisplayObjectConfig<AxisBaseStyleProps>;

export type LinearAxisStyleProps = AxisBaseStyleProps & {
  startPos?: Vector2;
  endPos?: Vector2;
};

export type ArcAxisStyleProps = AxisBaseStyleProps & {
  startAngle?: number;
  endAngle?: number;
  radius: number;
  center: Vector2;
};

export type HelixStyleProps = AxisBaseStyleProps & {
  a?: number;
  b?: number;
  startAngle?: number;
  endAngle?: number;
  precision?: number;
};
export type HelixOptions = DisplayObjectConfig<HelixStyleProps>;
