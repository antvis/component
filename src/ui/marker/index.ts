import { Path, Image, ImageStyleProps, PathStyleProps, DisplayObject } from '@antv/g';
import { deepMix, isFunction } from '@antv/util';
import { GUI } from '../../core/gui';
import { parseMarker } from './utils';
import {
  circle,
  square,
  diamond,
  triangleDown,
  triangle,
  cross,
  point,
  hexagon,
  bowtie,
  hyphen,
  tick,
  plus,
  line,
  dot,
  dash,
  smooth,
  hv,
  vh,
  hvh,
  vhv,
} from './symbol';
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

  private markerShape: DisplayObject | undefined;

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
  }

  connectedCallback() {
    this.update();
  }

  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    if (name === 'x' || name === 'y' || name === 'size' || name === 'symbol') {
      this.update();
    } else if (this.markerShape) {
      this.markerShape.style[name] = newValue;
    }
  }

  /**
   * 组件的更新
   */
  public update(cfg: Partial<MarkerStyleProps> = {}): void {
    this.attr(deepMix({}, this.attributes, cfg));
    const { Ctor, name, ...style } = this.getStyleProps() || {};
    if (this.markerShape && this.markerShape.name === name) {
      this.markerShape.attr(style);
      return;
    }
    if (this.markerShape) this.clear();
    if (Ctor) {
      this.markerShape = new Ctor({ name, style });
      this.appendChild(this.markerShape);
    }
  }

  /**
   * 组件的清除
   */
  public clear() {
    this.markerShape?.destroy();
    this.markerShape = undefined;
    this.removeChildren();
  }

  private getStyleProps() {
    const { symbol } = this.style;
    const markerType = parseMarker(symbol);

    if (['base64', 'url', 'image'].includes(markerType)) {
      return {
        Ctor: Image,
        name: 'markerImage',
        ...this.getMarkerImageShapeCfg(),
      };
    }
    if (markerType === 'symbol') {
      return {
        Ctor: Path,
        name: 'markerSymbol',
        ...this.getMarkerSymbolShapeCfg(),
      };
    }

    return null;
  }

  // symbol marker
  private getMarkerSymbolShapeCfg(): PathStyleProps {
    const { x = 0, y = 0, size = 0, symbol, ...args } = this.attributes;
    const r = (size as number) / 2;
    const symbolFn = isFunction(symbol) ? symbol : Marker.MARKER_SYMBOL_MAP.get(symbol);
    const path = symbolFn?.(0, 0, r) as any;
    return {
      path,
      ...args,
      // do not inherit className
      class: 'marker-symbol',
    };
  }

  // image marker
  private getMarkerImageShapeCfg(): ImageStyleProps {
    const { size = 0, symbol } = this.attributes;
    const r2 = (size as number) * 2;
    return {
      x: -size,
      y: -size,
      width: r2,
      height: r2,
      img: symbol as unknown as HTMLImageElement,
    };
  }
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
