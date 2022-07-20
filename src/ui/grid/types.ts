import type { DisplayObjectConfig } from '@antv/g';
import type { Vector2 } from '../../types';

export type GridStyleProps = {
  items: Array<{ id: string; points: Vector2[] }>;
  type?: 'line' | 'circle';
  // If type is 'circle', should specify the center.
  center?: Vector2;
  // If type is 'circle', determine whether to close path.
  closed?: boolean;
  // Style of grid line path.
  lineStyle?: { stroke?: string; lineWidth?: number; strokeOpacity?: number; lineDash?: string | (string | number)[] };
  /** FillColors between lines. */
  alternateColor?: string | string[] | null;
};

export type GridOptions = DisplayObjectConfig<GridStyleProps>;
