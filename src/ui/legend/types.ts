import type { ShapeCfg, ShapeAttrs, StyleState, MixAttrs } from '../../types';
import type { MarkerAttrs } from '../marker/types';
// marker配置
type MarkerCfg = string | MarkerAttrs['symbol'];
export type State = StyleState | 'default-active' | 'selected-active';

// 色板
export type RailCfg = {
  // 色板宽度
  width?: number;
  // 色板高度
  height?: number;
  // 色板类型
  type?: 'color' | 'size';
  // 是否分块
  chunked?: boolean;
  // 分块连续图例分割点
  ticks?: number[];
  // 是否使用渐变色
  isGradient?: boolean | 'auto';
  // 色板背景色
  backgroundColor?: string;
};

export type IndicatorCfg = {
  size?: number;
  backgroundStyle?: ShapeAttrs;
  spacing?: number;
  padding?: number | number[];
  text?: {
    formatter?: (value: number) => string;
    style?: ShapeAttrs;
  };
};

// 滑动手柄
type HandleCfg = {
  size?: number;
  spacing?: number;
  icon?: {
    marker?: MarkerCfg;
    style?: ShapeAttrs;
  };
  text?: {
    style?: ShapeAttrs;
    formatter?: (value: number) => string;
    align?: 'rail' | 'inside' | 'outside';
  };
};

// 图例项
type CategoryItem = {
  state?: State;
  name?: string;
  value?: string;
  id?: string;
};

// 图例项图标
export type ItemMarkerCfg = {
  marker: MarkerCfg;
  size: number;
  style: MixAttrs;
};

// 图例项Name
export type ItemNameCfg = {
  // name与marker的距离
  spacing: number;
  style: MixAttrs;
  formatter: (text: string) => string;
};

// 图例项值
export type ItemValueCfg = {
  spacing: number;
  align: 'left' | 'right';
  style: MixAttrs;
  formatter: (text: string) => string;
};

// 单个图例的配置
export type CategoryItemCfg = {
  identify?: string;
  itemWidth?: number;
  maxItemWidth?: number;
  state?: State;
  itemMarker: ItemMarkerCfg;
  itemName: {
    content?: string;
    spacing?: number;
    style?: MixAttrs;
  };
  itemValue: {
    content?: string;
    spacing?: number;
    style: MixAttrs;
  };
  backgroundStyle: MixAttrs;
};

// 分页器
type PageNavigatorCfg = {
  // 按钮
  button: {
    // 按钮图标
    marker: MarkerCfg | ((type: 'prev' | 'next') => MarkerCfg);
    // 按钮状态样式
    style: MixAttrs;
    // 尺寸
    size: number;
  };
  // 页码
  pagination: {
    style: ShapeAttrs;
    divider: string;
    formatter: (pageNumber: number) => number | string;
  };
};

export type LegendBaseCfg = ShapeCfg['attrs'] & {
  // 图例内边距
  padding?: number | number[];
  // 背景
  backgroundStyle?: MixAttrs;
  // 布局
  orient?: 'horizontal' | 'vertical';
  // 标题
  title?: {
    content: string;
    spacing?: number;
    align?: 'left' | 'center' | 'right';
    style?: ShapeAttrs;
    formatter?: (text: string) => string;
  };
  // Legend类型
  type?: 'category' | 'continuous';
};

export type LegendBaseOptions = {
  attrs: LegendBaseCfg;
};

// 连续图例配置
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
  label?:
    | false
    | {
        style?: ShapeAttrs;
        spacing?: number;
        formatter?: (value: number, idx: number) => string;
        align?: 'rail' | 'inside' | 'outside';
      };
  // 色板配置
  rail?: RailCfg;
  // 是否可滑动
  slidable?: boolean;
  // 滑动步长
  step?: number;
  // 手柄配置
  handle?: false | HandleCfg;
  // 指示器
  indicator?: false | IndicatorCfg;
};

export type ContinuousOptions = {
  attrs: ContinuousCfg;
};

// 分类图例配置
export type CategoryCfg = LegendBaseCfg & {
  items: CategoryItem[];
  // 图例最大宽(横)/高（纵）
  maxWidth?: number;
  maxHeight?: number;
  // 最大行（横）/列（纵）数
  maxCols?: number;
  maxRows?: number;
  // 图例项宽度（等分形式）
  itemWidth?: number;
  // 图例项最大宽度（跟随形式）
  maxItemWidth?: number;
  // 图例项间的间隔
  spacing?: [number, number];
  itemMarker?: Partial<ItemMarkerCfg> | ((item: CategoryItem, index: number, items: CategoryItem[]) => ItemMarkerCfg);
  itemName?: Partial<ItemNameCfg> | ((item: CategoryItem, index: number, items: CategoryItem[]) => ItemNameCfg);
  itemValue?: Partial<ItemValueCfg> | ((item: CategoryItem, index: number, items: CategoryItem[]) => ItemValueCfg);
  itemBackgroundStyle?: MixAttrs | ((item: CategoryItem, index: number, items: CategoryItem[]) => MixAttrs);
  // 自动换行、列
  autoWrap?: boolean;
  // 图例项倒序
  reverse?: boolean;
  // 分页
  pageNavigator?: false | PageNavigatorCfg;
};

export type CategoryOptions = LegendBaseCfg & {
  attrs: CategoryCfg;
};
