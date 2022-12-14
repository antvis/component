import type { DisplayObjectConfig } from '../../types';

type CustomElement = string | HTMLElement;

export type TooltipPosition =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export type TooltipItem = {
  name?: string;
  value?: number | string;
  index?: number;
  color?: string;
  [key: string]: any;
};

export interface TooltipCfg {
  x?: number;
  y?: number;
  visibility?: 'visible' | 'hidden';
  /** 标题 */
  title?: string;
  /* tooltip 位置 */
  position?: TooltipPosition;
  /* 在位置方向上的偏移量 */
  offset?: [number, number];
  /* 自动调整位置，需要设置容器属性 */
  autoPosition?: boolean;
  /** 指针是否可进入 */
  enterable?: boolean;
  /** 画布的左上角坐标 */
  container: {
    x: number;
    y: number;
  };
  /** tooltip 在画布中的边界 */
  bounding: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /* 项目 */
  items?: TooltipItem[];
  /* 模版 */
  template?: {
    /* 容器模版 */
    container?: string;
    title?: string;
    /* item模版 */
    item?: string;
  };
  /* 自定义内容 */
  customContent?: CustomElement;
  /**
   * 样式
   */
  style?: {
    [key: string]: {
      [key: string]: any;
    };
  };
}

export type TooltipOptions = DisplayObjectConfig<TooltipCfg>;
