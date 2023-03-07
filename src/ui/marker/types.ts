import type { ComponentOptions } from '../../core';
import type { BaseCustomElementStyleProps } from '../../shapes';

export type FunctionalSymbol = (x: number, y: number, r: number) => any;

export type MarkerStyleProps = BaseCustomElementStyleProps & {
  size?: number;
  symbol: string | FunctionalSymbol;
};

export type MarkerOptions = ComponentOptions<MarkerStyleProps>;
