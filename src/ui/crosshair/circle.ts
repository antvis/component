import { CrosshairBase } from './base';
import { circle } from '../marker/symbol';
import { deepAssign, throttle } from '../../util';
import { CIRCLE_CROSSHAIR_DEFAULT_STYLE } from './constant';
import { CircleCrosshairStyleProps, CircleCrosshairOptions } from './types';
import type { Point } from '../../types';

export type { CircleCrosshairStyleProps, CircleCrosshairOptions };

export class CircleCrosshair extends CrosshairBase<CircleCrosshairStyleProps> {
  public static tag = 'circle-crosshair';

  protected static defaultOptions = {
    style: CIRCLE_CROSSHAIR_DEFAULT_STYLE,
  };

  protected get crosshairPath() {
    return this.createCirclePath();
  }

  constructor(options: CircleCrosshairOptions) {
    super(deepAssign({}, CircleCrosshair.defaultOptions, options));
  }

  public update(cfg: CircleCrosshairStyleProps) {
    super.update(cfg);
  }

  @throttle(20)
  public setPointer([x, y]: Point) {
    super.setPointer([x, y]);
    const [lx, ly] = this.localPointer;
    const {
      center: [cx, cy],
    } = this.attributes;
    const path = this.createCirclePath(((lx - cx) ** 2 + (ly - cy) ** 2) ** 0.5) as any;
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
    return circle(x, y, radius || defaultRadius) as any[];
  }
}
