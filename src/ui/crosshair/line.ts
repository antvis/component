import { CrosshairBase } from './base';
import { LINE_CROSSHAIR_DEFAULT_STYLE } from './constant';
import { deepAssign, getShapeSpace, throttle } from '../../util';
import type { LineCrosshairCfg, LineCrosshairOptions } from './types';
import type { PathCommand, Point } from '../../types';

export type { LineCrosshairCfg, LineCrosshairOptions };

export class LineCrosshair extends CrosshairBase<LineCrosshairCfg> {
  public static tag = 'line-crosshair';

  protected static defaultOptions = {
    type: LineCrosshair.tag,
    style: LINE_CROSSHAIR_DEFAULT_STYLE,
  };

  protected get crosshairPath() {
    const {
      startPos: [sx, sy],
      endPos: [ex, ey],
    } = this.attributes;
    const path = [['M', 0, 0], ['L', ex - sx, ey - sy], ['Z']] as PathCommand[];
    return path;
  }

  private get isVertical() {
    const {
      startPos: [x1, y1],
      endPos: [x2, y2],
    } = this.attributes;
    return x1 === x2 && y1 !== y2;
  }

  private get tagShapeSpace() {
    const { width, height } = getShapeSpace(this.tagShape);
    return { width, height };
  }

  private get basePos() {
    const { startPos } = this.attributes;
    return startPos;
  }

  constructor(options: LineCrosshairOptions) {
    super(deepAssign({}, LineCrosshair.defaultOptions, options));
  }

  public update(cfg: Partial<LineCrosshairCfg>) {
    super.update(cfg);
  }

  /**
   * 将线移动至对应位置
   */
  @throttle(20)
  public setPointer(pointer: Point) {
    super.setPointer(pointer);
    const [x, y] = pointer;
    const [bx, by] = this.basePos;
    this.setLocalPosition(this.getOrientVal([bx, y], [x, by]));
  }

  public setText(text: string) {
    this.tagShape.update({ text });
  }

  /**
   * 调整tag和this位置
   */
  protected adjustLayout() {
    const { text } = this.attributes;
    if (!text || text === '') {
      this.tagShape.hide();
      return;
    }
    this.tagShape.show();
    const { position } = text as { position: 'start' | 'end' };
    const { width, height } = this.tagShapeSpace;
    const {
      startPos: [x1, y1],
      endPos: [x2, y2],
    } = this.attributes;
    this.setLocalPosition(x1, y1);
    // 基准位置
    const [x, y] = position === 'start' ? [x1, y1] : [x2, y2];
    // 偏移量
    const [xOffset, yOffset] = this.getOrientVal(
      {
        start: [-width, -height / 2],
        end: [0, -height / 2],
      },
      {
        start: [-width / 2, -height],
        end: [-width / 2, 0],
      }
    )[position];
    this.tagShape.setLocalPosition(xOffset, yOffset);
  }

  private getOrientVal<T>(v1: T, v2: T): T {
    return this.isVertical ? v2 : v1;
  }
}
