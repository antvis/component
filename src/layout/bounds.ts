export class Bounds {
  private x1: number;

  private y1: number;

  private x2: number;

  private y2: number;

  constructor(box?: { top?: number; left?: number; right?: number; bottom?: number }) {
    const { left: x1, top: y1, right: x2, bottom: y2 } = box || {};
    this.x1 = x1 ?? +Number.MAX_VALUE;
    this.x2 = x2 ?? -Number.MAX_VALUE;
    this.y1 = y1 ?? +Number.MAX_VALUE;
    this.y2 = y2 ?? -Number.MAX_VALUE;
  }

  public get left() {
    return this.x1;
  }

  public get top() {
    return this.y1;
  }

  public get right() {
    return this.x2;
  }

  public get bottom() {
    return this.y2;
  }

  public get width() {
    return this.defined('x2') && this.defined('x1') ? this.x2 - this.x1 : undefined;
  }

  public get height() {
    return this.defined('y2') && this.defined('y1') ? this.y2 - this.y1 : undefined;
  }

  clear() {
    this.x1 = +Number.MAX_VALUE;
    this.y1 = +Number.MAX_VALUE;
    this.x2 = -Number.MAX_VALUE;
    this.y2 = -Number.MAX_VALUE;
    return this;
  }

  empty() {
    return (
      this.x1 === +Number.MAX_VALUE &&
      this.y1 === +Number.MAX_VALUE &&
      this.x2 === -Number.MAX_VALUE &&
      this.y2 === -Number.MAX_VALUE
    );
  }

  add(x: number, y: number) {
    if (x < this.x1) this.x1 = x;
    if (y < this.y1) this.y1 = y;
    if (x > this.x2) this.x2 = x;
    if (y > this.y2) this.y2 = y;
    return this;
  }

  rotate(angle: number, x: number, y: number) {
    const p = this.rotatedPoints(angle, x, y);
    return this.clear().add(p[0], p[1]).add(p[2], p[3]).add(p[4], p[5]).add(p[6], p[7]);
  }

  rotatedPoints(radian: number, x: number, y: number) {
    const { x1, y1, x2, y2 } = this;
    const cos = Math.cos(radian);
    const sin = Math.sin(radian);
    const cx = x - x * cos + y * sin;
    const cy = y - x * sin - y * cos;
    const points = [
      [cos * x1 - sin * y1 + cx, sin * x1 + cos * y1 + cy],
      [cos * x1 - sin * y2 + cx, sin * x1 + cos * y2 + cy],
      [cos * x2 - sin * y2 + cx, sin * x2 + cos * y2 + cy],
      [cos * x2 - sin * y1 + cx, sin * x2 + cos * y1 + cy],
    ];
    return points.flat(1);
  }

  set(x1: number, y1: number, x2: number, y2: number) {
    if (x2 < x1) {
      this.x2 = x1;
      this.x1 = x2;
    } else {
      this.x1 = x1;
      this.x2 = x2;
    }
    if (y2 < y1) {
      this.y2 = y1;
      this.y1 = y2;
    } else {
      this.y1 = y1;
      this.y2 = y2;
    }
    return this;
  }

  intersects(b: Bounds) {
    return b && !(this.x2 < b.x1 || this.x1 > b.x2 || this.y2 < b.y1 || this.y1 > b.y2);
  }

  defined(key: 'left' | 'right' | 'top' | 'bottom' | 'x1' | 'x2' | 'y1' | 'y2') {
    return this[key] !== Number.MAX_VALUE && this[key] !== -Number.MAX_VALUE;
  }
}
