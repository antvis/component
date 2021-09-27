import { Path } from '@antv/g';
import { deepMix } from '@antv/util';
import { GUI } from '../../core/gui';
import { Tag } from '../tag';
import { CROSSHAIR_BASE_DEFAULT_STYLE } from './constant';
import type { CrosshairBaseCfg, CrosshairBaseOptions } from './types';
import type { PathCommand, Point } from '../../types';

export abstract class CrosshairBase<T extends CrosshairBaseCfg> extends GUI<Required<T>> {
  public static tag = 'crosshair-base';

  protected static defaultOptions = {
    type: CrosshairBase.tag,
    style: CROSSHAIR_BASE_DEFAULT_STYLE,
  };

  /**
   * 指针位置
   */
  protected pointer!: Point;

  protected tagShape!: Tag;

  protected crosshairShape!: Path;

  /**
   * 获得 crosshair 的 path
   */
  protected abstract get crosshairPath(): PathCommand[];

  private get tagCfg() {
    const { text } = this.attributes;
    const { position, ...rest } = text!;
    return rest;
  }

  private get crosshairCfg() {
    const { lineStyle } = this.attributes;
    return {
      ...lineStyle,
      path: this.crosshairPath,
    };
  }

  constructor(options: CrosshairBaseOptions) {
    super(deepMix({}, CrosshairBase.defaultOptions, options));
    this.init();
  }

  public init() {
    this.initShape();
    this.adjustLayout();
  }

  public update(cfg: Partial<CrosshairBaseCfg>) {
    this.attr(deepMix({}, this.attributes, cfg));
    this.tagShape.update(this.tagCfg);
    this.crosshairShape.attr(this.crosshairCfg);
    this.adjustLayout();
  }

  public clear() {}

  public destroy() {}

  /**
   * 设置当前指针的位置
   * 1. 线条类型 调整位置即可
   * 2. circle 和 polygon 需要重新计算 path
   */
  public setPointer(pointer: Point) {
    this.pointer = pointer;
  }

  /**
   * 调整tag
   */
  protected abstract adjustLayout(): void;

  private initShape() {
    this.tagShape = new Tag({ name: 'tag', style: this.tagCfg });
    this.appendChild(this.tagShape);
    this.crosshairShape = new Path({
      name: 'crosshair',
      style: this.crosshairCfg,
    });
    this.appendChild(this.crosshairShape);
  }
}
