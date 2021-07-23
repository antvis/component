import { Group } from '@antv/g';
import { ShapeAttrs, ShapeCfg } from '../../types';

export type BreadCrumbItem = {
  /** 展示的文案 */
  name: string;

  /** id */
  id: string;
};

export type BreadCrumbAttrs = {
  /** 起点 x 坐标位置 */
  readonly x: number;
  /** 起点 y 坐标位置 */
  readonly y: number;
  /** 容器宽度 */
  readonly width?: number;
  /** 容器高度 */
  readonly height?: number;
  /** 容器内边距。容器实际可用大小 = 容器宽高度 - 内边距 */
  readonly padding?: number | number[];
  /** 面包屑 items */
  readonly items: BreadCrumbItem[];
  /** 面包屑分隔符 */
  readonly separator?: {
    /** 分隔符内容, 默认: '/'. 支持传入一个 group, 外部自行控制大小 */
    text?: string | Group;
    /** 分隔符样式（不需要激活样式） */
    style?: ShapeAttrs;
    /** 分隔符两边间距 */
    spacing?: number;
  };

  /** 样式 */
  /** 字体样式 */
  readonly textStyle?: {
    /** 默认字体样式 */
    default?: ShapeAttrs;
    /** 激活字体样式 */
    active?: ShapeAttrs;
  };

  /** 如果作为通用组件，给其它用户使用 */
  readonly onclick?: (evt: any /** 这个我来定义把 */) => void;
};

export type BreadCrumbOptions = ShapeCfg & {
  attrs: BreadCrumbAttrs;
};
