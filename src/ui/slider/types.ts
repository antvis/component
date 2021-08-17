import type {
  ShapeAttrs,
  DisplayObjectConfig,
  TextProps,
  MixAttrs,
  RectProps,
  ImageProps,
  PathProps,
} from '../../types';
import type { MarkerCfg } from '../marker';
import type { SparklineCfg } from '../sparkline/types';

export type Pair<T> = [T, T];

export type HandleCfg = {
  /**
   * 是否显示Handle
   */
  show?: boolean;
  /**
   * 大小
   */
  size?: number;
  /**
   * 文本格式化
   */
  formatter?: (name: string, value: number) => string;
  /**
   * 文字样式
   */
  textStyle?: TextProps;
  /**
   * 文字与手柄的间隔
   */
  spacing?: number;
  /**
   * 手柄图标
   */
  handleIcon?: MarkerCfg['symbol'] | string;
  /**
   * 手柄图标样式
   */
  handleStyle?: MixAttrs<ImageProps | PathProps>;
};

export type SliderCfg = {
  x?: number;
  y?: number;
  orient?: 'vertical' | 'horizontal';
  values: Pair<number>;
  names: Pair<string>;
  min?: number;
  max?: number;
  width?: number;
  height?: number;
  padding?: number[];
  backgroundStyle?: MixAttrs<ShapeAttrs>;
  selectionStyle?: MixAttrs<RectProps>;
  handle?:
    | HandleCfg
    | {
        start: HandleCfg;
        end: HandleCfg;
      };

  /**
   * 缩略图数据及其配置
   */
  sparkline?: { padding?: number[] } & SparklineCfg;
};

export type SliderOptions = DisplayObjectConfig<SliderCfg>;
