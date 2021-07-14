import { ShapeAttrs, ShapeCfg } from '../../types';
import { MarkerOptions } from '../marker';
import { SparklineAttrs } from '../sparkline/types';

export type Pair<T> = [T, T];

export type MixAttrs = ShapeAttrs & {
  active?: ShapeAttrs;
};

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
  formatter?: (text: string, idx: number) => string;
  /**
   * 文字样式
   */
  textStyle?: ShapeAttrs;
  /**
   * 文字与手柄的间隔
   */
  spacing?: number;
  /**
   * 手柄图标
   */
  handleIcon?: MarkerOptions['symbol'] | string;
  /**
   * 手柄图标样式
   */
  handleStyle?: MixAttrs;
};

export type SliderAttrs = ShapeAttrs & {
  orient?: 'vertical' | 'horizontal';
  values?: Pair<number>;
  names?: Pair<string>;
  min?: number;
  max?: number;
  width?: number;
  height?: number;
  padding?: {
    left: number;
    right: number;
    top: number;
    buttons: number;
  };
  backgroundStyle?: MixAttrs;
  selectionStyle?: MixAttrs;
  foregroundStyle?: MixAttrs;
  handle?:
    | HandleCfg
    | {
        start?: HandleCfg;
        end?: HandleCfg;
      };

  /**
   * 缩略图数据及其配置
   */
  sparklineCfg?: SparklineAttrs;
};

export type SliderOptions = ShapeCfg & {
  attrs: SliderAttrs;
};
