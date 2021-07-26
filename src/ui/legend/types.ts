import type { ShapeCfg, ShapeAttrs, MixAttrs } from '../../types';
import type { MarkerAttrs } from '../marker/types';
// marker配置
type MarkerCfg = string | MarkerAttrs['symbol'];

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
  name: string;
  value: number | string;
  id: number | string;
};

// 图例项图标
type ItemMarkerCfg = {
  symbol: MarkerCfg;
  size: number;
  style: MixAttrs;
};

// 图例项Name
type ItemNameCfg = {
  // name与marker的距离
  spacing: number;
  style: MixAttrs;
  formatter: (name: string, item: CategoryItem, index: number) => string;
};

// 图例项值
type ItemValueCfg = {
  spacing: number;
  align: 'left' | 'right';
  style: MixAttrs;
  formatter: (value: number, item: CategoryItem, index: number) => number | string;
};

// 图例项配置
export type CategoryItemsCfg = {
  items: CategoryItem[];
  itemCfg: {
    // 单个图例项高度
    height: number;
    // 单个图例项宽度
    width: number;
    // 图例项间的间隔
    spacing: number;
    marker: ItemMarkerCfg | ((item: CategoryItem, index: number, items: CategoryItem[]) => ItemMarkerCfg);
    name: ItemNameCfg | ((item: CategoryItem, index: number, items: CategoryItem[]) => ItemNameCfg);
    value: ItemValueCfg | ((item: CategoryItem, index: number, items: CategoryItem[]) => ItemValueCfg);
    // 图例项背景
    backgroundStyle: MixAttrs | ((item: CategoryItem, index: number, items: CategoryItem[]) => MixAttrs);
  };
};

// 分页器
type pageNavigatorCfg = {
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
  // 指示器
  indicator?: false | {};
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
  // 色板颜色
  color?: string | string[];
  // 标签
  label:
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
  // 选择区域
  value?: [number, number];
  // 滑动步长
  step?: number;
  // 手柄配置
  Handle?: false | HandleCfg;
};

export type ContinuousOptions = {
  attrs: ContinuousCfg;
};

// 分类图例配置
export type CategoryCfg = LegendBaseCfg & {
  items: CategoryItemsCfg;
  reverse: boolean;
  pageNavigator: false | pageNavigatorCfg;
};

export type CategoryOptions = {
  attrs: CategoryCfg;
};
