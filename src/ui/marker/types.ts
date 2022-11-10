import { ShapeAttrs, DisplayObjectConfig } from '../../types';

export type FunctionalSymbol = (x: number, y: number, r: number) => any;

export interface MarkerStyleProps extends ShapeAttrs {
  /**
   * 标记的大小，默认为 16
   */
  size?: number;
  /**
   * 标记的类型，或者 path callback
   */
  symbol: string | FunctionalSymbol;
}

export type MarkerOptions = DisplayObjectConfig<MarkerStyleProps>;
