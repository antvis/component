import type { MarkerCfg } from '../marker';
import type { MixAttrs, DisplayObjectConfig, LineProps, ShapeAttrs, StyleState as State, TextProps } from '../../types';

export type LabelType = 'text' | 'number' | 'time';
export type Position = 'start' | 'center' | 'end';
export type AxisType = 'linear' | 'arc' | 'helix';
export type OverlapType = 'autoRotate' | 'autoEllipsis' | 'autoHide';

export type TickDatum = {
  value: number;
  text?: string;
  state?: State;
  id?: string;
};

export type AxisTitleCfg = {
  content?: string;
  style?: ShapeAttrs;
  // 标题位置
  position?: Position;
  // 标题偏移量，分别为平行与轴线方向和垂直于轴线方向的偏移量
  offset?: [number, number];
  // 旋转角度，值为0时，标题平行于轴线方向
  rotate?: number;
};

export type AxisLineCfg = {
  style?: ShapeAttrs;
  arrow?: {
    start?: false | MarkerCfg;
    end?: false | MarkerCfg;
  };
};

export type AxisTickLineCfg = {
  // 刻度线长度
  len?: number;
  style?: MixAttrs<Partial<LineProps>>;
  // 刻度线在其方向上的偏移量
  offset?: number;
  // 末尾追加tick，一般用于label alignTick 为 false 的情况
  appendTick?: boolean;
};

export type AxisSubTickLineCfg = {
  // 刻度线长度
  len?: number;
  // 两个刻度之间的子刻度数
  count?: number;
  style?: MixAttrs<Partial<LineProps>>;
  // 偏移量
  offset?: number;
};

export type AxisLabelCfg = {
  type?: LabelType;
  style?: MixAttrs<Partial<TextProps>>;
  // label是否与Tick对齐
  alignTick?: boolean;
  // 标签文本与轴线的对齐方式，normal-水平，tangential-切向 radial-径向
  align?: 'normal' | 'tangential' | 'radial';
  formatter?: (tick: TickDatum, index: number) => string;
  offset?: [number, number];
  // 处理label重叠的优先级
  overlapOrder?: OverlapType[];
  // 标签外边距，在进行自动避免重叠时的额外间隔
  margin?: [number, number, number, number];
  // 自动旋转
  autoRotate?: boolean;
  // 自动旋转范围
  // 自动旋转时，将会尝试从 min 旋转到 max
  // rotateRange?: [number, number];
  // 旋转更新步长
  // rotateStep?: number;
  // 自动选择的可选角度
  optionalAngles?: number[];
  // 手动指定旋转角度
  rotate?: number;
  // 自动隐藏
  autoHide?: boolean;
  // 隐藏 label 时，同时隐藏掉其对应的 tickLine
  autoHideTickLine?: boolean;
  // 最小显示 label 数量
  minLabel?: number;
  // 自动缩略
  autoEllipsis?: boolean;
  // 缩略步长，字符串长度或数值长度
  ellipsisStep?: string | number;
  // 最小缩略长度
  minLength?: string | number;
  // 单个 label 的最大长度，如果是字符串，则计算其长度
  maxLength?: string | number;
};

export type AxisBaseCfg = {
  type?: AxisType;
  // 标题
  title?: false | AxisTitleCfg;
  // 轴线
  axisLine?: false | AxisLineCfg;
  // 刻度数据
  ticks?: TickDatum[];
  // 刻度数量阈值，超过则进行重新采样
  ticksThreshold?: false | number;
  // 刻度线
  tickLine?: false | AxisTickLineCfg;
  // 刻度文本
  label?: false | AxisLabelCfg;
  // 子刻度线
  subTickLine?: false | AxisSubTickLineCfg;
  // label 和 tick 在轴线向量的位置，-1: 向量右侧， 1: 向量左侧
  verticalFactor?: -1 | 1;
};

export type AxisBaseOptions = DisplayObjectConfig<AxisBaseCfg>;

export type Point = [number, number];

export type LinearCfg = AxisBaseCfg & {
  startPos: Point;
  endPos: Point;
};
export type LinearOptions = DisplayObjectConfig<LinearCfg>;

export type ArcCfg = AxisBaseCfg & {
  startAngle?: number;
  endAngle?: number;
  radius: number;
  center: Point;
};
export type ArcOptions = DisplayObjectConfig<ArcCfg>;

export type HelixCfg = AxisBaseCfg & {
  a?: number;
  b?: number;
  startAngle?: number;
  endAngle?: number;
  precision?: number;
};
export type HelixOptions = DisplayObjectConfig<HelixCfg>;
