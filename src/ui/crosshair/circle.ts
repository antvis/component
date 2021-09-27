import { CrosshairBase } from './base';
import { circle } from '../marker/symbol';
import { deepAssign, throttle } from '../../util';
import { CIRCLE_CROSSHAIR_DEFAULT_STYLE } from './constant';
import { CircleCrosshairCfg, CircleCrosshairOptions } from './types';
import type { PathCommand, Point } from '../../types';

export type { CircleCrosshairCfg, CircleCrosshairOptions };

export class CircleCrosshair extends CrosshairBase<CircleCrosshairCfg> {
  public static tag = 'circle-crosshair';

  protected static defaultOptions = {
    type: CircleCrosshair.tag,
    style: CIRCLE_CROSSHAIR_DEFAULT_STYLE,
  };

  protected get crosshairPath() {
    return this.createCirclePath();
  }

  constructor(options: CircleCrosshairOptions) {
    super(deepAssign({}, CircleCrosshair.defaultOptions, options));
  }

  public update(cfg: CircleCrosshairCfg) {
    super.update(cfg);
  }

  @throttle(20)
  public setPointer([x, y]: Point) {
    const {
      center: [cx, cy],
    } = this.attributes;
    const path = this.createCirclePath(((x - cx) ** 2 + (y - cy) ** 2) ** 0.5);
    this.crosshairShape.attr({ path });
  }

  protected adjustLayout() {
    this.tagShape.hide();
  }

  private createCirclePath(radius?: number) {
    const {
      center: [x, y],
      defaultRadius,
    } = this.attributes;
    return circle(x, y, radius || defaultRadius) as PathCommand[];
  }
}
