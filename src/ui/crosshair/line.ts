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

  /**
   * 获得 pointer 的相对坐标
   */
  protected get localPointer() {
    if (!this.pointer) return this.attributes.startPos;
    const [bx, by] = this.getPosition();
    const [x, y] = this.pointer;
    return [x - bx, y - by];
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
    this.adjustPosition();
  }

  public setText(text: string) {
    this.tagShape.update({ text });
    this.adjustTag();
  }

  protected adjustLayout() {
    this.adjustPosition();
    this.adjustTag();
  }

  /**
   * 调整this位置
   */
  private adjustPosition() {
    const [lx, ly] = this.localPointer;
    const {
      startPos: [sx, sy],
    } = this.attributes;
    const targetPos = this.getOrientVal<[number, number]>([sx, ly], [lx, sy]);
    this.shapesGroup.setLocalPosition(targetPos);
  }

  /**
   * 调整tag位置
   */
  private adjustTag() {
    const {
      text,
      startPos: [x1, y1],
      endPos: [x2, y2],
    } = this.attributes;

    if (!text || text === '') {
      this.tagShape.hide();
      return;
    }
    this.tagShape.show();

    const { position } = text as { position: 'start' | 'end' };
    const { width, height } = this.tagShapeSpace;
    // 偏移量
    const [xOffset, yOffset] = this.getOrientVal(
      {
        start: [-width, -height / 2],
        end: [x2 - x1, -height / 2],
      },
      {
        start: [-width / 2, -height],
        end: [-width / 2, y2 - y1],
      }
    )[position];
    this.tagShape.setLocalPosition(xOffset, yOffset);
  }

  private getOrientVal<T>(v1: T, v2: T): T {
    return this.isVertical ? v2 : v1;
  }
}
