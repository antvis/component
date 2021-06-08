import { ShapeCfg } from '../../types';

export type FunctionalSymbol = (x: number, y: number, r: number) => any;

export type MarkerOptions = ShapeCfg & {
  attrs: {
    /**
     * 标记的位置 x，默认为 0
     */
    x?: number;
    /**
     * 标记的位置 x，默认为 0
     */
    y?: number;
    /**
     * 标记的大小，默认为 16
     */
    r?: number;
    /**
     * 标记的类型，或者 path callback
     */
    symbol: string | FunctionalSymbol;
  };
};
