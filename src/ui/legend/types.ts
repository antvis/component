import type {
  DisplayObjectConfig,
  ShapeAttrs,
  StyleState,
  MixAttrs,
  TextProps,
  ImageProps,
  PathProps,
} from '../../types';
import type { MarkerCfg } from '../marker/types';
import type { PageNavigatorCfg } from '../page-navigator';

export type State = StyleState | 'default-active' | 'selected-active';
export type SymbolCfg = MarkerCfg['symbol'];
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
    style?: TextProps;
  };
};

// 滑动手柄
export type HandleCfg = {
  size?: number;
  spacing?: number;
  icon?: {
    marker?: SymbolCfg;
    style?: ImageProps | PathProps;
  };
  text?: {
    style?: TextProps;
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
  [key: string]: any;
};

// 图例项图标
export type ItemMarkerCfg = {
  marker?: SymbolCfg;
  size?: number;
  spacing?: number;
  style?: MixAttrs<ShapeAttrs & { size?: number }>;
};

// 图例项Name
export type ItemNameCfg = {
  // name与marker的距离
  spacing?: number;
  style?: MixAttrs<Partial<TextProps>>;
  formatter?: (text: string) => string;
};

// 图例项值
export type ItemValueCfg = {
  spacing?: number;
  align?: 'left' | 'right';
  style?: MixAttrs<Partial<TextProps>>;
  formatter?: (text: string) => string;
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
    style?: MixAttrs<Partial<TextProps>>;
  };
  itemValue: {
    content?: string;
    spacing?: number;
    style: MixAttrs<Partial<TextProps>>;
  };
  backgroundStyle: MixAttrs<ShapeAttrs>;
};

export type LegendBaseCfg = ShapeAttrs & {
  // 图例内边距
  padding?: number | number[];
  // 背景
  backgroundStyle?: MixAttrs<ShapeAttrs>;
  // 布局
  orient?: 'horizontal' | 'vertical';
  // 标题
  title?: {
    content?: string;
    spacing?: number;
    align?: 'left' | 'center' | 'right';
    style?: Partial<TextProps>;
    formatter?: (text: string) => string;
  };
  // Legend类型
  type?: 'category' | 'continuous';
};

export type LegendBaseOptions = DisplayObjectConfig<LegendBaseCfg>;

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
        style?: TextProps;
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

export type ContinuousOptions = DisplayObjectConfig<ContinuousCfg>;

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
  itemName?: ItemNameCfg | ((item: CategoryItem, index: number, items: CategoryItem[]) => ItemNameCfg);
  itemValue?: ItemValueCfg | ((item: CategoryItem, index: number, items: CategoryItem[]) => ItemValueCfg);
  itemBackgroundStyle?:
    | MixAttrs<ShapeAttrs>
    | ((item: CategoryItem, index: number, items: CategoryItem[]) => MixAttrs<ShapeAttrs>);
  // 自动换行、列
  autoWrap?: boolean;
  // 图例项倒序
  reverse?: boolean;
  // 分页
  pageNavigator?: false | PageNavigatorCfg;
};

export type CategoryOptions = DisplayObjectConfig<CategoryCfg>;
