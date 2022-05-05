import { DisplayObject, Path } from '@antv/g';
import { DegToRad } from '../util';
import { Bounds } from './bounds';

/**
 * Detect whether line-line collision.
 * From: https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
 */
function lineToLine(line1: number[], line2: number[]) {
  const [x0, y0, x1, y1] = line1;
  const [x2, y2, x3, y3] = line2;
  const s10x = x1 - x0;
  const s10y = y1 - y0;
  const s32x = x3 - x2;
  const s32y = y3 - y2;

  const denom = s10x * s32y - s32x * s10y;
  if (denom === 0) return false;
  const denomPositive = denom > 0;

  const s02x = x0 - x2;
  const s02y = y0 - y2;
  const sNumer = s10x * s02y - s10y * s02x;
  if (sNumer < 0 === denomPositive) return false;

  const tNumer = s32x * s02y - s32y * s02x;
  if (tNumer < 0 === denomPositive) return false;

  if (sNumer > denom === denomPositive || tNumer > denom === denomPositive) return false;

  return true;
}

function intersectBoxLine(box: number[] /** 八个顶点 */, line: number[]): boolean {
  const lines = [
    [box[0], box[1], box[2], box[3]],
    [box[2], box[3], box[4], box[5]],
    [box[4], box[5], box[6], box[7]],
    [box[6], box[7], box[0], box[1]],
  ];

  return lines.some((boxLine) => lineToLine(line, boxLine));
}

function bound(bounds: Bounds, item: DisplayObject<any>, margin = [0, 0, 0, 0]) {
  const angle = item.getEulerAngles() || 0;
  item.setEulerAngles(0);
  // get dimensions
  const { left, top, width: w, height: h, right, bottom } = item.getBBox();

  const x = left;
  const y = top;
  let height = h;
  let dx = 0;
  let dy = 0;
  let anchorX = x;
  let anchorY = y;
  if (item.tagName === 'text') {
    // [to fix] 目前 G 上计算 bbox 有一点误差
    height -= 1.5;
    const a = item.style.textAlign;
    const b = item.style.textBaseline;
    dx = item.style.dx;
    dy = item.style.dy;

    // horizontal alignment
    if (a === 'center') {
      anchorX = (x + right) / 2;
    } else if (a === 'right' || a === 'end') {
      anchorX = right;
    } else {
      // left by default, do nothing
    }

    // vertical alignment
    if (b === 'middle') {
      anchorY = (y + bottom) / 2;
    } else if (b === 'bottom' || b === 'baseline') {
      anchorY = bottom;
    }
  }

  const [t = 0, r = 0, b = t, l = r] = margin;
  bounds.set((dx += x) - l, (dy += y) - t, dx + w + r, dy + height + b);
  item.setEulerAngles(angle);
  return bounds.rotatedPoints(angle * DegToRad, anchorX, anchorY);
}

export const IntersectUtils = { lineToLine, intersectBoxLine, bound };

export function intersect(a: DisplayObject<any>, b: DisplayObject<any>, margin?: number[]) {
  const p = bound(new Bounds(), a, margin);
  const q = bound(new Bounds(), b, margin);
  const result =
    intersectBoxLine(q, [p[0], p[1], p[2], p[3]]) ||
    intersectBoxLine(q, [p[0], p[1], p[4], p[5]]) ||
    intersectBoxLine(q, [p[4], p[5], p[6], p[7]]) ||
    intersectBoxLine(q, [p[2], p[3], p[6], p[7]]);
  const debug = localStorage.getItem('__debug__');
  // @ts-ignore
  if (debug && window.canvas) {
    const draw = (points: any[], stroke = 'red') =>
      // @ts-ignore
      window.canvas.appendChild(
        new Path({
          style: {
            lineWidth: 1,
            stroke,
            path: [
              ['M', points[0], points[1]],
              ['L', points[2], points[3]],
              ['L', points[4], points[5]],
              ['L', points[6], points[7]],
              ['Z'],
            ],
          },
        })
      );
    draw(p);
    draw(q, 'blue');
  }
  return result;
}
