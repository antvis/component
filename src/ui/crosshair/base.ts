import { Path, Group } from '@antv/g';
import { deepMix } from '@antv/util';
import { GUI } from '../../core/gui';
import { select, subObject } from '../../util';
import { Tag } from '../tag';
import { CROSSHAIR_BASE_DEFAULT_STYLE } from './constant';
import type { CrosshairBaseStyleProps, CrosshairBaseOptions } from './types';
import type { Point } from '../../types';

export abstract class CrosshairBase<T extends CrosshairBaseStyleProps> extends GUI<Required<T>> {
  public static tag = 'crosshair-base';

  protected static defaultOptions = {
    style: CROSSHAIR_BASE_DEFAULT_STYLE,
  };

  /**
   * 指针位置
   */
  protected pointer!: Point;

  protected shapesGroup!: Group;

  protected tagShape!: Tag;

  protected crosshairShape!: Path;

  /**
   * 获得 pointer 的相对坐标
   */
  protected get localPointer() {
    const [bx, by] = this.getPosition();
    const [x, y] = this.pointer;
    return [x - bx, y - by];
  }

  /**
   * 获得 crosshair 的 path
   */
  protected abstract get crosshairPath(): any[];

  private get tagCfg() {
    const tagStyle = subObject(this.attributes, 'tag');
    const { position, ...rest } = tagStyle;
    return rest;
  }

  private get crosshairCfg() {
    const lineStyle = subObject(this.attributes, 'line');
    return {
      ...lineStyle,
      path: this.crosshairPath,
    };
  }

  constructor(options: CrosshairBaseOptions) {
    super(deepMix({}, CrosshairBase.defaultOptions, options));
  }

  public render(attributes: T, container: Group) {
    const group = select(container).maybeAppendByClassName('.crosshair-group', 'g').node();
    this.shapesGroup = group;

    this.tagShape = select(group)
      .maybeAppend('.crosshair-tag', () => new Tag({ className: 'crosshair-tag', style: this.tagCfg }))
      .node() as Tag;
    this.crosshairShape = select(group)
      .maybeAppendByClassName('.crosshair-path', 'path')
      .node()
      .attr(this.crosshairCfg) as Path;

    this.adjustLayout();
  }

  public update(cfg: Partial<CrosshairBaseStyleProps> = {}) {
    this.attr(deepMix({}, this.attributes, cfg));
    this.render(this.attributes, this);
  }

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
}
