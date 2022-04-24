import { BaseStyleProps } from '@antv/g';
import type { MarkerStyleProps } from '../marker';
import type { DisplayObjectConfig, LineProps, ShapeAttrs, TextProps } from '../../types';

export type LabelType = 'text' | 'number' | 'time';
export type Position = 'start' | 'center' | 'end';
export type AxisType = 'linear' | 'arc' | 'helix';
export type OverlapType = 'autoRotate' | 'autoEllipsis' | 'autoHide';

/**
 * @description tick 元数据类型: value, text?, state?, id?
 */
export type TickDatum = {
  value: number;
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
   * The offset in pixels of the axis title along the axis line.
   */
  offset?: number;
  /**
   * The padding in pixels between the axis labels and axis title.
   */
  titlePadding?: number;
  /**
   * Rotation angle of axis title.
   */
  rotation?: number;
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
  style?: Omit<TextProps, 'text'>;
};

export type AxisLineCfg = {
  style?: ShapeAttrs;
  arrow?: {
    start?: MarkerStyleProps | null;
    end?: MarkerStyleProps | null;
  };
};

export type AxisTickLineCfg = {
  // 刻度线长度
  len?: number;
  style?: Partial<LineProps>;
  // 末尾追加tick，一般用于label alignTick 为 false 的情况
  // appendTick?: boolean;
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
  style?: Partial<TextProps> | ((tick: TickDatum, index: number) => Partial<TextProps>);
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
   * @description The strategy to use for resolving overlap of axis labels by rotating labels.
   */
  autoRotate?: boolean;
  /**
   * @description Optional angels to rotate when the autoRotate strategy is applied.
   */
  optionalAngles?: number[];
  /**
   * Rotation degree of axis label. If specified, `autoRotate` will be ignore.
   */
  rotation?: number;
  /**
   * @title Auto Hide
   * @description The strategy to use for resolving overlap of axis labels by hiding overlapped labels.
   *
   * If set to true or { type: "parity" }, a strategy of removing every other label is used (this works well for standard linear axes).
   * If set to "greedy", a linear scan of the labels is performed, removing any label that overlaps with the last visible label
   *
   * todo Support custom AutoHide strategy
   */
  autoHide?: boolean | { type: 'parity' | 'greedy' };
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
  autoEllipsis?: boolean;
  /**
   * @description The maximum allowed length in pixels of axis tick labels. If string, the length of given string will be calculated.
   */
  maxLength?: string | number;
  /**
   * @description The minimum allowed length in pixels of axis tick labels. If string, the length of given string will be calculated.
   */
  minLength?: string | number;
  /**
   * @title 坐标轴垂直方向的最大限制长度
   * @description The maximum limit length in pixels perpendicular to the axis line. Apply to the case with `rotation`
   */
  verticalLimitLength?: number;

  // 最小显示 label 数量
  minLabel?: number;
  // 缩略步长，字符串长度或数值长度
  ellipsisStep?: string | number;
};

export type AxisBaseStyleProps = BaseStyleProps & {
  type?: AxisType;
  // 标题
  title?: AxisTitleCfg;
  // 轴线
  axisLine?: AxisLineCfg;
  // 刻度数据
  ticks?: TickDatum[];
  // [todo] 刻度数量阈值，超过则进行重新采样
  ticksThreshold?: false | number;
  // 刻度线
  tickLine?: AxisTickLineCfg;
  // 刻度文本
  label?: AxisLabelCfg;
  // 子刻度线
  subTickLine?: AxisSubTickLineCfg;
  // label 和 tick 在轴线向量的位置，-1: 向量右侧， 1: 向量左侧
  verticalFactor?: -1 | 1;
  /** 边界情况 */
  bounds?: { x1: number; y1: number; x2: number; y2: number };
};

export type AxisBaseOptions = DisplayObjectConfig<AxisBaseStyleProps>;

export type Point = [number, number];

export type LinearAxisStyleProps = AxisBaseStyleProps & {
  startPos?: Point;
  endPos?: Point;
};
export type LinearOptions = DisplayObjectConfig<LinearAxisStyleProps>;

export type ArcAxisStyleProps = AxisBaseStyleProps & {
  startAngle?: number;
  endAngle?: number;
  radius: number;
  center: Point;
};
export type ArcOptions = DisplayObjectConfig<ArcAxisStyleProps>;

export type HelixCfg = AxisBaseStyleProps & {
  a?: number;
  b?: number;
  startAngle?: number;
  endAngle?: number;
  precision?: number;
};
export type HelixOptions = DisplayObjectConfig<HelixCfg>;
