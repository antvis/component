import { Path, Image } from '@antv/g';
import { deepMix, isFunction } from '@antv/util';
import { GUI } from '../core/gui';
import { parseMarker } from './utils';
import { circle, square, diamond, triangleDown, triangle } from './symbol';
import type { DisplayObject } from '../../types';
import type { MarkerAttrs, MarkerOptions, FunctionalSymbol } from './types';

export type { MarkerAttrs, MarkerOptions, FunctionalSymbol };

/**
 * Marker
 */
export class Marker extends GUI<MarkerAttrs> {
  /**
   * 标签类型
   */
  public static tag = 'marker';

  private markerShape: DisplayObject;

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
    attrs: {
      x: 0,
      y: 0,
      size: 16,
    },
  };

  constructor(options: MarkerOptions) {
    super(deepMix({}, Marker.defaultOptions, options));
    this.init();
  }

  attributeChangedCallback(name: string, value: any): void {}

  /**
   * 根据 type 获取 maker shape
   */
  public init(): void {
    this.createMarker();
  }

  /**
   * 组件的更新
   */
  public update(cfg: MarkerAttrs): void {
    this.attr(deepMix({}, this.attributes, cfg));
    this.clear();
    this.createMarker();
  }

  /**
   * 组件的清除
   */
  public clear() {
    this.markerShape.destroy();
    this.removeChildren();
  }

  private createMarker() {
    const { symbol } = this.attributes;
    const markerType = parseMarker(symbol);
    console.log(markerType, this);

    if (['base64', 'url', 'image'].includes(markerType)) {
      this.markerShape = new Image({
        name: 'markerImage',
        attrs: this.getMarkerImageAttrs(),
      });
      const { r } = this.attributes;
      // this.translate(-r, -r);
    } else if (markerType === 'symbol') {
      this.markerShape = new Path({
        name: 'markerSymbol',
        attrs: this.getMarkerSymbolAttrs(),
      });
    }

    this.appendChild(this.markerShape);
  }

  // symbol marker
  private getMarkerSymbolAttrs() {
    const { x, y, size, symbol, ...args } = this.attributes;
    const halfR = size / 2;
    const symbolFn = isFunction(symbol) ? symbol : Marker.MARKER_SYMBOL_MAP.get(symbol);
    const path = symbolFn(x, y, size);
    return {
      path,
      r: halfR,
      ...args,
    };
  }

  // image marker
  private getMarkerImageAttrs() {
    const { size, symbol } = this.attributes;
    const r2 = size * 2;
    return {
      x: r2,
      y: r2,
      width: r2,
      height: r2,
      img: symbol,
    };
  }
}

// 内置的组件
Marker.registerSymbol('circle', circle);
Marker.registerSymbol('square', square);
Marker.registerSymbol('diamond', diamond);
Marker.registerSymbol('triangle', triangle);
Marker.registerSymbol('triangle-down', triangleDown);
