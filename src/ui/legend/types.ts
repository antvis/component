import type { TextStyleProps } from '@antv/g';
import type { DisplayObjectConfig, ShapeAttrs, ImageProps, PathProps } from '../../types';
import type { MarkerStyleProps } from '../marker/types';
import type { PageNavigatorCfg } from './categoryItems';

type TextProps = Omit<TextStyleProps, 'text'>;

export type State = 'selected' | 'unselected' | 'disabled';
export type SymbolCfg = MarkerStyleProps['symbol'];
export type MixShapeStyleProps = ShapeAttrs & {
  disabled?: ShapeAttrs;
  unselected?: TextProps;
  active?: ShapeAttrs;
};
export type ItemMarkerCfg = {
  size?: number;
  symbol?: MarkerStyleProps['symbol'];
  style?: MixShapeStyleProps;
};
type MixTextStyleProps = TextProps & {
  disabled?: TextProps;
  unselected?: TextProps;
  active?: TextProps;
};
export type ItemNameCfg = {
  content?: string;
  spacing?: number;
  style?: MixTextStyleProps;
};
export type ItemValueCfg = {
  content?: string;
  spacing?: number;
  // todo 待定
  align?: 'left' | 'right';
  style?: MixTextStyleProps;
};
/**
 * 连续图例色轨
 */
export type RailCfg = {
  /**
   * @title 色板宽度
   */
  width?: number;
  /**
   * @title 色板高度
   */
  height?: number;
  /**
   * @title 色板类型
   */
  type?: 'color' | 'size';
  /**
   * @title 是否分块
   */
  chunked?: boolean;
  /**
   * @title 分块连续图例分割点
   */
  ticks?: number[];
  /**
   * @title 是否使用渐变色
   */
  isGradient?: boolean | 'auto';
  /**
   * @title 色板背景色
   */
  backgroundColor?: string;
};

/**
 * @title 连续图例指示器
 */
export type IndicatorCfg = {
  size?: number;
  /**
   * @title 背景样式. CSS 样式
   */
  backgroundStyle?: object;
  /**
   * @title 文本内容
   */
  text?: {
    /**
     * @title 文本格式化方式
     */
    formatter?: (value: number) => string;
    /**
     * @title 文本样式. CSS 样式
     */
    style?: object;
  };
};

/**
 * 连续图例 滑动手柄
 */
export type HandleCfg = {
  size?: number;
  icon?: {
    marker?: SymbolCfg;
    style?: ImageProps | PathProps;
  };
};

/**
 * 分类图例，图例项图标
 */
type LegendItemMarkerCfg = ItemMarkerCfg;

export type LegendBaseCfg = {
  x?: number;
  y?: number;
  // 图例最大宽(横)/高（纵）
  maxWidth?: number;
  maxHeight?: number;
  /**
   * @title 内边距
   * @description 图例内边距
   */
  padding?: number | number[];
  inset?: number | number[];
  /**
   * @title 背景样式
   */
  backgroundStyle?: ShapeAttrs;
  /**
   * @title 图例方向
   */
  orient?: 'horizontal' | 'vertical';
  /**
   * @title 图例标题
   */
  title?: {
    content?: string;
    spacing?: number;
    style?: Partial<TextProps>;
    // 目前仅对 连续图例 生效
    align?: 'left' | 'center' | 'right';
    useHTML?: boolean;
    // Width and height must be specified when `useHTML` is true, otherwise, width and height will be specified 80*20
    width?: number;
    height?: number;
  };
  /**
   * @title 图例类型
   */
  type?: 'category' | 'continuous';
};

export type LegendBaseOptions = DisplayObjectConfig<LegendBaseCfg>;

/**
 * 连续图例配置
 */
export type ContinuousCfg = LegendBaseCfg & {
  // 最小值
  min: number;
  // 最大值
  max: number;
  // 开始区间
  start?: number;
  // 结束区间
  end?: number;

  // 色板颜色
  color?: string | string[];
  // 标签
  label?: {
    /**
     * @title 标签样式
     */
    style?: TextProps;
    /**
     * @title 标签与轨道间距
     * @description
     */
    spacing?: number;
    /**
     * @title 标签对齐方式
     * @description rail 代表标签与滑轨对齐；当 orient 为 horizontal 时，start 代表标签在滑轨上方，否则为下方，当 orient 为 vertical 时，start 代表标签在滑轨左侧，否则为右侧
     */
    align?: 'rail' | 'start' | 'end';
    /**
     * @title 偏移量。分别为平行与轴线方向和垂直于轴线方向的偏移量
     */
    offset?: [number, number];
    /**
     * @title Flush labels
     * @description use LabelFlush to control whether change the textAlign of labels on the edge of the axis os that they could stay inside the span of axis.
     */
    flush?: boolean;
    /**
     * @title 标签格式化方式
     */
    formatter?: (value: number, idx?: number) => string;
  };
  // 色板配置
  rail?: {
    /**
     * @title 色板类型
     */
    type?: 'color' | 'size';
    /**
     * @title 是否分块
     */
    chunked?: boolean;
    /**
     * @title 分块连续图例分割点
     */
    ticks?: number[];
    /**
     * @title 是否使用渐变色
     */
    isGradient?: boolean | 'auto';
    /**
     * @title 色板背景色
     */
    backgroundColor?: string;
  };
  // 是否可滑动
  slidable?: boolean;
  // 滑动步长
  step?: number;
  // 手柄配置
  handle?: HandleCfg;
  // 指示器
  indicator?: {
    padding?: number | number[];
    background?: {
      fill?: string;
    };
    /**
     * @title 文本内容
     */
    text?: {
      /**
       * @title 文本格式化方式
       */
      formatter?: (value: number) => string;
      /**
       * @title 文本样式. CSS 样式
       */
      style?: object;
    };
  };
};

export type ContinuousOptions = DisplayObjectConfig<ContinuousCfg>;

// ===== Category Legend =====
/**
 * 分类图例，图例项
 */
export type CategoryItemValue = {
  id?: string;
  marker?: string;
  name?: string;
  value?: string;
  color?: string;
  state?: string;
  [key: keyof any]: any;
};

// 分类图例配置
export type CategoryCfg = LegendBaseCfg & {
  padding?: number | number[];
  items: CategoryItemValue[];
  // 图例项宽度（等分形式）
  itemWidth?: number;
  itemHeight?: number;
  // 图例项间的间隔
  spacing?: [number, number];
  itemMarker?:
    | Partial<LegendItemMarkerCfg>
    | ((item: CategoryItemValue, index: number, items: CategoryItemValue[]) => LegendItemMarkerCfg);
  itemName?: Omit<ItemNameCfg, 'content'> & {
    formatter?: (item: CategoryItemValue, index: number, items: CategoryItemValue[]) => string;
  };
  itemValue?: Omit<ItemValueCfg, 'content'> & {
    formatter?: (item: CategoryItemValue, index: number, items: CategoryItemValue[]) => string;
  };
  itemPadding?: number | number[];
  itemBackgroundStyle?: MixShapeStyleProps;
  // 图例项最大宽度（跟随形式）
  maxItemWidth?: number;
  // 自动换行、列
  autoWrap?: boolean;
  cols?: number;
  // 最大行（横）/列（纵）数
  // maxCols?: number; // [todo] 暂时不提供
  maxRows?: number;
  // 图例项倒序
  reverse?: boolean;
  // todo 优化类型定义
  pageNavigator?: PageNavigatorCfg;
};

export type CategoryOptions = DisplayObjectConfig<CategoryCfg>;
