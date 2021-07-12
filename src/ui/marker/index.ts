import { Path } from '@antv/g';
import { deepMix, isFunction } from '@antv/util';
import { GUI } from '../core/gui';
import type { DisplayObject } from '../../types';
import type { MarkerOptions, FunctionalSymbol } from './types';
import { circle, square, diamond, triangleDown, triangle } from './symbol';

export { MarkerOptions, FunctionalSymbol };

/**
 * Marker
 */
export class Marker extends GUI<MarkerOptions> {
  /**
   * 标签类型
   */
  public static tag = 'marker';

  private pathShape: DisplayObject;

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
      r: 16,
    },
  };

  constructor(options: MarkerOptions) {
    super(deepMix({}, Marker.defaultOptions, options));

    this.init();
  }

  attributeChangedCallback(name: string, value: any): void {
    console.log('attributeChangedCallback', name, value);
  }

  public getPathShape() {
    return this.pathShape;
  }

  /**
   * 根据 type 获取 maker shape
   */
  public init(): void {
    const { x, y, r, symbol, ...args } = this.attributes;

    const symbolFn = isFunction(symbol) ? symbol : Marker.MARKER_SYMBOL_MAP.get(symbol);
    const path = symbolFn(x, y, r);

    this.pathShape = new Path({
      attrs: {
        // 左上角锚点
        x,
        y,
        path,
        ...args,
      },
    });
    this.appendChild(this.pathShape);
  }

  /**
   * 组件的更新
   */
  public update() {
    throw new Error('Method not implemented.');
  }

  /**
   * 组件的清除
   */
  public clear() {
    throw new Error('Method not implemented.');
  }
}

// 内置的组件
Marker.registerSymbol('circle', circle);
Marker.registerSymbol('square', square);
Marker.registerSymbol('diamond', diamond);
Marker.registerSymbol('triangle', triangle);
Marker.registerSymbol('triangle-down', triangleDown);
