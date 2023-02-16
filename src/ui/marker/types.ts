import type { ComponentOptions } from '../../core';
import { ShapeAttrs } from '../../types';

export type FunctionalSymbol = (x: number, y: number, r: number) => any;

export type MarkerStyleProps = {
  style: ShapeAttrs & {
    size?: number;
    symbol: string | FunctionalSymbol;
  };
};

export type MarkerOptions = ComponentOptions<MarkerStyleProps>;
