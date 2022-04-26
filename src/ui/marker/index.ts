import { Path, Image, PathCommand, ImageStyleProps, PathStyleProps, DisplayObject } from '@antv/g';
import { deepMix, isFunction } from '@antv/util';
import { GUI } from '../../core/gui';
import { parseMarker } from './utils';
import { circle, square, diamond, triangleDown, triangle, line, dot, dash, smooth, hv, vh, hvh, vhv } from './symbol';
import type { MarkerStyleProps, MarkerOptions, FunctionalSymbol } from './types';

export type { MarkerStyleProps, MarkerOptions, FunctionalSymbol };

/**
 * Marker
 */
export class Marker extends GUI<Required<MarkerStyleProps>> {
  /**
   * 标签类型
   */
  public static tag = 'marker';

  private markerShape?: Path | Image;

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
   * 默认参数
   */
  private static defaultOptions = {
    type: Marker.tag,
    style: {
      x: 0,
      y: 0,
      size: 16,
    },
  };

  constructor(options: MarkerOptions) {
    super(deepMix({}, Marker.defaultOptions, options));
    this.init();
  }

  /**
   * 根据 type 获取 maker shape
   */
  public init(): void {
    this.update();
  }

  /**
   * 组件的更新
   */
  public update(cfg?: Partial<MarkerStyleProps>): void {
    this.attr(deepMix({}, this.attributes, cfg));
    this.clear();
    this.createMarker();
  }

  /**
   * 组件的清除
   */
  public clear() {
    this.markerShape?.destroy();
    this.removeChildren();
  }

  private createMarker() {
    const { symbol } = this.attributes;
    const markerType = parseMarker(symbol);

    if (['base64', 'url', 'image'].includes(markerType)) {
      this.markerShape = new Image({
        name: 'markerImage',
        style: this.getMarkerImageShapeCfg(),
      });
    } else if (markerType === 'symbol') {
      this.markerShape = new Path({
        name: 'markerSymbol',
        style: this.getMarkerSymbolShapeCfg(),
      });
    }

    if (this.markerShape) {
      this.appendChild(this.markerShape);
    }
  }

  // symbol marker
  private getMarkerSymbolShapeCfg(): PathStyleProps {
    const { x = 0, y = 0, size = 0, symbol, ...args } = this.attributes;
    const r = size / 2;
    const symbolFn = isFunction(symbol) ? symbol : Marker.MARKER_SYMBOL_MAP.get(symbol);
    const path = symbolFn?.(0, 0, r) as PathCommand[];
    return {
      path,
      ...args,
    };
  }

  // image marker
  private getMarkerImageShapeCfg(): ImageStyleProps {
    const { size = 0, symbol } = this.attributes;
    const r2 = size * 2;
    return {
      x: -size,
      y: -size,
      width: r2,
      height: r2,
      img: symbol as unknown as HTMLImageElement,
    };
  }
}

// 内置的组件
Marker.registerSymbol('circle', circle);
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
