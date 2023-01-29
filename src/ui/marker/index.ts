import { Group } from '@antv/g';
import { isFunction } from '@antv/util';
import { GUI } from '../../core/gui';
import { select, ifShow } from '../../util';
import {
  bowtie,
  circle,
  cross,
  dash,
  diamond,
  dot,
  hexagon,
  hv,
  hvh,
  hyphen,
  line,
  plus,
  point,
  smooth,
  square,
  tick,
  triangle,
  triangleDown,
  vh,
  vhv,
} from './symbol';
import type { FunctionalSymbol, MarkerOptions, MarkerStyleProps } from './types';
import { parseMarker } from './utils';

export type { MarkerStyleProps, MarkerOptions, FunctionalSymbol };

function getType(symbol: MarkerStyleProps['symbol']): string | null {
  const markerType = parseMarker(symbol);

  if (['base64', 'url', 'image'].includes(markerType)) {
    return 'image';
  }
  if (symbol && markerType === 'symbol') {
    return 'path';
  }

  return null;
}

export class Marker extends GUI<MarkerStyleProps> {
  public render(attributes: MarkerStyleProps, container: Group) {
    const { x, y, symbol, size = 16, class: className, ...style } = attributes as Required<MarkerStyleProps>;
    const type = getType(symbol);

    ifShow(!!type, select(container), (group) => {
      group
        .maybeAppendByClassName(`marker`, type!)
        .addClassName(`${type}-marker`)
        .call((selection) => {
          if (type === 'image') {
            // todo 大小和 path symbol 保持一致
            const r = (size as number) * 2;
            selection.styles({
              img: symbol,
              width: r,
              height: r,
              x: -size,
              y: -size,
            });
          } else {
            const r = (size as number) / 2;
            const symbolFn = isFunction(symbol) ? symbol : Marker.getSymbol(symbol);
            // @ts-ignore
            selection.styles({ path: symbolFn?.(x, y, r), ...style });
          }
        });
    });
  }

  private static MARKER_SYMBOL_MAP = new Map<string, FunctionalSymbol>();

  /**
   * 注册 icon 类型
   * @param type
   * @param path
   */
  public static registerSymbol = (type: string, symbol: FunctionalSymbol) => {
    Marker.MARKER_SYMBOL_MAP.set(type, symbol);
  };

  /**
   * 获取已经注册的 icon 的 path
   */
  public static getSymbol = (type: string): FunctionalSymbol | undefined => {
    return Marker.MARKER_SYMBOL_MAP.get(type);
  };
}

/** Shapes for Point Geometry */
Marker.registerSymbol('cross', cross);
Marker.registerSymbol('hyphen', hyphen);
Marker.registerSymbol('line', line);
Marker.registerSymbol('plus', plus);
Marker.registerSymbol('tick', tick);

Marker.registerSymbol('circle', circle);
Marker.registerSymbol('point', point);
Marker.registerSymbol('bowtie', bowtie);
Marker.registerSymbol('hexagon', hexagon);
Marker.registerSymbol('square', square);
Marker.registerSymbol('diamond', diamond);
Marker.registerSymbol('triangle', triangle);
Marker.registerSymbol('triangle-down', triangleDown);
/** LineSymbols */
Marker.registerSymbol('line', line);
Marker.registerSymbol('dot', dot);
Marker.registerSymbol('dash', dash);
Marker.registerSymbol('smooth', smooth);
Marker.registerSymbol('hv', hv);
Marker.registerSymbol('vh', vh);
Marker.registerSymbol('hvh', hvh);
Marker.registerSymbol('vhv', vhv);
