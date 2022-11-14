export interface GridItemConfig {}

export interface GridContainerConfig {}

export interface GridLayoutConfig {
  type: 'grid';
  containerConfig: Partial<GridContainerConfig>;
  itemsConfig: Partial<GridItemConfig>[];
}
