import type { Group, DisplayObject } from '@antv/g';
import type { FlexLayoutConfig } from './flex/types';
import type { GridLayoutConfig } from './grid/types';

export type BBox = { x: number; y: number; width: number; height: number };
export type LayoutItem = BBox;
export interface LayoutContainer extends BBox {
  children: LayoutItem[];
}
export type LayoutConfig = FlexLayoutConfig | GridLayoutConfig;
export type LayoutType = LayoutConfig['type'];
export type LayoutReturns = BBox[];
export type LayoutExecuter = (container: LayoutContainer, items: LayoutItem[], config: LayoutConfig) => LayoutReturns;
