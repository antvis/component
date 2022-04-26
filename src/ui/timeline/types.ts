import { DisplayObject, DisplayObjectConfig } from '@antv/g';
import { CircleProps, MixAttrs, RectProps } from 'types';
import { LinearOptions, LinearCfg } from '../axis';
import { TextCfg } from '../text';
import { ButtonCfg } from '../button';
import { CheckboxOptions } from '../checkbox';

export interface LayoutRowData {
  shape: DisplayObject;
  width: number | 'auto';
}
export interface LayoutColData {
  shape: DisplayObject;
  height: number | 'auto';
}
export type TimeData = {
  date: string;
  [k: string]: any;
};
export type PlayAxisBaseCfg = {
  /**
   * @title 时间选择
   * @description 时间选择， 起始时间与结束时间/单一时间
   */
  selection?: [TimeData['date'], TimeData['date']] | [TimeData['date']];
  /**
   * @title  单一时间
   * @description 单一时间
   */
  single?: boolean;
  /**
   * @title x 坐标
   * @description x 坐标
   */
  x: number;
  /**
   * @title y 坐标
   * @description y 坐标
   */
  y: number;
  /**
   * @title 总长度
   * @description 整个轴组件的长度
   */
  length: number;
  /**
   * @title 刻度配置
   * @description 调整刻度配置,实际上刻度是一条width为0的linear型axis组件
   */
  tickCfg?: Partial<LinearCfg>;
  /**
   * @title 刻度配置
   * @description 调整刻度配置,实际上刻度是一条width为0的linear型axis组件
   */
  tickInterval?: number;
  /**
   * @title  时间数据
   * @description 时间数据，必须是均匀等间距的，在方格形的时间轴中每个数据点代表一个小方格
   */
  timeData: TimeData[];
  /**
   * @title  tooltip内容
   * @description 自定义tooltip内容
   */
  customTooltip?: (timeData: TimeData) => string;
  /**
   * @title  变化时回调函数
   * @description 监听时间范围（或单一时间）变化的回调函数
   */
  onSelectionChange?: (selection: PlayAxisBaseCfg['selection']) => void;
  /**
   * @title     播放模式
   * @description increase 时间范围不断扩大，fixed固定平移selection
   */
  playMode?: 'increase' | 'fixed';
  /**
   * @title     播放循环
   * @description true循环，反之不循环
   */
  loop?: boolean;
  /**
   * @title    步距
   * @description 每一次移动多少个数据点
   */
  dataPerStep?: number;
};

export type CellAxisCfg = PlayAxisBaseCfg & {
  /**
   * @title    间隔时间
   * @description 每隔多少秒前进一步
   */
  interval?: number;
  /**
   * @title  cell 样式
   * @description 格子样式
   */
  cellStyle?: MixAttrs<Partial<RectProps>>;
  /**
   * @title  背景样式
   * @description 背景样式
   */
  backgroundStyle?: Partial<RectProps>;
  /**
   * @title   padding
   * @description background 的 padding
   */
  padding?: [number, number, number, number];
  /**
   * @title   格子间距
   * @description 格子间的间距
   */
  cellGap?: number;
};

export type SliderAxisCfg = PlayAxisBaseCfg & {
  /**
   * @title  delay
   * @description  动画停顿(ms)
   */
  delay?: number;
  /**
   * @title  duration
   * @description  动画过渡(ms)
   */
  duration?: number;
  /**
   * @title  手柄样式
   * @description 手柄样式
   */
  handleStyle?: CircleProps;
  /**
   * @title  背景样式
   * @description 背景样式
   */
  backgroundStyle?: Partial<Omit<RectProps, 'width' | 'x' | 'y'>>;
  /**
   * @title  selection样式
   * @description 选中时间范围样式
   */
  selectionStyle?: Partial<Omit<RectProps, 'width' | 'x' | 'y'>>;
};
export type CellAxisOptions = DisplayObjectConfig<CellAxisCfg>;
export type SliderAxisOptions = DisplayObjectConfig<SliderAxisCfg>;
type TicksOptions = LinearOptions;
type SingleModeControl = false | CheckboxOptions;
type Orient = {
  layout: 'row' | 'col';
  controlButtonAlign: 'normal' | 'left' | 'right';
};
export type SpeedControlCfg = {
  /**
   * @title 可调节的速度
   * @description 配置可调节的速度，建议配置范围在 5 个区间，如: [1.0, 2.0, 3.0, 4.0, 5.0], [0.5, 1.0, 1.5, 2.0, 2.5]
   */
  speeds?: number[];
  /**
   * @title   速度变化回调函数
   * @description 监听速度变化的回调函数
   */
  onSpeedChange?: (speedIdx: number) => void;
  /**
   * @title   x
   * @description x坐标
   */
  x?: number;
  /**
   * @title   y
   * @description y坐标
   */
  y?: number;
  /**
   * @title   width
   * @description 宽度
   */
  width?: number;
  /**
   * @title   height
   * @description 高
   */
  height?: number;
  /**
   * @title   label
   * @description label配置
   */
  label?: Omit<TextCfg, 'text' | 'width'>;
  /**
   * @title   spacing
   * @description label与按钮的间隔
   */
  spacing?: number;
  /**
   * @title        currentSpeed
   * @description 当前选择的时间下标
   */
  currentSpeedIdx?: number;
};

export type SpeedControlOptions = DisplayObjectConfig<SpeedControlCfg>;

type Controls =
  | false
  | {
      /**
       * @title  是否显示单一时间checkbox
       * @description false 不显示，否则应传入checkbox参数
       */
      singleModeControl?: SingleModeControl | false;
      /**
       * @title 播放器按钮，包含：play button，prev button and next button
       * @description 播放器按钮设置。设置为 null 时，不展示播放器按钮
       */
      controlButton?: {
        // /**
        //  * @title  停止按钮
        //  * @description 播放按钮设置。设置为 null 时，不展示播放按钮
        //  */
        // stopBtn?: ButtonCfg;
        /**
         * @title 播放按钮
         * @description 播放按钮设置。设置为 null 时，不展示播放按钮
         */
        playBtn?: Omit<ButtonCfg, 'onClick'> | false;
        /**
         * @title 后退按钮
         * @description 后退按钮设置。设置为 null 时，不展示后退按钮
         */
        prevBtn?: Omit<ButtonCfg, 'onClick'> | false;
        /**
         * @title 前进按钮
         * @description 前进按钮设置。设置为 null 时，不展示前进按钮
         */
        nextBtn?: Omit<ButtonCfg, 'onClick'> | false;
      };
      /**
       * @title 倍速调节器
       * @description 倍速调节器设置。设置为 null 时，不展示倍速调节器
       */
      speedControl?: Omit<SpeedControlCfg, 'onSpeedChange'> | false;
    };

export type TimelineCfg = {
  /**
   * @title x 坐标
   * @description x 坐标
   */
  x: number;
  /**
   * @title y 坐标
   * @description y 坐标
   */
  y: number;
  /**
   * @title 总宽度
   * @description 整个组件的宽度
   */
  width: number;
  /**
   * @title 高度
   * @description 整个组件的高度
   */
  height: number;
  /**
   * @title 时间数据
   * @description 时间数据，必须是均匀等间距的，每个数据点代表一个小方格
   */
  data: TimeData[];
  /**
   * @title  布局方向
   * @description 布局方向，见设计稿
   * @default 'left'
   */
  orient?: Orient;
  /**
   * @title 播放轴类型
   * @description 播放轴为slider型还是格子刻度型
   * @default 'slider'
   */
  type?: 'slider' | 'cell';
  /**
   * @title 播放轴cell类型配置
   * @description 播放轴为格子刻度型的配置，如果type不是cell则忽略
   */
  cellAxisCfg?: Omit<CellAxisCfg, 'onSelectionChange' | 'x' | 'y' | 'length' | 'timeData' | 'single'>;
  /**
   * @title 播放轴slider类型配置
   * @description 播放轴为格子刻度型的配置，如果type不是cell则忽略
   */
  sliderAxisCfg?: Omit<SliderAxisCfg, 'onSelectionChange' | 'x' | 'y' | 'length' | 'timeData' | 'single'>;
  /**
   * @title 播放控制
   * @description 配置播放器、单一时间checkbox
   * @default 'slider'
   */
  controls?: false | Controls;
  /**
   * @title  tooltip内容
   * @description 自定义tooltip内容
   */
  customTooltip?: (timeData: TimeData) => string;
  /**
   * @title   刻度尺
   * @description 自定义刻度尺
   */
  ticks?: false | Partial<TicksOptions>;
  /**
   * @title  变化时回调函数
   * @description 监听时间范围（或单一时间）变化的回调函数
   */
  onSelectionChange?: PlayAxisBaseCfg['onSelectionChange'];
  /**
   * @title  播放时回调函数
   * @description 监听播放的回调函数
   */
  onPlay?: () => void;
  /**
   * @title  停止时回调函数
   * @description 监听停止回调函数
   */
  onStop?: () => void;
  /**
   * @title  后退按钮点击回调函数
   * @description 监听后退的回调函数
   */
  onBackward?: () => void;
  /**
   * @title   前进按钮点击回调函数
   * @description 监听前进的回调函数
   */
  onForward?: () => void;
  /**
   * @title   速度变化回调函数
   * @description 监听速度变化的回调函数
   */
  onSpeedChange?: (speed: number) => void;
  /**
   * @title  单一时间设置变化回调函数
   * @description 监听单一时间设置的回调函数
   */
  onSingleTimeChange?: (value: boolean) => void;
  /**
   * @title    一倍速设置
   * @description 一秒多少个数据点
   */
  dataPerStep?: number;
  /**
   * @title    几倍速
   * @description 几倍速，透传给speedcontrol
   */
  speed?: number;
  /**
   * @title     播放模式
   * @description increase 时间范围不断扩大，fixed固定平移selection
   */
  playMode?: 'increase' | 'fixed';
  /**
   * @title     播放循环
   * @description true循环，反之不循环
   */
  loop?: boolean;
  /**
   * @title     单一时间
   * @description true为单一时间，false为时间范围
   */
  single?: boolean;
};
export type TimelineOptions = DisplayObjectConfig<TimelineCfg>;
