import { Path, Group } from '@antv/g';
import { deepMix } from '@antv/util';
import { GUI } from '../../core/gui';
import { maybeAppend } from '../../util';
import { Tag } from '../tag';
import { CROSSHAIR_BASE_DEFAULT_STYLE } from './constant';
import type { CrosshairBaseCfg, CrosshairBaseOptions } from './types';
import type { Point } from '../../types';

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
  }

  public render(attributes: T, container: Group) {
    const group = maybeAppend(container, '.crosshair-group', 'g').attr('className', 'crosshair-group').node();
    this.shapesGroup = group;

    this.tagShape = maybeAppend(
      group,
      '.crosshair-tag',
      () => new Tag({ className: 'crosshair-tag', style: this.tagCfg })
    ).node() as Tag;
    this.crosshairShape = maybeAppend(
      group,
      '.crosshair-path',
      () => new Path({ className: 'crosshair-path', style: this.crosshairCfg })
    ).node() as Path;

    this.adjustLayout();
  }

  public update(cfg: Partial<CrosshairBaseCfg> = {}) {
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
